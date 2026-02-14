import type {Offer} from "./offer.types.ts";
import type {OfferContext} from "./offer.context.ts";

function computeCappedDiscount(
    fare: number,
    offer: Offer
): number {
    let rawDiscount =
        offer.discount.unit === "FLAT"
            ? offer.discount.value
            : (offer.discount.value / 100) * fare;

    if (typeof offer.discount.maxCap === "number") {
        rawDiscount = Math.min(rawDiscount, offer.discount.maxCap);
    }

    return Math.floor(Math.max(0, rawDiscount));
}

export function getBestAndOtherOffers(
    context: OfferContext,
    offers: Offer[],
    flightFare: number
) {
    // Step 1: eligibility (your existing logic)
    const applicableOffers = getApplicableOffers(context, offers);

    // Step 2: evaluate & normalize
    const evaluated = applicableOffers
        .map((offer) => {
            const discount = computeCappedDiscount(flightFare, offer);

            return {
                offer,
                discount,
                finalFare: flightFare - discount,
                breakdown: {
                    unit: offer.discount.unit,
                    value: offer.discount.value,
                    maxCap: offer.discount.maxCap ?? null,
                    appliedDiscount: discount
                }
            };
        })
        .filter(o => o.discount > 0) // ignore useless offers
        .sort((a, b) => b.discount - a.discount);

    // Step 3: split best vs others
    if (evaluated.length === 0) {
        return {
            bestOffer: null,
            otherOffers: []
        };
    }

    const [bestOffer, ...otherOffers] = evaluated;

    return {
        bestOffer,
        otherOffers
    };
}


export function getApplicableOffers(
    context: OfferContext,
    offers: Offer[]
): Offer[] {
    const bookingDay = context.bookingDate
        .toLocaleDateString("en-US", {weekday: "short"})
        .toUpperCase();

    return offers.filter((offer) => {
        // 1️⃣ Issuer type + issuer
        // 1️⃣ Issuer validation (BANK vs NETWORK)
        if (offer.issuerType === "BANK") {
            if (context.card.issuerType !== "BANK") return false;
            if (offer.issuer !== context.card.issuer) return false;
        }

        if (offer.issuerType === "NETWORK") {
            if (!context.card.network) return false;
            if (offer.issuer !== context.card.network) return false;
        }

        // 2️⃣ Card type
        if (offer.cardType !== context.card.cardType) return false;

        // 3️⃣ Card Variant
        if (
            offer.eligibleVariants &&
            context.card.variant &&
            !offer.eligibleVariants.includes(context.card.variant)
        ) {
            return false;
        }

        // 4️⃣ Min booking amount (UPDATED)
        const bookingAmount =
            context.fare?.baseFare ?? context.bookingAmount;

        if (bookingAmount < offer.minBookingAmount) return false;

        // 5️⃣ Date range (booking date)
        const bookingTime = context.bookingDate.getTime();
        const start = new Date(offer.validOn.startDate).getTime();
        const end = new Date(offer.validOn.endDate).getTime();

        if (bookingTime < start || bookingTime > end) return false;

        // 6️⃣ Booking day validity
        if (
            !offer.validOn.days.includes("ALL") &&
            !offer.validOn.days.includes(bookingDay)
        ) {
            return false;
        }

        return true;
    });
}

