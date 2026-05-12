"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Plus, Heart, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { useGetAllProductQuery } from "@/features/shop/shopApi";
import { useAddToCardMutation, useMyAllProductQuery } from "@/features/shop/cartApi";
import { useAddFavoriteProductMutation, useMyAllFavoriteProductQuery } from "@/features/shop/favoriteProductApi";
import { imageBaseURL } from "@/utils/BaseURL";
import toast from "react-hot-toast";

interface Product {
    _id: string;
    name: string;
    description: string;
    basePrice: number;
    image: string;
    stockStatus: string;
    color: { type: string; price: number }[];
    storage: { type: string; price: number }[];
    ram: any[];
}

export default function ShopPage() {
    const [category, setCategory] = useState("All Products");
    const [sortBy, setSortBy] = useState("Popular");
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [searchTerm, setSearchTerm] = useState("");

    // Prepare API params
    const apiParams = useMemo(() => {
        const params: any = {
            searchTerm,
            categories: category === "All Products" ? "" : category,
            minPrice: priceRange[0].toString(),
            maxPrice: priceRange[1].toString(),
        };

        if (sortBy === "Price: High to Low") {
            params.sortBy = "basePrice";
            params.sortOrder = "desc";
        } else if (sortBy === "Price: Low to High") {
            params.sortBy = "basePrice";
            params.sortOrder = "asc";
        }

        return params;
    }, [searchTerm, category, priceRange, sortBy]);

    const { data: response, isLoading, isError } = useGetAllProductQuery(apiParams);
    const products = response?.data || [];

    const resetFilters = () => {
        setCategory("All Products");
        setSortBy("Popular");
        setPriceRange([0, 5000]);
        setSearchTerm("");
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Section */}
            <section className="relative h-[350px] flex items-center overflow-hidden mb-12">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/home/hero/image1.jpg"
                        alt="Offers Header"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-blue-900/60 z-10" />
                </div>

                <div className="container mx-auto px-6 relative z-20 text-white">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-sm text-white/70">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <ChevronRight size={14} />
                            <span className="text-white font-medium">Shop</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-medium tracking-tight">Shop</h1>
                        <p className="text-xl text-white/70">
                            Discover our complete range of devices and accessories
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-6 mt-16">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-72 shrink-0">
                        <div className="bg-white rounded-lg p-8 shadow-sm sticky top-24 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-8">Filters</h2>

                            {/* Category Filter */}
                            <div className="mb-10">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5">Category</h3>
                                <div className="flex flex-col gap-4">
                                    {["All Products", "Smartphones", "Accessories"].map((cat) => (
                                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    checked={category === cat}
                                                    onChange={() => setCategory(cat)}
                                                    className="peer sr-only"
                                                />
                                                <div className="w-5 h-5 rounded-full border-2 border-gray-200 peer-checked:border-primary transition-colors" />
                                                <div className="absolute w-2.5 h-2.5 rounded-full bg-primary opacity-0 peer-checked:opacity-100 transition-opacity" />
                                            </div>
                                            <span className={cn(
                                                "text-sm font-medium transition-colors",
                                                category === cat ? "text-gray-900" : "text-gray-500 group-hover:text-gray-700"
                                            )}>{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Sort Filter */}
                            <div className="mb-10">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5">Sort by</h3>
                                <div className="flex flex-col gap-4">
                                    {["Popular", "Price: High to Low", "Price: Low to High"].map((sort) => (
                                        <label key={sort} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    name="sort"
                                                    checked={sortBy === sort}
                                                    onChange={() => setSortBy(sort)}
                                                    className="peer sr-only"
                                                />
                                                <div className="w-5 h-5 rounded-full border-2 border-gray-200 peer-checked:border-primary transition-colors" />
                                                <div className="absolute w-2.5 h-2.5 rounded-full bg-primary opacity-0 peer-checked:opacity-100 transition-opacity" />
                                            </div>
                                            <span className={cn(
                                                "text-sm font-medium transition-colors",
                                                sortBy === sort ? "text-gray-900" : "text-gray-500 group-hover:text-gray-700"
                                            )}>{sort}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price range */}
                            <div className="mb-10">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5">Price</h3>
                                <div className="px-1">
                                    <Slider
                                        defaultValue={[0, 5000]}
                                        max={5000}
                                        step={100}
                                        value={priceRange}
                                        onValueChange={(value) => setPriceRange(value as number[])}
                                        className="mb-4"
                                    />
                                    <div className="text-sm font-bold text-gray-900">
                                        €{priceRange[0]} - €{priceRange[1]}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={resetFilters}
                                className="w-full text-center text-primary font-medium text-sm h-12 rounded-sm cursor-pointer border-2 border-primary/10 hover:bg-primary/5 transition-colors"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </aside>

                    {/* Product Listing */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-gray-400 font-medium">
                                {isLoading ? "Searching..." : `${products.length} Products Found`}
                            </p>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-40">
                                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                <AnimatePresence mode="popLayout">
                                    {products.map((product: Product, index: number) => (
                                        <ProductCard key={product._id} product={product} index={index} />
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                                    <Plus size={40} className="rotate-45" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-500 mb-8">Try adjusting your filters to find what you&apos;re looking for.</p>
                                <Button onClick={resetFilters} variant="outline" className="rounded-xl border-primary text-primary hover:bg-primary/5">
                                    Clear all filters
                                </Button>
                            </div>
                        )}

                        {isError && (
                            <div className="text-center py-20 text-red-500">
                                Failed to load products. Please try again later.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
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
            toast.success(response.message);
        } catch (error: any) {
            toast.error(error?.data?.message || "Action failed");
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            data-cursor="view"
            className="group bg-white rounded-xl cursor-pointer overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 relative"
        >
            <Link href={`/shop/${product._id}`} className="block">
                {/* Image Container */}
                <div className="relative aspect-square w-full flex items-center justify-center p-8 bg-[#E5E7EB]/30 overflow-hidden">
                    <Image
                        src={product.image ? (product.image.startsWith('http') ? product.image : imageBaseURL + product.image) : "/images/placeholder.jpg"}
                        alt={product.name}
                        width={500}
                        height={500}
                        className="object-contain h-full w-full group-hover:scale-110 transition-transform duration-500"
                    />
                </div>

                {/* Info Section */}
                <div className="p-6 bg-white">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors mb-1 truncate">
                        {product.name}
                    </h3>
                    <p className="text-gray-400 text-xs mb-4 line-clamp-2 min-h-[32px]">{product.description}</p>

                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                            €{product.basePrice}
                        </span>
                        <div className="text-[10px] font-bold px-2 py-1 bg-gray-100 rounded text-gray-500">
                            {product.stockStatus}
                        </div>
                    </div>
                </div>
            </Link>

            {/* Floating Icons */}
            <div className="absolute top-5 right-5 flex flex-col gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10">
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