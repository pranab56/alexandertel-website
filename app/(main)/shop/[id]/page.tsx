"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Minus,
    Plus,
    ShoppingCart,
    Heart,
    ChevronRight,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductCard } from "@/components/home/FeaturedGadgets";
import { useGetSingleProductQuery, useGetAllProductQuery, useGetRelatedProductQuery } from "@/features/shop/shopApi";
import { useAddFavoriteProductMutation, useMyAllFavoriteProductQuery } from "@/features/shop/favoriteProductApi";
import { useAddToCardMutation, useMyAllProductQuery } from "@/features/shop/cartApi";
import { imageBaseURL } from "@/utils/BaseURL";
import toast from "react-hot-toast";

export default function ProductDetails() {
    const { id } = useParams();
    const { data: response, isLoading, error } = useGetSingleProductQuery(id);
    const { data: relatedResponse } = useGetRelatedProductQuery(id);
    const productData = response?.data;
    const recommendedProducts = relatedResponse?.data || [];

    const [addCard, { isLoading: addCardLoading }] = useAddToCardMutation();

    const [selectedColor, setSelectedColor] = useState<{ type: string; price: number } | null>(null);
    const [selectedStorage, setSelectedStorage] = useState<{ type: string; price: number } | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState("");

    // Favorite Product Logic
    const [addFavorite] = useAddFavoriteProductMutation();
    const { data: favoriteData } = useMyAllFavoriteProductQuery({});
    const isFavorite = useMemo(() => {
        return favoriteData?.data?.some((fav: any) => fav.productId === id);
    }, [favoriteData, id]);

    // Cart Status Logic
    const { data: cartData } = useMyAllProductQuery({});
    const isInCart = useMemo(() => {
        return cartData?.data?.items?.some((item: any) => item.product?._id === id);
    }, [cartData, id]);

    const handleToggleFavorite = async () => {
        try {
            const response = await addFavorite(id).unwrap();
            if (response.success) {
                toast.success(response.message);
            }
        } catch (err) {
            console.error("Failed to toggle favorite:", err);
        }
    };

    const handleAddToCart = async () => {
        if (!selectedColor || !selectedStorage) {
            toast.error("Please select all options before adding to cart");
            return;
        }

        try {
            const payload = {
                productId: id,
                quantity: quantity,
                color: selectedColor.type,
                storage: selectedStorage.type,
            };
            const response = await addCard(payload).unwrap();
            if (response.success) {
                toast.success(response.message || "Product added to cart!");
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to add to cart");
            console.error("Cart error:", err);
        }
    };

    // Initialize selections when data arrives
    useEffect(() => {
        if (productData) {
            if (productData.colors?.length > 0) setSelectedColor(productData.colors[0]);
            if (productData.storage?.length > 0) setSelectedStorage(productData.storage[0]);
            if (productData.images?.length > 0) setActiveImage(productData.images[0]);
        }
    }, [productData]);

    // Price calculation
    const totalPrice = useMemo(() => {
        if (!productData) return 0;
        const base = selectedStorage ? selectedStorage.price : productData.basePrice;
        const colorOffset = selectedColor ? selectedColor.price : 0;
        return base + colorOffset;
    }, [productData, selectedColor, selectedStorage]);

    // Zoom Logic State
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setZoomPos({ x, y });
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
        </div>
    );

    if (error || !productData) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-500 mb-8">We couldn&apos;t find the product you&apos;re looking for.</p>
            <Button variant="default">
                <Link href="/shop">Back to Shop</Link>
            </Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F9FAFB] pb-20">
            {/* Header Section */}
            <section className="relative h-[100px] flex items-center overflow-hidden mb-12">
                <div className="absolute inset-0 z-0 text-center">
                    <Image
                        src="/images/home/hero/image1.jpg"
                        alt="Product Header"
                        fill
                        className="object-cover"
                        priority
                        quality={100}
                    />
                    <div className="absolute inset-0 bg-black/50 z-10" />
                </div>
            </section>

            <div className="container mx-auto px-6">
                <div className="pb-10">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-primary transition-colors cursor-pointer">Home</Link>
                        <ChevronRight size={14} />
                        <Link href="/shop" className="hover:text-primary transition-colors cursor-pointer">Shop</Link>
                        <ChevronRight size={14} />
                        <span className="text-primary font-medium">{productData.name}</span>
                    </div>
                </div>

                {/* Main Product Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Column 1: Advanced Gallery with Hover Zoom */}
                    <div className="flex flex-col gap-6 sticky top-28">
                        <motion.div
                            ref={containerRef}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onMouseMove={handleMouseMove}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white shadow-none border border-gray-100 flex items-center justify-center cursor-crosshair group"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full h-full p-12 relative flex items-center justify-center"
                                >
                                    <Image
                                        src={activeImage ? (activeImage.startsWith('http') ? activeImage : imageBaseURL + activeImage) : "/images/placeholder.jpg"}
                                        alt={productData.name}
                                        width={800}
                                        height={800}
                                        className={cn(
                                            "object-contain w-full h-full transition-opacity duration-300",
                                            isHovered ? "opacity-0" : "opacity-100"
                                        )}
                                    />

                                    {/* Zoom Overlay */}
                                    {isHovered && (
                                        <div className="absolute inset-0 z-10 p-0 overflow-hidden pointer-events-none">
                                            <div
                                                className="absolute bg-white"
                                                style={{
                                                    width: '200%',
                                                    height: '200%',
                                                    top: `${-zoomPos.y}%`,
                                                    left: `${-zoomPos.x}%`,
                                                    backgroundImage: `url(${activeImage.startsWith('http') ? activeImage : imageBaseURL + activeImage})`,
                                                    backgroundSize: '100% auto',
                                                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                                                    backgroundRepeat: 'no-repeat',
                                                }}
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>

                        {/* Premium Thumbnails */}
                        <div className="flex gap-4">
                            {productData.images?.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={cn(
                                        "relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all p-3 bg-white",
                                        activeImage === img ? "border-primary shadow-lg scale-105" : "border-transparent opacity-60 hover:opacity-100"
                                    )}
                                >
                                    <Image
                                        src={img.startsWith('http') ? img : imageBaseURL + img}
                                        alt={`${productData.name} thumb ${idx}`}
                                        fill
                                        className="object-contain p-2"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Product Configuration & Details */}
                    <div className="flex flex-col gap-8">
                        <div className="space-y-4">
                            <h1 className="text-5xl font-medium text-gray-900 tracking-tight leading-tight">{productData.name}</h1>

                            <div className="flex items-center gap-4 py-2">
                                <span className="text-4xl font-medium text-primary">€{totalPrice}</span>
                                <span className="text-gray-400 text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">{productData.stock} in stock</span>
                            </div>

                            <p className="text-gray-500 text-lg leading-relaxed max-w-xl">
                                {productData.description}
                            </p>
                        </div>

                        {/* Selection: Color */}
                        {productData.colors?.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-medium text-gray-900">Color Options</h3>
                                    <span className="text-xs text-gray-400">{productData.colors.length} choices</span>
                                </div>
                                <div className="flex gap-4">
                                    {productData.colors.map((color: any) => (
                                        <button
                                            key={color.type}
                                            onClick={() => setSelectedColor(color)}
                                            className={cn(
                                                "group relative w-11 h-11 rounded-full border-2 transition-all flex items-center justify-center p-0.5",
                                                selectedColor?.type === color.type ? "border-primary shadow-md" : "border-transparent hover:border-gray-200"
                                            )}
                                        >
                                            <div
                                                className="w-full h-full rounded-full shadow-inner transition-transform group-active:scale-90"
                                                style={{ backgroundColor: color.type }}
                                            />
                                            {selectedColor?.type === color.type && (
                                                <motion.div layoutId="color-ring" className="absolute -inset-[3px] border-2 border-primary rounded-full" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Selection: Storage */}
                        {productData.storage?.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-gray-900">Storage Capacity</h3>
                                <div className="flex flex-wrap gap-3">
                                    {productData.storage.map((storage: any) => (
                                        <button
                                            key={storage.type}
                                            onClick={() => setSelectedStorage(storage)}
                                            className={cn(
                                                "px-8 py-4 rounded-xl cursor-pointer border-2 font-bold text-sm transition-all relative overflow-hidden",
                                                selectedStorage?.type === storage.type
                                                    ? "border-primary bg-primary text-white shadow-xl shadow-primary/20 scale-105"
                                                    : "border-gray-100 bg-white text-gray-500 hover:border-gray-300"
                                            )}
                                        >
                                            {storage.type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <hr className="border-gray-100" />

                        {/* Quantity & Action Panel */}
                        <div className="flex flex-col sm:flex-row gap-6 items-stretch pt-2">
                            <div className="flex items-center bg-gray-100 rounded-xl p-1.5 shrink-0 h-16 w-full sm:w-auto">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-14 h-full flex items-center justify-center text-gray-600 hover:text-gray-900 cursor-pointer hover:bg-white rounded-lg transition-all"
                                >
                                    <Minus size={20} />
                                </button>
                                <div className="w-14 text-center font-bold text-gray-900 text-xl">{quantity}</div>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-14 h-full flex items-center justify-center bg-primary text-white cursor-pointer rounded-lg shadow-lg shadow-primary/30 hover:scale-[1.05] transition-all active:scale-95"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            <div className="flex gap-4 flex-1">
                                <Button
                                    size="lg"
                                    onClick={handleAddToCart}
                                    disabled={addCardLoading}
                                    className={cn(
                                        "flex-1 h-16 rounded-xl cursor-pointer font-medium text-lg gap-3 shadow-xl transition-all active:scale-95 disabled:opacity-70",
                                        isInCart ? "bg-green-600 hover:bg-green-700 text-white shadow-green-900/20" : "bg-primary hover:bg-primary/90 text-white shadow-primary/20"
                                    )}
                                >
                                    {addCardLoading ? (
                                        <Loader2 className="animate-spin h-5 w-5" />
                                    ) : isInCart ? (
                                        <Plus className="rotate-45 h-5 w-5" />
                                    ) : (
                                        <ShoppingCart size={22} />
                                    )}
                                    {addCardLoading ? "Adding..." : isInCart ? "Already in Cart" : "Add to Cart"}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleToggleFavorite}
                                    className={cn(
                                        "h-16 w-16 min-w-[64px] rounded-xl border-gray-200 transition-all active:scale-95 cursor-pointer",
                                        isFavorite ? "bg-red-50 border-red-200 text-red-500" : "hover:bg-red-50 hover:border-red-100 hover:text-red-500"
                                    )}
                                >
                                    <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
                                </Button>
                            </div>
                        </div>

                        <div className="pt-6">
                            <Accordion className="w-full space-y-3">
                                <AccordionItem value="specifications" className="border-none bg-white rounded-2xl cursor-pointer px-8 shadow-sm border border-gray-50">
                                    <AccordionTrigger className="hover:no-underline py-7 group cursor-pointer">
                                        <span className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                            <span className="w-1.5 h-6 bg-primary rounded-full" />
                                            Product Specifications
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-8">
                                        <div className="grid grid-cols-1 gap-1">
                                            {[
                                                { l: "Category", r: productData.catagory },
                                                { l: "Device Type", r: productData.deviceType },
                                                { l: "Battery", r: productData.battery },
                                                { l: "Camera", r: productData.camera },
                                                { l: "Stock Status", r: productData.stock > 0 ? "In Stock" : "Out of Stock" },
                                                { l: "Chipset", r: productData.cheap || "N/A" },
                                            ].map((spec, i) => (
                                                <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-none group/row px-2 rounded-xl hover:bg-gray-50/50 transition-colors">
                                                    <span className="text-gray-400 font-medium">{spec.l}</span>
                                                    <span className="text-gray-900 font-bold capitalize">{spec.r}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </div>

                {/* Recommended Products Feed */}
                {recommendedProducts.length > 0 && (
                    <div className="mt-40">
                        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
                            <div className="text-center md:text-left space-y-2">
                                <h2 className="text-4xl md:text-5xl font-medium text-gray-900 tracking-tight">Recommended products</h2>
                                <p className="text-gray-500 text-lg">Top-tier essentials picked just for you</p>
                            </div>
                            <Link href="/shop" className="group flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 text-gray-900 font-medium hover:bg-primary hover:text-white transition-all">
                                View All Collection
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {recommendedProducts.slice(0, 4).map((p: any, index: number) => (
                                <ProductCard key={p._id} product={p} index={index} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}