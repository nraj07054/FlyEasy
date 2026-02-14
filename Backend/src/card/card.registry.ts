export type CardType = "CREDIT" | "DEBIT";
export type CardNetwork = "VISA" | "MASTERCARD" | "RUPAY" | "AMEX";

export interface CardRegistryEntry {
    issuingBank: string;
    cardVariant: string;
    cardType: CardType;
    network: CardNetwork | null;
    aliases: string[];
    active: boolean;
}

/**
 * NOTE:
 * - This will later come from DB
 */
export const CardRegistry: CardRegistryEntry[] = [
    {
        issuingBank: "ICICI",
        cardVariant: "CORAL",
        cardType: "CREDIT",
        network: "RUPAY",
        active: true,
        aliases: [
            "icici coral",
            "coral credit card",
            "icici coral rupay",
            "coral rupay credit card"
        ]
    },
    {
        issuingBank: "HDFC",
        cardVariant: "REGALIA",
        cardType: "CREDIT",
        network: "VISA",
        active: true,
        aliases: [
            "hdfc regalia",
            "regalia credit card",
            "regalia hdfc"
        ]
    },
    {
        issuingBank: "HDFC",
        cardVariant: "MILLENNIA",
        cardType: "CREDIT",
        network: "VISA",
        active: true,
        aliases: [
            "hdfc millennia",
            "millennia credit card",
            "millennia hdfc"
        ]
    }
];
