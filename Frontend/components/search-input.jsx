'use client';

import React, {useState} from 'react';
import {Send} from 'lucide-react';

export function SearchInput({onSearch, isSearching}) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        onSearch(query);
        setQuery('');
    };

    return (
        <div className="bg-[#f5f5f7]/80 backdrop-blur-md border-t border-black/5 p-6 z-10">
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="relative">
                    <div
                        className="bg-white rounded-full border border-black/10 shadow-sm hover:shadow-md transition-all duration-300 flex items-center px-4 py-3">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask me anything... e.g., 'Flights to Tokyo'"
                            className="flex-1 bg-transparent text-[#1d1d1f] placeholder-[#86868b] focus:outline-none text-[17px] px-2"
                        />
                        <button
                            type="submit"
                            disabled={isSearching || !query.trim()}
                            className="p-2 bg-[#1d1d1f] hover:bg-[#2d2d2f] rounded-full transition-all duration-200 disabled:opacity-40 flex items-center justify-center w-9 h-9"
                        >
                            {isSearching ? (
                                <div
                                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                            ) : (
                                <Send className="w-4 h-4 text-white ml-0.5"/>
                            )}
                        </button>
                    </div>
                </form>
                <p className="text-xs text-[#86868b] mt-3 text-center">
                    AI-generated results are based on available data.
                </p>
            </div>
        </div>
    );
}