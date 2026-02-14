import type {CardType, NormalizedCard} from "./card.types.ts";

import {CardRegistry} from "./card.registry.ts";

/**
 * STEP 1: Normalize raw text into a structured card
 */
export function normalizeCard(rawText: string): NormalizedCard {
    const text = rawText.toLowerCase();

    let bestMatch = null;
    let bestScore = 0;

    // Try to find exact card using aliases
    for (const card of CardRegistry) {
        for (const alias of card.aliases) {
            if (text.includes(alias)) {
                const score = alias.length / text.length;
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = card;
                }
            }
        }
    }

    // Exact card found
    if (bestMatch) {
        return {
            issuingBank: bestMatch.issuingBank,
            cardVariant: bestMatch.cardVariant,
            cardType: bestMatch.cardType,
            network: bestMatch.network,
            confidence: Math.min(bestScore + 0.3, 1),
            resolutionStatus: undefined // resolver decides this
        };
    }

    // Bank-only fallback
    const bank = detectBank(text);

    if (bank) {
        return {
            issuingBank: bank,
            cardVariant: null,
            cardType: detectCardType(text),
            network: null,
            confidence: 0.6,
            resolutionStatus: undefined
        };
    }

    // Nothing detected
    return {
        issuingBank: null,
        cardVariant: null,
        cardType: null,
        network: null,
        confidence: 0,
        resolutionStatus: undefined
    };
}

/**
 * STEP 2: Resolve card state
 */
export function resolveCard(card: NormalizedCard): NormalizedCard {
    if (!card.issuingBank) {
        return {
            ...card,
            resolutionStatus: "UNKNOWN"
        };
    }

    if (card.issuingBank && !card.cardVariant) {
        return {
            ...card,
            resolutionStatus: "BANK_ONLY"
        };
    }

    return {
        ...card,
        resolutionStatus: "EXACT"
    };
}

/**
 * STEP 3: Build clarification if needed
 */
export function buildCardClarification(
    cards: NormalizedCard[],
    context: any
) {
    const unresolved = cards.find(
        card => card.resolutionStatus !== "EXACT"
    );

    if (!unresolved || !unresolved.issuingBank) {
        return null;
    }

    // Save context for next turn
    context.cards.unresolved = {
        issuingBank: unresolved.issuingBank
    };

    const options = CardRegistry
        .filter(card => card.issuingBank === unresolved.issuingBank)
        .map(card => card.cardVariant);

    return {
        type: "CLARIFICATION_REQUIRED",
        question: `Which ${unresolved.issuingBank} credit card do you have?`,
        options
    };
}

export function processCards(
    mentionedCards: string[],
    context: any
) {
    const cards = mentionedCards
        .map(normalizeCard)
        .map(resolveCard);

    const clarification = buildCardClarification(cards, context);

    return {cards, clarification};
}

/* -------------------- Helpers -------------------- */

function detectBank(text: string): string | null {
    const banks = ["hdfc", "icici", "sbi", "axis", "kotak"];
    const bank = banks.find(b => text.includes(b));
    return bank ? bank.toUpperCase() : null;
}

function detectCardType(text: string): CardType {
    if (text.includes("debit")) return "DEBIT";
    return "CREDIT";
}
