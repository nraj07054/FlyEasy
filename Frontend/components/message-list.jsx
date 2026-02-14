'use client';

import React, {useEffect, useRef} from 'react';
import {BarChart3, Network, Newspaper, Search} from 'lucide-react';
import {FlightCard} from "@/components/flight-card";

export function MessageList({messages, onOptionClick, onFlightSelect, offersByFlight, expandedFlight, isSearching}) {
    const bottomRef = useRef(null);

    // Auto-scroll logic
    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    // Features data for the Hero section
    const features = [
        {title: "Looking for the best card offers?", description: "Find flight coupons...", icon: Search},
        {title: "Too many aggregators?", description: "Compare all coupon codes...", icon: BarChart3},
        {title: "Need latest offers?", description: "Real-time deals...", icon: Newspaper},
        {title: "Want maximum savings?", description: "Stack multiple offers...", icon: Network}
    ];

    return (
        <div className="flex-1 overflow-y-auto px-4">
            <div className="max-w-5xl mx-auto py-16">

                {/* Hero Section (Only visible when no messages) */}
                {messages.length === 0 && (
                    <div className="text-center mb-12 animate-in fade-in duration-500">
                        <h1 className="text-[56px] font-semibold text-[#1d1d1f] mb-2 tracking-tight">Hello, there</h1>
                        <p className="text-[40px] text-[#6e6e73] font-normal mb-16 tracking-tight">Find Flight Card
                            Offers, Faster.</p>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {features.map((f, i) => (
                                <button key={i} onClick={() => onOptionClick(f.title)}
                                        className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 hover:bg-white/90 transition-all text-left border border-black/5 shadow-sm">
                                    <h3 className="text-[17px] font-medium text-[#1d1d1f] mb-4">{f.title}</h3>
                                    <div
                                        className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center">
                                        <f.icon className="w-5 h-5 text-[#6e6e73]"/>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Message Stream */}
                <div className="max-w-3xl mx-auto space-y-6 pb-4">
                    {messages.map((msg, i) => (
                        <div key={i}
                             className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>

                            {/* User Bubble */}
                            {msg.role === 'user' && (
                                <div className="bg-[#1d1d1f] text-white px-5 py-3 rounded-[24px] max-w-md text-[17px]">
                                    {msg.content}
                                </div>
                            )}

                            {/* Assistant Bubble */}
                            {msg.role === 'assistant' && (
                                <div
                                    className="bg-white shadow-sm px-5 py-3 rounded-[24px] max-w-md text-[17px] text-[#1d1d1f]">
                                    {msg.content}
                                </div>
                            )}

                            {/* Options Buttons */}
                            {msg.role === 'options' && (
                                <div className="flex gap-2 flex-wrap">
                                    {msg.options.map((opt, idx) => (
                                        <button key={idx} onClick={() => onOptionClick(opt)}
                                                className="px-4 py-2 bg-white border border-black/10 rounded-full hover:bg-[#f5f5f7] text-sm font-medium transition-colors">
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Flight Cards */}
                            {msg.role === 'flights' && (
                                <div className="w-full space-y-3">
                                    {msg.flights.map((flight, idx) => (
                                        <FlightCard
                                            key={idx}
                                            flight={flight}
                                            onSelect={() => onFlightSelect(flight)}
                                            offers={offersByFlight?.[flight.flightNumber]}
                                            isExpanded={expandedFlight === flight.flightNumber}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {isSearching && (
                        <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                            <div
                                className="bg-white shadow-sm px-5 py-4 rounded-[24px] flex gap-1.5 items-center w-fit">
                                <div
                                    className="w-2 h-2 bg-[#8e8e93] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div
                                    className="w-2 h-2 bg-[#8e8e93] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-[#8e8e93] rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef}/>
                </div>
            </div>
        </div>
    );
}