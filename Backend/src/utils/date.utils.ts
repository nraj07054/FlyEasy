export function normalizeFutureDate(dateStr: string | null | undefined): string | null {
    if (!dateStr) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parsed = new Date(dateStr);

    // If date is in the past, bump year by 1
    if (parsed < today) {
        parsed.setFullYear(parsed.getFullYear() + 1);
    }

    return parsed.toISOString().split("T")[0];
}
