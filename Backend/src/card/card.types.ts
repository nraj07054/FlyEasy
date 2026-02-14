export type CardType = "CREDIT" | "DEBIT";
export type CardNetwork = "VISA" | "MASTERCARD" | "RUPAY" | "AMEX";

export type CardResolutionStatus =
    | "EXACT"
    | "BANK_ONLY"
    | "AMBIGUOUS"
    | "UNKNOWN";

export interface NormalizedCard {
    issuingBank: string | null;
    cardVariant: string | null;
    cardType: CardType | null;
    network: CardNetwork | null;
    confidence: number;
    resolutionStatus?: CardResolutionStatus;
}
