"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CartSummaryProps {
    subtotal: number;
    shipping: number;
    total: number;
}

export function CartSummary({ subtotal, shipping, total }: CartSummaryProps) {
    return (
        <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm space-y-8 sticky top-24">
            <h2 className="text-2xl font-medium text-gray-900">Order Summary</h2>

            {/* Promo Code Input */}
            <div className="space-y-4">
                <label className="text-sm font-medium text-gray-900">Promo Code</label>
                <div className="flex gap-2 mt-1">
                    <input
                        type="text"
                        placeholder="Typing code here..."
                        className="flex-1 bg-gray-100 border-none rounded-sm px-4 py-3 placeholder:text-gray-400 focus:ring-2 focus:ring-primary text-sm font-normal outline-none"
                    />
                    <Button className="bg-primary hover:bg-primary/90 text-white h-10 rounded-sm px-6 py-3 font-medium cursor-pointer">
                        Apply
                    </Button>
                </div>
            </div>

            {/* Summary Lines */}
            <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center text-gray-500 font-medium">
                    <span>Amount</span>
                    <span className="text-gray-900">€{subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500 font-medium">
                    <span>Shipping</span>
                    <span className="text-gray-900">€{shipping}</span>
                </div>
                <div className="h-px bg-gray-100 w-full" />
                <div className="flex justify-between items-center text-2xl font-medium">
                    <span className="text-gray-900 tracking-tight">Total</span>
                    <span className="text-primary tracking-tight">€{total}</span>
                </div>
            </div>

            <Link href="/shipping" className="block w-full">
                <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                    Continue to Shipping
                </Button>
            </Link>
        </div>
    );
}
