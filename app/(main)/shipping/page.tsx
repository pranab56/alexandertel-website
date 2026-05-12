"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
    Truck, 
    ChevronRight, 
    CheckCircle2, 
    Loader2,
    Info,
    ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetShippingQuery } from "@/features/shop/shippingApi";
import { useMyAllProductQuery } from "@/features/shop/cartApi";

export default function ShippingPage() {
    const router = useRouter();
    const { data: shippingResponse, isLoading: shippingLoading } = useGetShippingQuery({});
    const { data: cartResponse, isLoading: cartLoading } = useMyAllProductQuery({});
    const [selectedShipping, setSelectedShipping] = useState<string | null>(null);

    const shippingOptions = shippingResponse?.data || [];
    const cartData = cartResponse?.data;
    const subtotal = cartData?.totalPrice || 0;

    const handleProceed = () => {
        if (!selectedShipping) return;
        
        const selectedOption = shippingOptions.find((opt: any) => opt._id === selectedShipping);
        if (selectedOption) {
            router.push(`/checkout?shippingId=${selectedOption._id}&cost=${selectedOption.baseCost}&name=${encodeURIComponent(selectedOption.name)}`);
        }
    };

    if (shippingLoading || cartLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] pb-24">
            {/* Header Section */}
            <section className="relative h-[350px] flex items-center overflow-hidden mb-12">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/home/hero/image1.jpg"
                        alt="Shipping Header"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-blue-900/60 z-10" />
                </div>

                <div className="container mx-auto px-6 relative z-20">
                    <div className="flex flex-col gap-3 text-white">
                        <div className="flex items-center gap-2 text-sm text-white/70">
                            <Link href="/cart" className="hover:text-white transition-colors">Cart</Link>
                            <ChevronRight size={14} />
                            <span className="text-white font-medium">Shipping Method</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Delivery Options</h1>
                        <p className="text-lg text-white/70 max-w-lg">
                            Choose how you want your new gadgets to reach your doorstep
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-10 items-start">
                    
                    {/* Shipping Options Grid */}
                    <div className="flex-1 w-full space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            {shippingOptions.map((option: any) => {
                                const isSelected = selectedShipping === option._id;
                                const isAvailable = subtotal >= (option.minOrderAmount || 0);

                                return (
                                    <motion.div
                                        key={option._id}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => setSelectedShipping(option._id)}
                                        className={cn(
                                            "relative p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group",
                                            isSelected 
                                                ? "border-primary bg-primary/5 shadow-xl shadow-primary/5" 
                                                : "border-white bg-white hover:border-gray-200 shadow-sm"
                                        )}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={cn(
                                                "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
                                                isSelected ? "bg-primary text-white" : "bg-gray-100 text-gray-400 group-hover:text-primary"
                                            )}>
                                                <Truck size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{option.name}</h3>
                                                <p className="text-gray-500 text-sm">{option.description || "Fast and secure delivery to your location"}</p>
                                            </div>
                                        </div>

                                        <div className="text-right flex flex-col items-end gap-3">
                                            <div className="text-2xl font-black text-gray-900">
                                                €{option.baseCost}
                                            </div>
                                            {isSelected ? (
                                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                                                    <CheckCircle2 size={20} />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full border-2 border-gray-100" />
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {shippingOptions.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                <Truck size={64} className="mx-auto text-gray-200 mb-4" />
                                <h3 className="text-xl font-bold text-gray-900">No shipping methods found</h3>
                                <p className="text-gray-400">Please contact support or try again later.</p>
                            </div>
                        )}
                    </div>

                    {/* Summary Sidebar */}
                    <div className="w-full lg:w-[400px] shrink-0 sticky top-24">
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Order Summary</h2>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900 font-bold">€{subtotal}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-gray-900 font-bold">
                                        {selectedShipping 
                                            ? `€${shippingOptions.find((o: any) => o._id === selectedShipping)?.baseCost}` 
                                            : "Select method"}
                                    </span>
                                </div>
                                <div className="h-px bg-gray-100 w-full" />
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-gray-900">Estimated Total</span>
                                    <span className="text-3xl font-black text-primary">
                                        €{subtotal + (selectedShipping ? (shippingOptions.find((o: any) => o._id === selectedShipping)?.baseCost || 0) : 0)}
                                    </span>
                                </div>
                            </div>

                            <Button 
                                onClick={handleProceed}
                                disabled={!selectedShipping}
                                className={cn(
                                    "w-full h-16 rounded-2xl font-bold text-lg transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98]",
                                    selectedShipping 
                                        ? "bg-primary text-white shadow-primary/20" 
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                )}
                            >
                                Continue to Billing
                                <ArrowRight className="ml-2" size={20} />
                            </Button>

                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl text-gray-500 text-xs font-medium leading-relaxed">
                                <Info size={16} className="shrink-0 text-primary" />
                                <p>Shipping costs are calculated based on your location and order volume.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
