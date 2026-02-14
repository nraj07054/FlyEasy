import {getMMTOffers} from "./mmt.offer.ts";
import type {Offer} from "../offer.types.ts";

export function getAllOffers(): Offer[] {
    return [
        ...getMMTOffers()
    ];
}
