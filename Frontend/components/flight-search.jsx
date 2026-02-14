'use client';

import React, {useState} from 'react';
import {MessageList} from './message-list';
import {SearchInput} from './search-input';
import {evaluateOffersAction, resetSessionAction, searchFlightsAction} from '@/app/actions'; // Import your new action

export default function FlightSearch() {
    const [messages, setMessages] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [offersByFlight, setOffersByFlight] = useState({});
    const [expandedFlight, setExpandedFlight] = useState(null);


    const handleNewChat = async () => {
        try {
            await resetSessionAction();
            setMessages([{role: "assistant", content: "How can I help you today?"}]);
            setOffersByFlight({});
            setExpandedFlight(null);
        } catch (err) {
            console.error("Failed to reset session");
        }
    };

    const handleSearch = async (input) => {
        // 1. Optimistic Update (Show user message immediately)
        const newMsg = {role: "user", content: input};
        setMessages(prev => [...prev, newMsg]);
        setIsSearching(true);

        try {
            // 2. Call Server Action
            const data = await searchFlightsAction(input);

            // 3. Process Response
            if (data.error) {
                setMessages(prev => [...prev, {
                    role: "assistant",
                    content: "Sorry, I couldn't connect to the server."
                }]);
            } else {
                handleBackendResponse(data);
            }
        } catch (error) {
            setMessages(prev => [...prev, {role: "assistant", content: "Something went wrong."}]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleFlightSelect = async (flight) => {
        const flightKey = flight.flightNumber;

        // Toggle dropdown if already open
        if (expandedFlight === flightKey) {
            setExpandedFlight(null);
            return;
        }

        setIsSearching(true);

        try {
            const payload = {
                selectedFlight: {
                    flightNumber: flight.flightNumber,
                    origin: flight.origin,
                    destination: flight.destination,
                    departureDate: flight.departureDate,
                    fare: {
                        total: flight.totalFare,
                        currency: "INR"
                    }
                }
            };

            const data = await evaluateOffersAction(payload);

            if (!data?.perCardResults) return;

            // 🔥 Correct naming logic for BANK vs NETWORK offers
            const getOfferName = (offerObj, card) => {
                if (offerObj.offer.issuerType === "NETWORK") {
                    return offerObj.offer.issuer; // VISA, MASTERCARD etc.
                }
                return `${card.issuingBank} ${card.cardVariant}`;
            };

            const formattedOffers =
                data.perCardResults.flatMap(result => {
                    const offers = [];

                    if (result.bestOffer) {
                        offers.push({
                            cardName: getOfferName(result.bestOffer, result.card),
                            discountAmount: result.bestOffer.discount,
                            finalAmount: result.bestOffer.finalFare,
                            source: result.bestOffer.offer.source,
                            isBest: true
                        });
                    }

                    result.otherOffers?.forEach(o => {
                        offers.push({
                            cardName: getOfferName(o, result.card),
                            discountAmount: o.discount,
                            finalAmount: o.finalFare,
                            source: o.offer.source,
                            isBest: false
                        });
                    });

                    return offers;
                });

            // Save offers for this flight
            setOffersByFlight(prev => ({
                ...prev,
                [flightKey]: formattedOffers
            }));

            setExpandedFlight(flightKey);

        } catch (err) {
            console.error(err);
        } finally {
            setIsSearching(false);
        }
    };

    const handleBackendResponse = (data) => {
        const newMessages = [];

        if (data.nextAction === "ASK_CLARIFICATION") {
            const text = data.clarification.message || data.clarification.question || "Can you clarify?";
            newMessages.push({role: "assistant", content: text});

            if (data.clarification.options?.length) {
                newMessages.push({role: "options", options: data.clarification.options});
            }
        } else if (data.nextAction === "SHOW_FLIGHTS") {
            newMessages.push({role: "assistant", content: "Here are your flights:"});
            newMessages.push({role: "flights", flights: data.state.flights});
        }

        setMessages(prev => [...prev, ...newMessages]);
    };

    return (
        <div
            className="flex flex-col h-screen bg-[#f5f5f7] font-[system-ui,_-apple-system,_sans-serif] overflow-hidden">
            {/* Top Bar */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-white">
                <h2 className="font-semibold text-lg">Flight Search</h2>
                <button
                    onClick={handleNewChat}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    New Chat
                </button>
            </div>

            {/* Scrollable Area */}
            <MessageList
                messages={messages}
                onOptionClick={handleSearch}
                onFlightSelect={handleFlightSelect}
                offersByFlight={offersByFlight}
                expandedFlight={expandedFlight}
                isSearching={isSearching}
            />

            {/* Fixed Bottom Area */}
            <SearchInput onSearch={handleSearch} isSearching={isSearching}/>
        </div>
    );
}