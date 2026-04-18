"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Minus,
    Plus,
    ShoppingCart,
    Heart,
    ChevronRight
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

const colors = [
    { name: "Blue", hex: "#3b82f6" },
    { name: "Purple", hex: "#a855f7" },
    { name: "Navy", hex: "#1e293b" },
    { name: "Orange", hex: "#f97316" },
    { name: "Red", hex: "#ef4444" },
];

const storages = ["4/64 GB", "4/128 GB", "8/256 GB"];

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [selectedColor, setSelectedColor] = useState(colors[2]);
    const [selectedStorage, setSelectedStorage] = useState(storages[1]);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState("");

    // Zoom Logic State
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch("/product.json")
            .then((res) => res.json())
            .then((data) => {
                setAllProducts(data);
                const found = data.find((p: Product) => p.id === Number(id));
                if (found) {
                    setProduct(found);
                    setActiveImage(found.image);
                }
            });
    }, [id]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setZoomPos({ x, y });
    };

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F9FAFB] pb-20">
            {/* Header Section */}
            <section className="relative h-[70px] flex items-center overflow-hidden mb-12">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/home/hero/image1.jpg"
                        alt="Product Header"
                        fill
                        className="object-cover"
                        priority
                        quality={100}
                    />
                    <div className="absolute inset-0 bg-black/40 z-10" />
                </div>
                {/* <div className="container mx-auto px-6 relative z-20">
                    <div className="flex flex-col gap-4 text-white">
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <Link href="/" className="hover:text-white transition-colors cursor-pointer">Home</Link>
                            <ChevronRight size={14} />
                            <Link href="/shop" className="hover:text-white transition-colors cursor-pointer">Shop</Link>
                            <ChevronRight size={14} />
                            <span className="text-primary font-medium">{product.name}</span>
                        </div>
                      
                    </div>
                </div> */}
            </section>

            <div className="container mx-auto px-6">
                <div className="pb-10">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-primary transition-colors cursor-pointer">Home</Link>
                        <ChevronRight size={14} />
                        <Link href="/shop" className="hover:text-primary transition-colors cursor-pointer">Shop</Link>
                        <ChevronRight size={14} />
                        <span className="text-primary font-medium">{product.name}</span>
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
                            className="relative aspect-square w-full rounded-lg overflow-hidden bg-white shadow-none border border-gray-100 flex items-center justify-center cursor-crosshair group"
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
                                        src={activeImage}
                                        alt={product.name}
                                        width={800}
                                        height={800}
                                        className={cn(
                                            "object-contain w-full h-full mix-blend-multiply transition-opacity duration-300",
                                            isHovered ? "opacity-0" : "opacity-100"
                                        )}
                                    />

                                    {/* Zoom Overlay (The Lens Effect) */}
                                    {isHovered && (
                                        <div
                                            className="absolute inset-0 z-10 p-0 overflow-hidden rounded-[2.5rem] pointer-events-none"
                                        >
                                            <div
                                                className="absolute bg-white"
                                                style={{
                                                    width: '200%',
                                                    height: '200%',
                                                    top: `${-zoomPos.y}%`,
                                                    left: `${-zoomPos.x}%`,
                                                    backgroundImage: `url(${activeImage})`,
                                                    backgroundSize: '70% auto', // Responsive zoom scale
                                                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                                                    backgroundRepeat: 'no-repeat',
                                                    borderRadius: 'inherit'
                                                }}
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>

                        {/* Premium Thumbnails Swiper-like Grid */}
                        <div className="flex gap-4">
                            {[product.image, product.image, product.image].map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={cn(
                                        "relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all p-3 bg-white",
                                        activeImage === img ? "border-primary shadow-lg scale-105" : "border-transparent opacity-60 hover:opacity-100"
                                    )}
                                >
                                    <Image
                                        src={img}
                                        alt={`${product.name} thumb ${idx}`}
                                        fill
                                        className="object-contain mix-blend-multiply p-2"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Product Configuration & Details */}
                    <div className="flex flex-col gap-8">
                        <div className="space-y-4">
                            <h1 className="text-5xl font-medium text-gray-1000 tracking-tight leading-none">{product.name}</h1>

                            <div className="flex items-center gap-4 py-2">
                                <span className="text-4xl font-medium text-primary">€{product.price}</span>
                                {product.oldPrice && (
                                    <span className="text-gray-400 line-through text-xl font-medium">€{product.oldPrice}</span>
                                )}
                            </div>

                            <p className="text-gray-500 text-lg leading-relaxed max-w-xl">
                                Experience the peak of mobile technology with the new iPhone 15 Pro. Features a stunning Titanium design, the powerful A17 Pro chip, and a professional-grade camera system.
                            </p>
                        </div>

                        {/* Selection: Color */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium text-gray-900">Color: {selectedColor.name}</h3>
                                <span className="text-xs text-gray-400">5 colors available</span>
                            </div>
                            <div className="flex gap-4">
                                {colors.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => setSelectedColor(color)}
                                        className={cn(
                                            "group relative w-11 h-11 rounded-full border-2 transition-all flex items-center justify-center p-0.5",
                                            selectedColor.name === color.name ? "border-primary shadow-md" : "border-transparent hover:border-gray-200"
                                        )}
                                    >
                                        <div
                                            className="w-full h-full rounded-full shadow-inner transition-transform group-active:scale-90"
                                            style={{ backgroundColor: color.hex }}
                                        />
                                        {selectedColor.name === color.name && (
                                            <motion.div layoutId="color-ring" className="absolute -inset-[3px] border-2 border-primary rounded-full" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Selection: Storage */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-900">Storage Capacity</h3>
                            <div className="flex flex-wrap gap-3">
                                {storages.map((storage) => (
                                    <button
                                        key={storage}
                                        onClick={() => setSelectedStorage(storage)}
                                        className={cn(
                                            "px-8 py-4 rounded-sm cursor-pointer border-2 font-bold text-sm transition-all relative overflow-hidden",
                                            selectedStorage === storage
                                                ? "border-primary bg-primary text-white shadow-xl shadow-primary/20 scale-105"
                                                : "border-gray-100 bg-white text-gray-500 hover:border-gray-300"
                                        )}
                                    >
                                        {storage}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Quantity & Action Panel */}
                        <div className="flex flex-col sm:flex-row gap-6 items-stretch pt-2">
                            <div className="flex items-center bg-gray-100 rounded-sm p-1.5 shrink-0 h-16 w-full sm:w-auto">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-14 h-full flex items-center justify-center text-gray-600 hover:text-gray-900 cursor-pointer hover:bg-white rounded-sm transition-all"
                                >
                                    <Minus size={20} />
                                </button>
                                <div className="w-14 text-center font-bold text-gray-900 text-xl">{quantity}</div>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-14 h-full flex items-center justify-center bg-primary text-white cursor-pointer rounded-sm shadow-lg shadow-primary/30 hover:scale-[1.05] transition-all active:scale-95"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            <div className="flex gap-4 flex-1">
                                <Button
                                    size="lg"
                                    data-cursor="cart"
                                    className="flex-1 h-16 rounded-lg cursor-pointer bg-primary hover:bg-primary/90 text-white font-medium text-lg gap-3 shadow-xl shadow-primary/20 transition-all active:scale-95 pointer-events-auto"
                                >
                                    <ShoppingCart size={22} />
                                    Add to Cart
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-15 w-15 min-w-16 rounded-sm border-gray-200 hover:bg-red-50 hover:border-red-100 cursor-pointer hover:text-red-500 transition-all active:scale-95"
                                >
                                    <Heart size={50} />
                                </Button>
                            </div>
                        </div>

                        {/* Specs Accordion Section */}
                        <div className="pt-6">
                            <Accordion className="w-full space-y-3">
                                <AccordionItem value="specifications" className="border-none bg-white rounded-lg cursor-pointer px-8 shadow-sm border border-gray-50">
                                    <AccordionTrigger className="hover:no-underline py-7 group cursor-pointer">
                                        <span className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                            <span className="w-1 h-6 bg-primary rounded-full" />
                                            Product Specifications
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-8">
                                        <div className="grid grid-cols-1 gap-1">
                                            {[
                                                { l: "Display", r: "6.1-inch Super Retina XDR" },
                                                { l: "Processor", r: "A17 Pro chip" },
                                                { l: "Storage", r: "128GB / 256GB / 512GB" },
                                                { l: "Camera", r: "48MP Main + 12MP Ultra Wide" },
                                                { l: "Battery", r: "Up to 23 hours video playback" },
                                            ].map((spec, i) => (
                                                <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-none group/row px-2 rounded-lg hover:bg-gray-50/50 transition-colors">
                                                    <span className="text-gray-400 font-medium">{spec.l}</span>
                                                    <span className="text-gray-900 font-bold">{spec.r}</span>
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
                        {allProducts.slice(0, 4).map((p, index) => (
                            <ProductCard key={p.id} product={p} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}