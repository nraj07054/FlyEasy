export type IssuerType = "BANK" | "NETWORK";

export type CardType = "CREDIT" | "DEBIT";

export type DiscountUnit = "PERCENT" | "FLAT";
export type DiscountType = "INSTANT" | "CASHBACK";

export type Day =
    | "MON"
    | "TUE"
    | "WED"
    | "THU"
    | "FRI"
    | "SAT"
    | "SUN"
    | "ALL";

export interface Offer {
    source: string;

    issuerType: IssuerType;
    issuer: string;

    cardType: CardType;
    emi: boolean;
    eligibleVariants?: string[];

    discount: {
        type: DiscountType;
        value: number;
        unit: DiscountUnit;
        maxCap?: number;
    };

    minBookingAmount: number;

    validOn: {
        startDate: string;
        endDate: string;
        days: Day[];
    };

    promoCode?: string;

    detailedTNC: string[];
}
