"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    CreditCard,
    Truck,
    MapPin,
    ShieldCheck,
    ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
    const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "cod">("card");

    return (
        <div className="min-h-screen bg-[#F9FAFB] pb-24">
            {/* Header Hero */}
            <section className="relative h-[350px] flex items-center overflow-hidden mb-12">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/home/hero/image1.jpg"
                        alt="Checkout Header"
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
                            <span className="text-white font-medium">Checkout</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Checkout</h1>
                        <p className="text-lg text-white/70 max-w-lg">
                            Complete your order by providing delivery and payment details
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-10 items-start">

                    {/* Main Form Area */}
                    <div className="flex-1 w-full space-y-8">

                        {/* Delivery Address Section (Inspired by Repair Step 3) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg p-4 md:p-6 border border-gray-100 space-y-8"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-medium text-gray-900">Delivery Address</h2>
                                    <p className="text-gray-400 text-sm font-normal">Where should we send your gadgets?</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-normal text-gray-400 px-2">Street Address</label>
                                    <input
                                        type="text"
                                        placeholder="123 Innovation Drive, Tech Valley"
                                        className="w-full bg-gray-50 border mt-1     border-gray-100 rounded-sm p-4 text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-normal text-gray-400 px-2">City</label>
                                    <input
                                        type="text"
                                        placeholder="Berlin"
                                        className="w-full bg-gray-50 border mt-1     border-gray-100 rounded-sm p-4 text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-normal text-gray-400 px-2">Postal Code</label>
                                    <input
                                        type="text"
                                        placeholder="10115"
                                        className="w-full bg-gray-50 border mt-1     border-gray-100 rounded-sm p-4 text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment Method Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-lg p-4 md:p-6 border border-gray-100 space-y-8"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                    <CreditCard size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-medium text-gray-900">Payment Method</h2>
                                    <p className="text-gray-400 text-sm font-normal">Select your preferred way to pay</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { id: "card", name: "Credit Card", icon: <CreditCard size={20} /> },
                                    { id: "paypal", name: "PayPal", icon: <span className="font-bold italic">PP</span> },
                                    { id: "cod", name: "Cash on Delivery", icon: <Truck size={20} /> }
                                ].map((method) => (
                                    <div
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id as "card" | "paypal" | "cod")}
                                        className={cn(
                                            "p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-3 text-center group",
                                            paymentMethod === method.id ? "border-primary bg-primary/5" : "border-gray-50 bg-gray-50 hover:border-gray-200"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                            paymentMethod === method.id ? "bg-primary text-white" : "bg-white text-gray-400 group-hover:text-primary"
                                        )}>
                                            {method.icon}
                                        </div>
                                        <span className={cn(
                                            "font-bold text-sm",
                                            paymentMethod === method.id ? "text-gray-900" : "text-gray-400"
                                        )}>{method.name}</span>
                                    </div>
                                ))}
                            </div>

                            {paymentMethod === "card" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="pt-6 space-y-4"
                                >
                                    <div className="space-y-2">
                                        <label className="text-xs font-normal text-gray-400 px-2">Card Number</label>
                                        <input
                                            type="text"
                                            placeholder="**** **** **** ****"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-sm p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary transition-all"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <input type="text" placeholder="MM / YY" className="w-full bg-gray-50 border border-gray-100 rounded-sm p-4 text-sm font-normal outline-none focus:ring-2 focus:ring-primary transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <input type="text" placeholder="CVV" className="w-full bg-gray-50 border border-gray-100 rounded-sm p-4 text-sm font-normal outline-none focus:ring-2 focus:ring-primary transition-all" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>

                    {/* Summary Sidebar (Same as Repair flow style) */}
                    <div className="w-full lg:w-[400px] shrink-0 sticky top-24">
                        <div className="bg-white rounded-lg p-6 border border-gray-100 space-y-8">
                            <h2 className="text-2xl font-medium text-gray-900 tracking-tight">Price Breakdown</h2>

                            <div className="space-y-4 pt-4">
                                <div className="flex justify-between items-center text-gray-400 font-normal">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900">€989</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-400 font-normal">
                                    <span>Shipping</span>
                                    <span className="text-gray-900">€10</span>
                                </div>
                                <div className="h-px bg-gray-50 w-full" />
                                <div className="flex justify-between items-center text-3xl font-medium text-gray-900">
                                    <span className="tracking-tight">Total</span>
                                    <span className="text-primary tracking-tight">€999</span>
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-2xl p-4 flex items-center gap-3 text-green-700">
                                <ShieldCheck size={20} />
                                <span className="text-xs font-bold">Secure SSL encrypted payment</span>
                            </div>

                            <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                                Complete Purchase
                            </Button>

                            <p className="text-center text-xs text-gray-400 font-medium px-4 leading-relaxed">
                                By clicking buttons above, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
