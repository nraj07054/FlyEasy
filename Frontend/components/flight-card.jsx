import React from 'react';

export function FlightCard({flight, onSelect, offers, isExpanded}) {
    return (
        <div
            className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-black/5 shadow-sm transition-all duration-200">

            {/* Clickable flight header */}
            <div onClick={onSelect} className="cursor-pointer">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {flight.raw?.airline_logo ? (
                            <img
                                src={flight.raw.airline_logo}
                                className="w-8 h-8 object-contain"
                                alt={flight.airline}
                            />
                        ) : (
                            <div
                                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                                {flight.airline?.[0]}
                            </div>
                        )}

                        <div>
                            <div className="font-medium text-[#1d1d1f]">
                                {flight.airline} • {flight.flightNumber}
                            </div>
                            <div className="text-sm text-[#6e6e73]">
                                {flight.departTime} → {flight.arriveTime}
                            </div>
                        </div>
                    </div>

                    <div className="text-xl font-semibold text-[#1d1d1f]">
                        ₹{flight.totalFare?.toLocaleString('en-IN')}
                    </div>
                </div>
            </div>

            {/* Dropdown Offers */}
            {isExpanded && offers?.length > 0 && (
                <div className="mt-5 space-y-3 border-t pt-4">
                    {offers.map((offer, idx) => (
                        <div
                            key={idx}
                            className={`rounded-xl p-4 border ${
                                offer.isBest
                                    ? "bg-green-50 border-green-300"
                                    : "bg-gray-50 border-gray-200"
                            }`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-[#1d1d1f]">
                                        {offer.cardName}
                                    </span>

                                    {offer.isBest && (
                                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                                            Best
                                        </span>
                                    )}
                                </div>

                                <span
                                    className="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                                    {offer.source}
                                </span>
                            </div>


                            <div className="text-sm text-gray-600">
                                You save ₹{offer.discountAmount.toLocaleString('en-IN')}
                            </div>

                            <div className="text-lg font-bold text-green-600">
                                ₹{offer.finalAmount.toLocaleString('en-IN')}
                            </div>
                        </div>
                    ))}
                    {/* Disclaimer */}
                    <div className="text-xs text-gray-500 mt-4 leading-relaxed">
                        *Discounts are applied on eligible fare components.
                        Additional convenience fees, payment gateway charges,
                        or airline fees may apply at checkout.
                        Final payable amount may vary on the booking platform.
                    </div>
                </div>
            )}
        </div>
    );
}
