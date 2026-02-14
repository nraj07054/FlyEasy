export function resolveNextAction(clarification: any) {
    if (clarification) {
        return "ASK_CLARIFICATION";
    }
    return "SEARCH_FLIGHTS";
}
