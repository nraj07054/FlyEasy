import type {OfferContext} from "./offer.context.ts";

/**
 * Builds OfferContext from searchController output + one resolved card
 * This file is ONLY an adapter (no business logic)
 */
export function buildOfferContextFromSelection(
    selectedFlight: {
        flightNumber: string;
        origin?: string;
        destination?: string;
        departureDate?: string;
        fare: {
            total: number;
            baseFare?: number;
            taxes?: number;
        };
    },
    resolvedCard: {
        issuingBank: string;
        cardType: "CREDIT" | "DEBIT";
        network: string;
        cardVariant?: string;
    },
    emi: boolean
): OfferContext {

    if (!selectedFlight?.fare?.total) {
        throw new Error("Invalid selectedFlight: fare.total missing");
    }

    return {
        // Booking happens NOW
        bookingDate: new Date(),

        // Default booking amount (safe fallback)
        bookingAmount: selectedFlight.fare.total,

        // Optional future-proof fields
        fare: {
            total: selectedFlight.fare.total,
            baseFare: selectedFlight.fare.baseFare ?? selectedFlight.fare.total,
            taxes: selectedFlight.fare.taxes ?? 0
        },

        route: selectedFlight.origin && selectedFlight.destination
            ? {
                origin: selectedFlight.origin,
                destination: selectedFlight.destination
            }
            : undefined,

        travelDate: selectedFlight.departureDate
            ? new Date(selectedFlight.departureDate)
            : undefined,

        card: {
            issuerType: "BANK",
            issuer: resolvedCard.issuingBank,
            cardType: resolvedCard.cardType,
            emi,
            variant: resolvedCard.cardVariant,
            network: resolvedCard.network
        }

    };
}

