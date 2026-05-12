"use client";

import React from "react";
import Image from "next/image";
import { Trash2, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { imageBaseURL } from "@/utils/BaseURL";

interface CartItemProps {
    item: {
        _id: string;
        product: {
            _id: string;
            name: string;
            images: string[];
            basePrice: number;
        };
        quantity: number;
        price: number; // This is the unit price or tiered price from the API
    };
    onUpdateQuantity: (id: string, type: "inc" | "dec") => void;
    onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
    const product = item.product;
    const itemImage = product.images?.[0] ? (product.images[0].startsWith('http') ? product.images[0] : imageBaseURL + product.images[0]) : "/images/placeholder.jpg";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white rounded-lg p-2 flex flex-col md:flex-row items-center gap-8 border border-gray-100 hover:shadow-sm"
        >
            {/* Image Container */}
            <div className="w-40 h-30 bg-gray-100 rounded-xl flex items-center justify-center p-4 relative overflow-hidden shrink-0">
                <Image
                    src={itemImage}
                    alt={product.name}
                    width={150}
                    height={150}
                    className="object-contain rounded-xl"
                />
            </div>

            <div className="flex-1 flex flex-col md:flex-row items-center md:justify-between w-full gap-6">
                <div className="text-center md:text-left">
                    <h3 className="text-2xl font-medium text-gray-900 tracking-tight">{product.name}</h3>
                    <p className="text-gray-400 font-medium text-sm">Product ID: {product._id.slice(-6).toUpperCase()}</p>
                    <p className="text-3xl font-medium text-primary mt-3">€{item.price}</p>
                </div>

                <div className="flex items-center gap-6">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-gray-100 rounded-sm p-1 shrink-0 h-12">
                        <button
                            onClick={() => onUpdateQuantity(item._id, "dec")}
                            className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-gray-900 cursor-pointer transition-colors"
                        >
                            <Minus size={18} />
                        </button>
                        <span className="w-10 text-center font-medium text-gray-900">{item.quantity}</span>
                        <button
                            onClick={() => onUpdateQuantity(item._id, "inc")}
                            className="w-10 h-full flex items-center justify-center rounded-sm bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 transition-all cursor-pointer"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    {/* Remove Button */}
                    <button
                        onClick={() => onRemove(item._id)}
                        className="w-12 h-12 rounded-full border border-red-50 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center group cursor-pointer"
                    >
                        <Trash2 size={20} className="text-red-400 group-hover:text-white transition-colors" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
