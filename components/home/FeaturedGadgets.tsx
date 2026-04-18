"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Heart, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
    id: number;
    name: string;
    subtitle: string;
    price: number;
    oldPrice: number;
    currency: string;
    image: string;
    isFavorite: boolean;
}

export default function FeaturedGadgets() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch("/product.json")
            .then((res) => res.json())
            .then((data) => setProducts(data));
    }, []);

    return (
        <section className="container mx-auto px-6 py-16">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Gadgets</h2>
                    <p className="text-gray-500">Upgrade your lifestyle with the newest tech essentials</p>
                </div>
                <Link
                    href="/shop"
                    className="group flex items-center gap-1 px-5 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-primary"
                >
                    View all
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    <ChevronRight size={16} className="-ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
            </div>

            {/* Grid Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                ))}
            </div>
        </section>
    );
}

export function ProductCard({ product, index }: { product: Product; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            data-cursor="view"
            className="group bg-[#f7f7f7] rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-sm transition-all duration-500 relative"
        >
            <Link href={`/shop/${product.id}`} className="block">
                {/* Image Container */}
                <div className="relative aspect-square w-full flex items-center justify-center p-8 bg-[#E5E7EB]/50">
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={1000}
                        height={1000}
                        className="object-contain mix-blend-multiply h-50 w-full group-hover:scale-110 transition-transform duration-500"
                    />
                </div>

                {/* Info Section */}
                <div className="p-6 bg-white">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">{product.subtitle}</p>

                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-primary">
                            €{product.price}
                        </span>
                        {product.oldPrice && (
                            <span className="text-gray-400 line-through text-sm">
                                €{product.oldPrice}
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            {/* Floating Icons - Placed outside the main Link for independent interaction */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors"
                >
                    <Plus size={20} />
                </button>
                <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className={cn(
                        "w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center transition-colors",
                        product.isFavorite ? "text-red-500" : "text-gray-600 hover:text-red-500"
                    )}
                >
                    <Heart size={20} fill={product.isFavorite ? "currentColor" : "none"} />
                </button>
            </div>
        </motion.div>
    );
}