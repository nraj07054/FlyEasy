interface Card {
    "issuingBank": string,
    "cardVariant": string,
    "cardType": string,
    "network": string,
    "confidence": number,
    "resolutionStatus": string
}

export interface SearchContextModel {
    intent?: {
        origin: string | null
        destination: string | null
        departureDate: string | null
        returnDate: string | null
        adults: number
        children: number
        infants: number
        tripType: 'ONE_WAY' | 'ROUND_TRIP'
        flexibleDates: boolean
    }
    
    intentClarification?: {
        type: "ORIGIN" | "DESTINATION" | "DEPARTURE_DATE";
    };

    cards: {
        rawMentions: string[]
        resolved: Card[]
        unresolved?: Card
    }

    flights?: any[]

    meta: {
        nextAction: 'ASK_CLARIFICATION' | 'SEARCH_FLIGHTS'
    }
}
