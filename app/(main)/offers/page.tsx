"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ChevronRight,
    Copy,
    Check,
    Percent,
    ShoppingBag,
    Ticket,
    Coins
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function OffersPage() {
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const promos = [
        { id: 1, title: "Special 5% Off", subtitle: "Special promo only today!", code: "SPECIAL5" },
        { id: 2, title: "Special 5% Off", subtitle: "Special promo only today!", code: "TODAY5" },
        { id: 3, title: "Special 5% Off", subtitle: "Special promo only today!", code: "GIFT5" },
        { id: 4, title: "Special 5% Off", subtitle: "Special promo only today!", code: "EXTRA5" },
    ];

    return (
        <div className="min-h-screen bg-[#F9FAFB] pb-24">
            {/* Header / Hero Section */}
            <section className="relative h-[350px] flex items-center overflow-hidden mb-12">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/home/hero/image1.jpg"
                        alt="Offers Header"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-blue-900/60 z-10" />
                </div>

                <div className="container mx-auto px-6 relative z-20 text-white">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-sm text-white/70">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <ChevronRight size={14} />
                            <span className="text-white font-medium">Offers</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-medium tracking-tight">Offers & Promotions</h1>
                        <p className="text-xl text-white/70">
                            Save more with our exclusive deals
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-6 space-y-16">

                {/* Featured Offer Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 p-8 md:p-16 text-white shadow-2xl shadow-blue-500/20"
                >
                    <div className="relative z-10 max-w-2xl space-y-6">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium">
                            <span className="text-yellow-400">⚡</span> Limited Time Offer
                        </div>
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight">
                            Up to 30% Off Smartphones
                        </h2>
                        <p className="text-lg md:text-xl text-white/80 font-normal">
                            Premium devices at unbeatable prices. Offer valid on selected iPhone and Samsung models.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-4">
                            <Button className="h-14 px-8 rounded-sm bg-indigo-700 hover:bg-indigo-800 text-white font-medium text-lg shadow-lg">
                                Shop Now
                            </Button>

                            <div className="flex items-center bg-white rounded-xl p-1 overflow-hidden shadow-lg">
                                <span className="px-6 text-gray-900 font-medium tracking-widest text-lg">SAVE30</span>
                                <button
                                    onClick={() => copyToClipboard("SAVE30")}
                                    className="h-12 w-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-900 transition-all cursor-pointer rounded-lg"
                                >
                                    {copiedCode === "SAVE30" ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Geometric Elements */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
                </motion.div>

                {/* Promo Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {promos.map((promo, index) => (
                        <motion.div
                            key={promo.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-lg border border-gray-100 p-5 flex items-center justify-between group hover:shadow-xl hover:shadow-gray-200/50 transition-all"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                                    <Percent size={28} strokeWidth={2.5} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-medium text-gray-900 tracking-tight">{promo.title}</h3>
                                    <p className="text-gray-400 font-normal text-sm">{promo.subtitle}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => copyToClipboard(promo.code)}
                                className={cn(
                                    "px-6 h-12 rounded-xl text-sm font-bold flex items-center gap-2 border-2 transition-all cursor-pointer",
                                    copiedCode === promo.code
                                        ? "bg-green-500 border-green-500 text-white"
                                        : "border-gray-100 bg-gray-50 text-gray-400 hover:border-primary hover:text-primary"
                                )}
                            >
                                {copiedCode === promo.code ? <Check size={18} /> : <Copy size={18} />}
                                {copiedCode === promo.code ? "Copied" : "Copy"}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* How to Use Section */}
                <div className="bg-gray-100/90 rounded-lg p-10 md:p-10">
                    <h3 className="text-2xl font-medium text-gray-900 mb-12 tracking-tight">How to Use Promo Codes</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { id: 1, label: "Shop Products", desc: "Add items to your cart", icon: <ShoppingBag size={24} /> },
                            { id: 2, label: "Enter Code", desc: "Apply promo at checkout", icon: <Ticket size={24} /> },
                            { id: 3, label: "Save Money", desc: "Enjoy your discount", icon: <Coins size={24} /> }
                        ].map((step) => (
                            <div key={step.id} className="flex items-start gap-6">
                                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-primary/30">
                                    {step.id}
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-medium text-gray-900 tracking-tight">{step.label}</h4>
                                    <p className="text-gray-500 font-medium">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}