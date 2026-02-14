import type {NextFunction, Request, Response} from "express";
import {normalizeCityWithGemini, runQuery} from "../services/gemini.service.ts";
import {buildCardClarification, normalizeCard, resolveCard} from "../card/card.service.ts";
import type {SearchContextModel} from "../models/searchContext.model.ts";
import {searchFlightsSerpAPI} from "../services/flightSearch.serpApi.ts";
import {normalizeFutureDate} from "../utils/date.utils.ts";

interface searchBody {
    flightSearchQuery: string;
}

function buildPrompt(query: string) {
    return `
        You are a travel and payment parser. 
        
        Convert the user query into valid JSON.
        Return ONLY JSON. No text. No explanation.
        
        Schema:
        {
          "origin": string | null,
          "destination": string | null,
          "departureDate": string | null,
          "returnDate": string | null,
          "adults": number | 0,
          "children": number | 0,
          "infants": number | null,
          "tripType": "ONE_WAY" | "ROUND_TRIP",
          "flexibleDates": boolean,
          "mentionedCards": string[]
        }
        
        Rules:
        - Use airport city codes when possible (NYC, DEL, CCU).
        - For "mentionedCards", extract the names EXACTLY as written by the user. Do not normalize.
        - If no cards are mentioned, return an empty array [].
        - If travel details are missing, use null.
        
        Rules for dates:
        - If the user mentions a date WITHOUT a year (e.g. "10 Feb"):
        - Assume the date is in the FUTURE
        - Use the current year if the date has not passed yet
        - Otherwise use the next year
        - Never return past dates
        
        User query:
        "${query}"
        `
}

function decideNextResponse(context: SearchContextModel) {
    // 🚨 Never ask a new question if one is already pending
    if (
        context.intentClarification &&
        (
            context.intentClarification.type === "ORIGIN" ||
            context.intentClarification.type === "DESTINATION" ||
            context.intentClarification.type === "DEPARTURE_DATE"
        )
    ) {
        return null;
    }


    // 🔹 Intent clarification (order matters)
    if (!context.intent?.origin) {
        return {
            nextAction: "ASK_CLARIFICATION",
            clarification: {
                type: "ORIGIN",
                message: "From which city are you flying?"
            }
        };
    }

    if (!context.intent?.destination) {
        return {
            nextAction: "ASK_CLARIFICATION",
            clarification: {
                type: "DESTINATION",
                message: "Where do you want to fly to?"
            }
        };
    }

    if (!context.intent?.departureDate) {
        return {
            nextAction: "ASK_CLARIFICATION",
            clarification: {
                type: "DEPARTURE_DATE",
                message: "When do you want to travel?"
            }
        };
    }

    // 🔹 Card clarification
    const cardClarification = buildCardClarification(
        context.cards.resolved ?? [],
        context
    );

    if (cardClarification) {
        return {
            nextAction: "ASK_CLARIFICATION",
            clarification: cardClarification
        };
    }

    // ✅ Everything is complete
    return {
        nextAction: "SHOW_FLIGHTS"
    };
}


