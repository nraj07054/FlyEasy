export interface Flight {
    airline: string;          // "IndiGo", "Air India"
    flightNumber: string;     // "6E 2134"

    departTime: string;       // e.g. "2026-02-10 06:20"
    arriveTime: string;      // e.g. "2026-02-10 08:35"

    totalFare: number;        // ONLY price SerpAPI guarantees
    currency: string;         // "INR"

    stops: number;            // 0, 1, 2...
    durationMinutes: number;  // total_duration from SerpAPI

    raw?: any;
}
