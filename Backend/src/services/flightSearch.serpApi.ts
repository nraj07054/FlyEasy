import {serpApiSearch} from "../lib/serpApi.ts";
import type {Flight} from "../models/flight.model.ts";

interface SearchInput {
    origin: string;
    destination: string;
    departureDate: string;
    adults: number;
    children?: number;
    infantsInSeat?: number;
    infants?: number;
}

export async function searchFlightsSerpAPI(
    input: SearchInput
): Promise<Flight[]> {
    const response = await serpApiSearch({
        engine: "google_flights",
        type: 2,

        departure_id: input.origin,
        arrival_id: input.destination,
        outbound_date: input.departureDate,

        adults: input.adults,
        children: input.children ?? 0,
        infants_in_seat: input.infantsInSeat ?? 0,
        infants_on_lap: input.infants ?? 0,

        currency: "INR",
        hl: "en",
        gl: "in",

        sort_by: 2,
        deep_search: true,
    });

    return normalizeSerpFlights(response);
}


function normalizeSerpFlights(data: any): Flight[] {
    const flights = [
        ...(data.best_flights ?? []),
        ...(data.other_flights ?? [])
    ];

    return flights
        .filter((item: any) => item.flights?.length)
        .map((item: any): Flight => {
            const firstLeg = item.flights[0];
            const lastLeg = item.flights[item.flights.length - 1];

            return {
                airline: firstLeg.airline,
                flightNumber: firstLeg.flight_number,

                departTime: firstLeg.departure_airport.time,
                arriveTime: lastLeg.arrival_airport.time,

                totalFare: item.price,
                currency: "INR",

                stops: item.flights.length - 1,
                durationMinutes: item.total_duration,

                raw: item,
            };
        });
}

