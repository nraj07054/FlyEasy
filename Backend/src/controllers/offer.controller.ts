import type {Request, Response} from "express";
import {getAllOffers} from "../offers/sources/index.ts";
import {buildOfferContextFromSelection} from "../offers/offer.context.adapter.ts";
import {getBestAndOtherOffers} from "../offers/offer.services.ts";

export function evaluateOffersController(req: Request, res: Response) {
    const {selectedFlight} = req.body;

    const context = req.session.context;
    if (!context) {
        return res.status(400).json({error: "Session expired"});
    }

    const selectedCards = context.cards?.resolved ?? [];
    const intent = context.intent;

    if (!selectedCards.length) {
        return res.status(400).json({error: "No cards selected in session"});
    }

    const allOffers = getAllOffers();

    // Enrich flight with session data
    selectedFlight.passengers = {
        adults: intent.adults,
        children: intent.children,
        infants: intent.infants
    };

    const results = selectedCards.map((card) => {
        const offerContext = buildOfferContextFromSelection(
            selectedFlight,
            card,
            false
        );

        const {bestOffer, otherOffers} =
            getBestAndOtherOffers(
                offerContext,
                allOffers,
                selectedFlight.fare.total
            );

        return {
            card,
            originalFare: selectedFlight.fare.total,
            bestOffer,
            otherOffers
        };
    });

    res.json({
        flight: selectedFlight,
        perCardResults: results,
    });
}