export const search = async (
    req: Request<{}, {}, searchBody>,
    res: Response,
    next: NextFunction
) => {
    try {
        const {flightSearchQuery} = req.body;

        if (!flightSearchQuery?.trim()) {
            return res.status(400).json({error: "Invalid query"});
        }

        /* ---------------- 1. Init Context ---------------- */
        if (!req.session.context) {
            req.session.context = {
                cards: {rawMentions: [], resolved: []},
                meta: {nextAction: "SEARCH_FLIGHTS"},
                // FIX 1: Initialize intent to avoid "undefined" errors later
                intent: {
                    origin: null,
                    destination: null,
                    departureDate: null,
                    returnDate: null,
                    adults: 1,      // Default
                    children: 0,
                    infants: 0,
                    tripType: "ONE_WAY",
                    flexibleDates: false
                }
            };
        }
        const context = req.session.context as SearchContextModel;

        // Helper to ensure intent object exists before we write to it
        if (!context.intent) context.intent = {};

        /* ---------------- 2. Process Follow-up Answers ---------------- */
        let isFollowUpProcessed = false;

        // A. Handle Card clarification
        if (context.cards.unresolved) {
            const resolved = resolveCard(
                normalizeCard(`${context.cards.unresolved.issuingBank} ${flightSearchQuery}`)
            );

            // Merge logic: Update only the specific card that was unresolved
            context.cards.resolved = (context.cards.resolved ?? []).map(card =>
                card.issuingBank === resolved.issuingBank ? resolved : card
            );

            context.cards.unresolved = undefined;
            isFollowUpProcessed = true;
        }

        // B. Handle Intent clarification (Origin, Destination, Date)
        if (context.intentClarification && !isFollowUpProcessed) {
            const answer = flightSearchQuery;

            if (context.intentClarification.type === "ORIGIN") {
                const city = await normalizeCityWithGemini(answer);
                if (city) context.intent.origin = city;
            } else if (context.intentClarification.type === "DESTINATION") {
                const city = await normalizeCityWithGemini(answer);
                if (city) context.intent.destination = city;
            } else if (context.intentClarification.type === "DEPARTURE_DATE") {
                const date = normalizeFutureDate(answer);
                if (date) context.intent.departureDate = date;
            }

            // Clear the flag so we don't ask again immediately
            context.intentClarification = undefined;
            isFollowUpProcessed = true;
        }

        /* ---------------- 3. Gemini Extraction (New Queries) ---------------- */
        // Only run Gemini if this is NOT a direct answer to a question
        if (!isFollowUpProcessed) {
            const extracted = await runQuery(buildPrompt(flightSearchQuery));

            extracted.departureDate = normalizeFutureDate(extracted.departureDate);
            extracted.returnDate = normalizeFutureDate(extracted.returnDate);

            // FIX 2: Card Preservation
            // Only overwrite cards if the user explicitly mentioned new ones.
            // If extracted.mentionedCards is empty, keep the old ones (user implied same payment context).
            if (extracted.mentionedCards && extracted.mentionedCards.length > 0) {
                context.cards.rawMentions = extracted.mentionedCards;
                context.cards.resolved = extracted.mentionedCards.map(raw =>
                    resolveCard(normalizeCard(raw))
                );
            }

            // Update Intent (Merge new data over old data)
            context.intent = {
                origin: extracted.origin ?? context.intent.origin,
                destination: extracted.destination ?? context.intent.destination,
                departureDate: extracted.departureDate ?? context.intent.departureDate,
                returnDate: extracted.returnDate ?? context.intent.returnDate,

                // Fallback to existing context, then to default (1)
                adults: extracted.adults || context.intent.adults || 1,
                children: extracted.children || context.intent.children || 0,
                infants: extracted.infants || context.intent.infants || 0,

                tripType: extracted.tripType === "ROUND_TRIP" ? "ROUND_TRIP" : (context.intent.tripType || "ONE_WAY"),
                flexibleDates: extracted.flexibleDates ?? context.intent.flexibleDates ?? false
            };
        }

        /* ---------------- 4. Decision Engine ---------------- */
        const decision = decideNextResponse(context);

        if (decision?.nextAction === "ASK_CLARIFICATION") {
            // Set state for the NEXT request to know what we are asking
            if (["ORIGIN", "DESTINATION", "DEPARTURE_DATE"].includes(decision.clarification.type)) {
                context.intentClarification = {type: decision.clarification.type};
            } else {
                // If it's a card clarification, we don't use intentClarification
                context.intentClarification = undefined;
            }

            req.session.context = context;
            return res.status(200).json(decision);
        }

        /* ---------------- 5. Execute Flight Search ---------------- */
        // FIX 3: Ensure we have data before searching (Typescript Safety)
        if (!context.intent.origin || !context.intent.destination || !context.intent.departureDate) {
            // Fallback: This should ideally not happen if decideNextResponse works correctly
            return res.status(400).json({error: "Missing required flight details."});
        }

        const flights = await searchFlightsSerpAPI({
            origin: context.intent.origin,
            destination: context.intent.destination,
            departureDate: context.intent.departureDate,
            // Safe defaults now guaranteed
            adults: context.intent.adults || 1,
            children: context.intent.children || 0,
            infantsOnLap: context.intent.infants || 0,
            infantsInSeat: 0
        });

        // Save final state
        req.session.context = context;

        return res.json({
            nextAction: "SHOW_FLIGHTS",
            state: {context, flights}
        });

    } catch (err) {
        next(err);
    }
};

// Default response after all clarification
/*
{
    "nextAction": "SEARCH_FLIGHTS",
    "state": {
    "context": {
        "cards": {
            "rawMentions": [
                "regalia hdfc card",
                "icici card"
            ],
                "resolved": [
                {
                    "issuingBank": "HDFC",
                    "cardVariant": "REGALIA",
                    "cardType": "CREDIT",
                    "network": "VISA",
                    "confidence": 1,
                    "resolutionStatus": "EXACT"
                },
                {
                    "issuingBank": "ICICI",
                    "cardVariant": "CORAL",
                    "cardType": "CREDIT",
                    "network": "RUPAY",
                    "confidence": 1,
                    "resolutionStatus": "EXACT"
                }
            ]
        },
        "meta": {
            "nextAction": "SEARCH_FLIGHTS"
        },
        "intent": {
                "origin": "DEL",
                "destination": "MAA",
                "departureDate": "2025-02-03",
                "returnDate": null,
                "adults": 1,
                "children": 1,
                "infants": 1,
                "tripType": "ONE_WAY",
                "flexibleDates": false
        }
    }
}
}
*/