import type {Offer} from "../offer.types.ts";

export function getMMTOffers(): Offer[] {
    return [
        {
            source: "MMT",

            issuerType: "BANK",
            issuer: "HDFC",

            cardType: "CREDIT",
            emi: true,

            discount: {type: "INSTANT", value: 1250, unit: "FLAT", maxCap: 2000},
            minBookingAmount: 7500,

            validOn: {
                startDate: "2026-02-01",
                endDate: "2026-02-28",
                days: ["ALL"]
            },

            promoCode: "HDFCEMI",

            detailedTNC: [
                "Valid only on HDFC Bank EasyEMI transactions (3, 6, 9, 12 months).",
                "Excluded: HDFC Bank Business, Corporate, and Commercial cards.",
                "Excluded: HDFC Bank Paytm Credit Cards.",
                "Offer capped at 1 booking per card per month.",
                "EMI foreclosure will lead to reversal of the discount benefit."
            ]
        },

        {
            source: "MMT",

            issuerType: "BANK",
            issuer: "ICICI",

            cardType: "CREDIT",
            emi: true,

            discount: {type: "INSTANT", value: 10, unit: "PERCENT", maxCap: 1000},
            minBookingAmount: 5000,

            validOn: {
                startDate: "2026-02-01",
                endDate: "2026-02-28",
                days: ["MON"]
            },

            promoCode: "FLYMONEMI",

            detailedTNC: [
                "Valid on Mondays only for ICICI Bank Credit Card EMI transactions.",
                "Excluded: Amazon Pay ICICI, Corporate, and Business cards.",
                "Frequency: Valid for 1 transaction per category per user per month.",
                "Not valid on Multi-City flight bookings."
            ]
        },

        {
            source: "MMT",

            issuerType: "BANK",
            issuer: "SBI",

            cardType: "DEBIT",
            emi: false,

            discount: {type: "INSTANT", value: 10, unit: "PERCENT", maxCap: 1500},
            minBookingAmount: 5000,

            validOn: {
                startDate: "2026-02-01",
                endDate: "2026-02-28",
                days: ["ALL"]
            },

            promoCode: "SBIDC",

            detailedTNC: [
                "Valid only on SBI Debit Cards. SBI Credit Cards are excluded.",
                "Applicable once per card per week (Tier reset every Monday).",
                "Discount calculated on base fare only; excludes taxes and convenience fees.",
                "Offer is valid on both Domestic and International flight bookings."
            ]
        },

        {
            source: "MMT",

            issuerType: "BANK",
            issuer: "AXIS",

            cardType: "CREDIT",
            emi: true,

            discount: {type: "INSTANT", value: 10, unit: "PERCENT", maxCap: 1800},
            minBookingAmount: 7500,

            validOn: {
                startDate: "2026-01-01",
                endDate: "2026-12-31",
                days: ["ALL"]
            },

            promoCode: "AXISEMI",

            detailedTNC: [
                "Includes 3-month No-Cost EMI + 10% Instant Discount.",
                "Valid only for Indian retail cards; Corporate/Business cards are excluded.",
                "Valid only on the MakeMyTrip App and Desktop site.",
                "Rescheduling/cancellation will lead to forfeiture of the discount."
            ]
        },

        {
            source: "MMT",

            issuerType: "BANK",
            issuer: "CANARA",

            cardType: "CREDIT",
            emi: false,

            discount: {type: "INSTANT", value: 12, unit: "PERCENT", maxCap: 1800},
            minBookingAmount: 5000,

            validOn: {
                startDate: "2026-02-01",
                endDate: "2026-02-28",
                days: ["WED", "SAT"]
            },

            promoCode: "MMTCANARA",

            detailedTNC: [
                "Valid on Canara Bank Credit Cards (Retail) only.",
                "Frequency: One booking per category (Flight/Hotel) per month.",
                "Excluded: Corporate cards, Prepaid cards, and Net Banking.",
                "Not applicable on 'Multi-City' tab bookings."
            ]
        },

        {
            source: "MMT",

            issuerType: "BANK",
            issuer: "AU BANK",

            cardType: "CREDIT",
            emi: true,

            discount: {type: "INSTANT", value: 10, unit: "PERCENT", maxCap: 1800},
            minBookingAmount: 5000,

            validOn: {
                startDate: "2026-02-01",
                endDate: "2026-02-28",
                days: ["ALL"]
            },

            promoCode: "MMTAUEMI",

            detailedTNC: [
                "Valid on AU Small Finance Bank Credit Card No-Cost EMI (3 Months).",
                "Applicable once per user per month across domestic and international.",
                "Processing fee of ₹199 + GST is applicable at the bank's end.",
                "Excluded: AU Bank Debit cards and Corporate credit cards."
            ]
        },

        {
            source: "MMT",

            issuerType: "BANK",
            issuer: "HSBC",

            cardType: "CREDIT",
            emi: true,

            discount: {type: "INSTANT", value: 12, unit: "PERCENT", maxCap: 1800},
            minBookingAmount: 5000,

            validOn: {
                startDate: "2026-02-01",
                endDate: "2026-02-28",
                days: ["ALL"]
            },

            promoCode: "MMTHSBCEMI",

            detailedTNC: [
                "Valid on HSBC Credit Card EMI transactions (3 & 6 Months No-Cost EMI).",
                "Interest subvention cashback credited within 21 days by the bank.",
                "Frequency: 1 transaction per card per category throughout the month.",
                "Excluded: HSBC Corporate and Commercial cards."
            ]
        },

        {
            source: "MMT",

            issuerType: "BANK",
            issuer: "ONECARD",

            cardType: "CREDIT",
            emi: true,

            discount: {type: "INSTANT", value: 8, unit: "PERCENT", maxCap: 1200},
            minBookingAmount: 7500,

            validOn: {
                startDate: "2026-02-01",
                endDate: "2026-02-28",
                days: ["ALL"]
            },

            promoCode: "MMTONECARDEMI",

            detailedTNC: [
                "Valid on OneCard Credit Card EMI tenures (3, 6, 9, 12 months).",
                "Processing fee: ₹99 or 1% (whichever is higher) + GST charged by OneCard.",
                "Frequency: 1 booking per month across international and domestic flights.",
                "Rescheduling is not allowed for flights booked under this offer."
            ]
        },

        {
            source: "MMT",

            issuerType: "BANK",
            issuer: "IDFC FIRST",

            cardType: "CREDIT",
            emi: true,

            discount: {type: "INSTANT", value: 10, unit: "PERCENT", maxCap: 1500},
            minBookingAmount: 5000,

            validOn: {
                startDate: "2026-02-01",
                endDate: "2026-02-28",
                days: ["ALL"]
            },

            promoCode: "MMTIDFCNCEMI",

            detailedTNC: [
                "Valid on IDFC FIRST Bank Credit Card EMI (3 & 6 Months No-Cost EMI).",
                "Offer is valid for 1 booking per card per category throughout the month.",
                "Not valid on IDFC Debit cards or net banking.",
                "Offer reset: 1st day of every month."
            ]
        },

        {
            source: "MMT",

            issuerType: "NETWORK",
            issuer: "VISA",

            cardType: "CREDIT",
            emi: false,

            discount: {type: "INSTANT", value: 350, unit: "FLAT", maxCap: 350},
            minBookingAmount: 0,

            validOn: {
                startDate: "2026-01-01",
                endDate: "2026-03-31",
                days: ["ALL"]
            },

            promoCode: "VISASIGNATURE",

            detailedTNC: [
                "Benefit: 2 Complimentary seat selections per card per year (Max ₹350/seat).",
                "Valid only on Visa Signature Credit Cards issued in India.",
                "Can be clubbed with other bank offers available on the MMT platform.",
                "Not applicable on Visa Debit, Prepaid, or Infinite cards."
            ]
        }
    ];
}
