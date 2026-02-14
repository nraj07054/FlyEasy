export interface OfferContext {
    // When the booking is made (used for weekday / validity)
    bookingDate: Date;

    // Amount on which offer calculations apply (default = total fare)
    bookingAmount: number;

    // Fare breakdown (optional but critical for real offers)
    fare?: {
        total: number;
        baseFare: number;
        taxes: number;
        currency?: string;
    };

    // Route info (for domestic / international rules)
    route?: {
        origin: string;
        destination: string;
        isInternational?: boolean;
    };

    // Travel date (some offers depend on this)
    travelDate?: Date;

    // Passenger info (future-proof)
    passengers?: {
        adults: number;
        children: number;
        infants: number;
    };

    card: {
        issuerType: "BANK" | "NETWORK";
        issuer: string;
        cardType: "CREDIT" | "DEBIT";
        emi: boolean;
        variant?: string;
        network?: string;
    };
}
