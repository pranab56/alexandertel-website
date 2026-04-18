"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
    {
        id: 1,
        name: "Smartphones",
        count: "50+ models",
        image: "/images/home/shopByCategory/image1.jpg", // User should provide this
        href: "/shop/smartphones",
    },
    {
        id: 2,
        name: "Accessories",
        count: "200+ products",
        image: "/images/home/shopByCategory/image2.png", // User should provide this
        href: "/shop/accessories",
    },
];

export default function ShopbyCategory() {
    return (
        <section className="container mx-auto px-6 py-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-10">Shop by Category</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {categories.map((category, index) => (
                    <motion.div
                        key={category.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        data-cursor="view"
                    >
                        <Link
                            href={category.href}
                            className="group relative block aspect-[16/8] md:aspect-[16/7] rounded-lg overflow-hidden bg-gray-100"
                        >
                            {/* Image with subtle zoom on hover */}
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                quality={100}
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full">
                                <motion.h3
                                    className="text-2xl md:text-3xl font-bold text-white mb-1"
                                >
                                    {category.name}
                                </motion.h3>
                                <p className="text-white/70 text-base md:text-lg">
                                    {category.count}
                                </p>
                            </div>

                            {/* Decorative Blur Circle */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}