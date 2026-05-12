"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Heart, ChevronRight, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetAllProductQuery } from "@/features/shop/shopApi";
import { useAddToCardMutation, useMyAllProductQuery } from "@/features/shop/cartApi";
import { useAddFavoriteProductMutation, useDeleteFavoriteProductMutation, useMyAllFavoriteProductQuery } from "@/features/shop/favoriteProductApi";
import { imageBaseURL } from "@/utils/BaseURL";
import toast from "react-hot-toast";


interface Product {
    _id: string;
    name: string;
    description: string;
    basePrice: number;
    image: string | null;
    stockStatus: string;
    color: { type: string; price: number }[];
    storage: { type: string; price: number }[];
    ram: any[];
}

export default function FeaturedGadgets() {
    const { data, isLoading } = useGetAllProductQuery({});
    const products = data?.data || [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

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
                {products.slice(0, 6).map((product: Product, index: number) => (
                    <ProductCard key={product._id} product={product} index={index} />
                ))}
            </div>
        </section>
    );
}

export function ProductCard({ product, index }: { product: Product; index: number }) {
    const [addToCart, { isLoading: isAddingToCart }] = useAddToCardMutation();
    const [addFavorite] = useAddFavoriteProductMutation();
    const { data: favoriteData } = useMyAllFavoriteProductQuery(undefined);
    const { data: cartData } = useMyAllProductQuery(undefined);

    const isFavorite = favoriteData?.data?.some((item: any) => item.productId === product._id);
    const isInCart = cartData?.data?.items?.some((item: any) => item.product?._id === product._id);


    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const data = {
                productId: product._id,
                quantity: 1,
                // Taking defaults if available
                color: product.color?.[0]?.type || "",
                storage: product.storage?.[0]?.type || "",
            };
            await addToCart(data).unwrap();
            toast.success("Added to cart");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to add to cart");
        }
    };

    const handleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {

            const response = await addFavorite(product._id).unwrap();
            console.log(response);
            toast.success(response?.message)

        } catch (error: any) {
            toast.error(error?.data?.message || "Action failed");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            data-cursor="view"
            className="group bg-[#f7f7f7] rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-500 relative"
        >
            <Link href={`/shop/${product._id}`} className="block">
                {/* Image Container */}
                <div className="relative aspect-square w-full flex items-center justify-center p-8 bg-[#E5E7EB]/50">
                    <Image
                        src={product.image ? (product.image.startsWith('http') ? product.image : `${imageBaseURL}${product.image}`) : "/placeholder-product.png"}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="object-contain mix-blend-multiply h-50 w-full group-hover:scale-110 transition-transform duration-500"
                    />
                </div>

                {/* Info Section */}
                <div className="p-6 bg-white">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px]">{product.description}</p>

                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-primary">
                            €{product.basePrice}
                        </span>
                        {/* You can add old price if available in your API response */}
                    </div>
                </div>
            </Link>

            {/* Floating Icons - Placed outside the main Link for independent interaction */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10">
                <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className={cn(
                        "w-10 h-10 rounded-full cursor-pointer shadow-md flex items-center justify-center transition-all duration-300",
                        isInCart ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-primary hover:text-white"
                    )}
                >
                    {isAddingToCart ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : isInCart ? (
                        <Check size={20} />
                    ) : (
                        <Plus size={20} />
                    )}
                </button>
                <button
                    onClick={handleFavorite}
                    className={cn(
                        "w-10 h-10 rounded-full cursor-pointer bg-white shadow-md flex items-center justify-center transition-colors",
                        isFavorite ? "text-red-500" : "text-gray-600 hover:text-red-500"
                    )}
                >
                    <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                </button>
            </div>
        </motion.div>
    );
}