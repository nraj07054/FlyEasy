export function getCleartripOffers() {
    return [
        {
            source: "CLEARTRIP",

            bank: "SBI",

            cardType: "CREDIT",

            discount: {
                type: "CASHBACK",
                value: 1000,
                unit: "FLAT"
            },

            minBookingAmount: 6000,

            validOn: {
                startDate: "2026-01-10",
                endDate: "2026-02-10"
            },

            promoCode: "SBIFLY",

            tnc: "Cashback credited within 30 days"
        }
    ];
}
