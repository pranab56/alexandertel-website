"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    MapPin,
    ShieldCheck,
    ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import { useMyAllProductQuery } from "@/features/shop/cartApi";
import { useCreateCheckOutMutation } from "@/features/shop/checkOutApi";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { useSearchParams } from "next/navigation";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const shippingId = searchParams.get("shippingId") || "69e6f4e4dc0b7d72362beab2";
    const shippingName = searchParams.get("name") || "Paid Shipping";
    const urlShippingCost = Number(searchParams.get("cost")) || 10;

    const { data: cartResponse, isLoading: cartLoading } = useMyAllProductQuery({});
    const [createCheckOut, { isLoading: isCheckingOut }] = useCreateCheckOutMutation();
    const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "cod">("card");

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
    });

    const cartData = cartResponse?.data;
    const items = cartData?.items || [];
    const subtotal = cartData?.totalPrice || 0;
    const shippingCost = items.length > 0 ? urlShippingCost : 0;
    const total = subtotal + shippingCost;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCompleteOrder = async () => {
        if (!formData.name || !formData.phone || !formData.address || !formData.city) {
            toast.error("Please fill in all delivery details");
            return;
        }

        try {
            const checkoutPayload = {
                shippingId: shippingId,
                shippingAddress: {
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city
                },
                couponCode: "DISCOUNT10", // Sample coupon code
                distanceKm: 50
            };

            const response = await createCheckOut(checkoutPayload).unwrap();

            if (response.success && response.data.paymentUrl) {
                toast.success("Redirecting to payment...");
                window.location.href = response.data.paymentUrl;
            } else if (response.success) {
                toast.success("Order placed successfully!");
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Checkout failed");
            console.error("Checkout error:", err);
        }
    };

    if (cartLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

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

                        {/* Delivery Address Section */}
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
                                <div className="space-y-2">
                                    <label className="text-xs font-normal text-gray-400 px-2">Full Name</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full bg-gray-50 border mt-1 border-gray-100 rounded-sm p-4 text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-normal text-gray-400 px-2">Phone Number</label>
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        type="text"
                                        placeholder="017XXXXXXXX"
                                        className="w-full bg-gray-50 border mt-1 border-gray-100 rounded-sm p-4 text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-normal text-gray-400 px-2">Street Address</label>
                                    <input
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        type="text"
                                        placeholder="123 Innovation Drive, Tech Valley"
                                        className="w-full bg-gray-50 border mt-1 border-gray-100 rounded-sm p-4 text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-normal text-gray-400 px-2">City</label>
                                    <input
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        type="text"
                                        placeholder="Dhaka"
                                        className="w-full bg-gray-50 border mt-1 border-gray-100 rounded-sm p-4 text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="w-full lg:w-[400px] shrink-0 sticky top-24">
                        <div className="bg-white rounded-lg p-6 border border-gray-100 space-y-8">
                            <h2 className="text-2xl font-medium text-gray-900 tracking-tight">Order Summary</h2>

                            <div className="space-y-4 pt-4">
                                {items.map((item: any) => (
                                    <div key={item._id} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">{item.product.name} x {item.quantity}</span>
                                        <span className="text-gray-900 font-medium">€{item.price * item.quantity}</span>
                                    </div>
                                ))}
                                <div className="h-px bg-gray-50 w-full my-2" />
                                <div className="flex justify-between items-center text-gray-400 font-normal">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900 font-medium">€{subtotal}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-400 font-normal">
                                    <span>Shipping</span>
                                    <span className="text-gray-900 font-medium">€{shippingCost}</span>
                                </div>
                                <div className="h-px bg-gray-50 w-full" />
                                <div className="flex justify-between items-center text-3xl font-medium text-gray-900">
                                    <span className="tracking-tight">Total</span>
                                    <span className="text-primary tracking-tight">€{total}</span>
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-2xl p-4 flex items-center gap-3 text-green-700">
                                <ShieldCheck size={20} />
                                <span className="text-xs font-bold">Secure SSL encrypted payment</span>
                            </div>

                            <Button
                                onClick={handleCompleteOrder}
                                disabled={isCheckingOut || items.length === 0}
                                className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-70"
                            >
                                {isCheckingOut ? (
                                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                ) : null}
                                {isCheckingOut ? "Processing..." : "Complete Purchase"}
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

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
