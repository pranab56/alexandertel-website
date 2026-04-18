"use client";

import React from "react";
import Image from "next/image";
import { Trash2, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";


interface CartItemProps {
    item: {
        id: number;
        name: string;
        subtitle: string;
        price: number;
        image: string;
        quantity: number;
    };
    onUpdateQuantity: (id: number, delta: number) => void;
    onRemove: (id: number) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white rounded-lg p-4 flex flex-col md:flex-row items-center gap-8 border border-gray-100 hover:shadow-sm"
        >
            {/* Image Container */}
            <div className="w-40 h-40 bg-gray-100 rounded-3xl flex items-center justify-center p-4 relative overflow-hidden shrink-0">
                <Image
                    src={item.image}
                    alt={item.name}
                    width={150}
                    height={150}
                    className="object-contain mix-blend-multiply"
                />
            </div>

            <div className="flex-1 flex flex-col md:flex-row items-center md:justify-between w-full gap-6">
                <div className="text-center md:text-left">
                    <h3 className="text-2xl font-medium text-gray-900 tracking-tight">{item.name}</h3>
                    <p className="text-gray-400 font-medium">{item.subtitle}</p>
                    <p className="text-3xl font-medium text-primary mt-3">€{item.price}</p>
                </div>

                <div className="flex items-center gap-6">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-gray-100 rounded-xl p-1 shrink-0 h-12">
                        <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-gray-900 cursor-pointer transition-colors"
                        >
                            <Minus size={18} />
                        </button>
                        <span className="w-10 text-center font-medium text-gray-900">{item.quantity}</span>
                        <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-10 h-full flex items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 transition-all cursor-pointer"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    {/* Remove Button */}
                    <button
                        onClick={() => onRemove(item.id)}
                        className="w-12 h-12 rounded-full border border-red-50 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center group cursor-pointer"
                    >
                        <Trash2 size={20} className="text-red-400 group-hover:text-white transition-colors" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
