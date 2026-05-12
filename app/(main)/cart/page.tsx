"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useDeleteCartItemMutation, useMyAllProductQuery, useUpdateQuantityMutation } from "@/features/shop/cartApi";
import toast from "react-hot-toast";
import TopLoader from "@/components/ui/TopLoader";

export default function CartPage() {
    const { data: allProduct, isLoading: allProductLoading } = useMyAllProductQuery({});
    const [deleteProduct] = useDeleteCartItemMutation();
    const [updateQuantityMutation] = useUpdateQuantityMutation();
    const items = allProduct?.data?.items || [];
    const subtotal = allProduct?.data?.totalPrice || 0;
    const shipping = items.length > 0 ? 10 : 0;
    const total = subtotal + shipping;

    const handleUpdateQuantity = async (id: string, type: "inc" | "dec") => {
        try {
            await updateQuantityMutation({ id, data: { type } }).unwrap();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update quantity");
        }
    };

    const handleRemoveItem = async (id: string) => {
        try {
            const response = await deleteProduct({ id }).unwrap();
            if (response.success) {
                toast.success(response.message || "Item removed from cart");
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to remove item");
        }
    };

    if (allProductLoading) {
        return (
            <div>
                <TopLoader />
            </div>
        );
    }

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
                            {items.length > 0 ? (
                                items.map((item: any) => (
                                    <CartItem
                                        key={item._id}
                                        item={item}
                                        onUpdateQuantity={handleUpdateQuantity}
                                        onRemove={handleRemoveItem}
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