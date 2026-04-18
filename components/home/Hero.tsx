"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] md:min-h-screen flex items-center pt-20 overflow-hidden bg-black">
            {/* Background Image/Gradient */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 z-10" />
                {/* Placeholder for the background image user downloaded */}
                <Image
                    src="/images/home/hero/image1.jpg"
                    alt="Tech Background"
                    fill
                    priority
                    quality={100}
                    className="object-cover"
                />
                {/* Abstract Light Rays (Animated) */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <motion.div
                        animate={{
                            opacity: [0.2, 0.4, 0.2],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -right-1/4 -top-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(108,99,255,0.15)_0%,transparent_70%)]"
                    />
                </div>
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Content */}
                    <div className="flex flex-col gap-6 max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center"
                        >
                            <span className="px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white/90 text-sm font-medium">
                                Limited Time Offer - Up to 30% Off
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1]"
                        >
                            Your Tech.<br />
                            <span className="text-white/80">Your Way.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-lg md:text-xl text-white max-w-lg leading-relaxed"
                        >
                            Premium smartphones, expert repairs, and seamless service delivery across the Netherlands.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-wrap gap-4 pt-4"
                        >
                            <Button
                                size="lg"
                                className="bg-primary hover:bg-primary/90 text-white rounded-sm cursor-pointer px-8 h-14 text-base font-semibold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(108,99,255,0.4)]"
                            >
                                Shop Now
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="bg-white hover:bg-white border-white/20 cursor-pointer text-primary hover:text-primary/90 rounded-sm px-8 h-14 text-base font-semibold backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                            >
                                Book Repair
                            </Button>
                        </motion.div>
                    </div>

                    {/* Right Image (iPhones) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 100 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="hidden lg:flex justify-end relative"
                    >
                        {/* Floating Animation */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="relative aspect-[4/5] w-full max-w-xl"
                        >
                            <Image
                                src="/images/home/hero/image2.png"
                                alt="Premium Smartphones"
                                width={1000}
                                height={1000}
                                className="object-contain rotate-10 transition-transform duration-500 drop-shadow-[0_0_50px_rgba(108,99,255,0.3)]"
                                priority
                            />

                            {/* Decorative Glow behind phones */}
                            <div className="absolute inset-0 bg-primary/10 blur-[100px] -z-10 rounded-full scale-75" />
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Speed lines / rays overlay (Decorative) */}
            <div className="absolute right-0 bottom-0 pointer-events-none opacity-40">
                <svg width="600" height="400" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M600 400L0 200" stroke="url(#paint0_linear)" strokeWidth="2" />
                    <path d="M600 350L50 150" stroke="url(#paint0_linear)" strokeWidth="1" />
                    <path d="M600 300L100 100" stroke="url(#paint0_linear)" strokeWidth="3" />
                    <defs>
                        <linearGradient id="paint0_linear" x1="600" y1="400" x2="0" y2="200" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#6C63FF" />
                            <stop offset="1" stopColor="#6C63FF" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </section>
    );
}