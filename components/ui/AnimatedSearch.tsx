"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const dummyResults = [
    "Dashboard",
    "Users",
    "Settings",
    "Analytics",
    "Products",
    "Orders",
];

export default function AnimatedSearch() {
    const [isFocused, setIsFocused] = useState(false);
    const [query, setQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredResults = dummyResults.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
    );

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) {
                setIsFocused(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative">
            {/* Search Input */}
            <motion.input
                type="text"
                value={query}
                onFocus={() => setIsFocused(true)}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                initial={{ width: 200 }}
                animate={{ width: isFocused ? 320 : 200 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="h-10 px-4 rounded-xl border border-gray-300 outline-none shadow-sm"
            />

            {/* Dropdown */}
            <AnimatePresence>
                {isFocused && query && (
                    <motion.div
                        key="dropdown"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-12 left-0 w-full bg-white border rounded-xl shadow-lg p-2 z-50"
                    >
                        {filteredResults.length > 0 ? (
                            filteredResults.map((item, i) => (
                                <div
                                    key={i}
                                    className="px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                                >
                                    {item}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-gray-400">No results found</div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}