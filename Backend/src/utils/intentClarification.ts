import type {SearchContextModel} from "../models/searchContext.model.ts";

export function checkIntentClarification(
    context: SearchContextModel
) {
    const intent = context.intent;

    if (!intent?.origin) {
        return {
            type: "ORIGIN" as const,
            message: "From which city are you flying?"
        };
    }

    if (!intent?.destination) {
        return {
            type: "DESTINATION" as const,
            message: "Where do you want to fly to?"
        };
    }

    if (!intent?.departureDate) {
        return {
            type: "DEPARTURE_DATE" as const,
            message: "When do you want to travel?"
        };
    }

    return null;
}
