export function getGoibiboOffers() {
    return [
        {
            source: "GOIBIBO",

            bank: "ICICI",

            cardType: "CREDIT",

            discount: {
                type: "INSTANT",
                value: 12,
                unit: "PERCENT",
                maxCap: 1200
            },

            minBookingAmount: 4000,

            validOn: {
                startDate: "2026-01-05",
                endDate: "2026-01-25",
                days: ["WED", "THU"]
            },

            promoCode: "ICICIFLY",

            tnc: "Valid only on ICICI Bank Credit Cards"
        }
    ];
}
