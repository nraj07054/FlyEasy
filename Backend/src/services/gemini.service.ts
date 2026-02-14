import {GoogleGenAI} from "@google/genai";
import {z} from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";

export const flightSearchSchema = z.object({
    origin: z.string().nullable().optional()
        .describe("Departure city or airport code."),

    destination: z.string().nullable().optional()
        .describe("Destination city or airport code."),

    departureDate: z.string().nullable().optional()
        .describe("Departure date (YYYY-MM or YYYY-MM-DD)."),

    returnDate: z.string().nullable().optional()
        .describe("Return date if round trip."),

    adults: z.number().int().optional().default(1)
        .describe("Number of adults (age 12+). Default to 1 if unspecified."),

    children: z.number().int().optional().default(0)
        .describe("Number of children (age 2-11). Default to 0."),

    infants: z.preprocess(
        (v) => v === null ? undefined : v,
        z.number().int().default(0)
    ).describe("Number of infants (under 2). Default to 0."),

    tripType: z.enum(["ONE_WAY", "ROUND_TRIP"])
        .nullable()
        .optional()
        .describe("Trip type."),

    flexibleDates: z.boolean().nullable().optional()
        .describe("Whether dates are flexible."),

    mentionedCards: z.array(z.string())
        .optional()
        .default([])
        .describe("Raw credit card names mentioned by the user.")
});

const cityNormalizeSchema = z.object({
    cityCode: z.string().nullable()
        .describe("IATA city or airport code, e.g. DEL, BOM, BLR.")
});

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export async function runQuery(query: string) {
    // @ts-ignore
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: query,
        config: {
            systemInstruction: "You are a Conversational Flight Booking Assistant.",
            responseMimeType: "application/json",
            responseJsonSchema: zodToJsonSchema(flightSearchSchema),
        },
    });

    if (!response.text) {
        throw new Error("Could not find the query.")
    }

    // 1️⃣ Parse JSON
    const parsed = JSON.parse(response.text);

    // 2️⃣ Validate against Zod (IMPORTANT)
    return flightSearchSchema.parse(parsed);
}

export async function normalizeCityWithGemini(input: string) {
    const prompt = `
        Convert the following city name into an IATA city code.
        
        Return ONLY JSON. No text.
        
        Schema:
        {
          "cityCode": string | null
        }
        
        Rules:
        - Use standard airport city codes (DEL, BOM, BLR, MAA).
        - If unclear or ambiguous, return null.
        
        Input:
        "${input}" `;

    // @ts-ignore
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: zodToJsonSchema(cityNormalizeSchema),
        },
    });

    if (!response.text) {
        throw new Error("Could not normalize city");
    }

    const parsed = JSON.parse(response.text);
    return cityNormalizeSchema.parse(parsed).cityCode;
}

