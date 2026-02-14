'use server';

import {cookies} from 'next/headers';

// ---------------------------------------------------------
// 1. SEARCH FLIGHTS (Your existing chat logic)
// ---------------------------------------------------------
export async function searchFlightsAction(query) {
    try {
        const baseUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
        const cookieStore = await cookies();

        // 1. Get the session cookie
        const sessionCookie = cookieStore.get('flight-search-session');

        // 2. Prepare Headers
        const headers = {"Content-Type": "application/json"};
        if (sessionCookie) {
            headers['Cookie'] = `${sessionCookie.name}=${sessionCookie.value}`;
        }

        // 3. Call Backend
        const res = await fetch(`${baseUrl}/api/search`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({flightSearchQuery: query})
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Backend responded with ${res.status}: ${text}`);
        }

        // 4. Handle New Cookies (if backend starts a new session)
        const setCookieHeader = res.headers.get('set-cookie');
        if (setCookieHeader) {
            try {
                const cookie = setCookieHeader.split(',')[0];
                const [cookiePart] = cookie.split(';');
                const [name, ...rest] = cookiePart.split('=');

                const value = rest.join('=');

                if (name && value) {
                    cookieStore.set({
                        name: name.trim(),
                        value: value.trim(),
                        httpOnly: true,
                        sameSite: 'lax',
                        path: '/',
                        maxAge: 60 * 60 * 24
                    });
                }
            } catch (e) {
                console.error("Failed to set proxy cookie", e);
            }
        }

        return await res.json();

    } catch (error) {
        console.error("Action Error:", error);
        return {error: "Failed to connect to flight server."};
    }
}

// ---------------------------------------------------------
// 2. EVALUATE OFFERS (When user clicks a flight)
// ---------------------------------------------------------
export async function evaluateOffersAction(payload) {
    try {
        const baseUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('flight-search-session');

        const headers = {"Content-Type": "application/json"};
        if (sessionCookie) {
            headers['Cookie'] = `${sessionCookie.name}=${sessionCookie.value}`;
        }

        console.log("Fetching offers...");

        const res = await fetch(`${baseUrl}/api/offers/evaluate`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Backend Error: ${text}`);
        }

        return await res.json();

    } catch (error) {
        console.error("Offer Action Error:", error);
        return {error: "Failed to fetch offers."};
    }
}

// ---------------------------------------------------------
// 3. RESET SESSION (When user clicks "New Chat")
// ---------------------------------------------------------
export async function resetSessionAction() {
    try {
        const cookieStore = await cookies();
        // Delete the session cookie so the backend sees a "new user" next time
        cookieStore.delete('flight-search-session');
        return {success: true};
    } catch (error) {
        console.error("Reset Error:", error);
        return {success: false};
    }
}