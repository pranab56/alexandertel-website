"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const features = [
    "Free diagnostics on all devices",
    "Certified expert technicians",
    "Same-day repair service",
];

export default function ExpertRepairServices() {
    return (
        <section className="bg-[#f2f2f2] py-20 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Side: Content */}
                    <div className="flex flex-col gap-6">
                        <motion.h2
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
                        >
                            Expert Repair Services
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-gray-600 text-lg md:text-xl max-w-lg leading-relaxed"
                        >
                            Fast, reliable repairs with certified technicians. Same-day service available in Winterswijk and nearby cities.
                        </motion.p>

                        <ul className="flex flex-col gap-4 py-4">
                            {features.map((feature, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                    className="flex items-center gap-3 text-gray-700 font-medium"
                                >
                                    <div className="w-5 h-5 rounded-full border-4 border-primary/20 bg-primary flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                    </div>
                                    {feature}
                                </motion.li>
                            ))}
                        </ul>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <Button
                                size="lg"
                                className="bg-primary hover:bg-primary/90 text-white rounded-sm cursor-pointer px-10 h-14 text-base font-bold transition-transform hover:scale-105 shadow-lg shadow-primary/20"
                            >
                                Start Repair
                            </Button>
                        </motion.div>
                    </div>

                    {/* Right Side: Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 50 }}
                        whileInView={{ opacity: 1, scale: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl"
                    >
                        {/* Background Texture Placeholder */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400" />

                        <Image
                            src="/images/home/expart/image.jpg" // User should provide this
                            alt="Expert Apple Repair"
                            fill
                            className="object-cover"
                        />

                        {/* Glossy Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}