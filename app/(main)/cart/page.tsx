"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";

interface CartItemData {
    id: number;
    name: string;
    subtitle: string;
    price: number;
    image: string;
    quantity: number;
}

const initialCart: CartItemData[] = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        subtitle: "128GB, Natural Titanium",
        price: 989,
        image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro.jpg",
        quantity: 1
    }
];

export default function CartPage() {
    const [cart, setCart] = useState<CartItemData[]>(initialCart);

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => prev.map(item => 
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    const removeItem = (id: number) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 10 : 0;
    const total = subtotal + shipping;

    return (
        <div className="min-h-screen bg-[#F9FAFB] pb-24">
            {/* Header / Hero Section */}
            <section className="relative h-[350px] flex items-center overflow-hidden mb-12">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/home/hero/image1.jpg"
                        alt="Cart Header"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-transparent z-10" />
                </div>
                
                <div className="container mx-auto px-6 relative z-20">
                    <div className="flex flex-col gap-3 text-white">
                        <div className="flex items-center gap-2 text-sm text-white/70">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <ChevronRight size={14} />
                            <span className="text-white font-medium">Your Shop Cart</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Shopping Cart</h1>
                        <p className="text-lg text-white/70 max-w-lg">
                            Almost there—check your items and proceed to purchase
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-10 items-start">
                    
                    {/* Cart Items List */}
                    <div className="flex-1 w-full space-y-6">
                        <AnimatePresence mode="popLayout">
                            {cart.length > 0 ? (
                                cart.map((item) => (
                                    <CartItem 
                                        key={item.id} 
                                        item={item} 
                                        onUpdateQuantity={updateQuantity} 
                                        onRemove={removeItem} 
                                    />
                                ))
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-24 bg-white rounded-lg border border-gray-100 shadow-sm"
                                >
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                                    <p className="text-gray-400 mb-8">Looks like you haven&apos;t added any gadgets yet.</p>
                                    <Link href="/shop">
                                        <Button className="rounded-sm px-10 h-14 font-bold cursor-pointer">
                                            Return to Store
                                        </Button>
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <CartSummary 
                        subtotal={subtotal} 
                        shipping={shipping} 
                        total={total} 
                    />

                </div>
            </div>
        </div>
    );
}