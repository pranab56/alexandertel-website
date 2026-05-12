"use client";

import React from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { imageBaseURL } from "@/utils/BaseURL";
import CustomLoading from "../ui/CustomLoading";

interface DevicesProps {
    myProducts: any[];
    selectedDevice: string | null;
    setSelectedDevice: (id: string) => void;
    nextStep: () => void;
    isLoadingMyProducts: boolean;
}

export const Devices = ({ myProducts, selectedDevice, setSelectedDevice, nextStep, isLoadingMyProducts }: DevicesProps) => {
    return (
        <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
        >
            <div>
                <h2 className="text-2xl font-medium text-gray-900">Select Your Device</h2>
                <p className="text-gray-500">Choose the device you need to repair</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4 p-6 rounded-sm shadow-sm max-h-[400px] overflow-y-auto custom-scrollbar">
                    {isLoadingMyProducts ? (
                        <CustomLoading />
                    ) : myProducts.length > 0 ? myProducts.map((product: any) => (
                        <div
                            key={product.productId}
                            onClick={() => setSelectedDevice(product.productId)}
                            className={cn(
                                "p-4 rounded-lg border-2 transition-all cursor-pointer flex items-center gap-6",
                                selectedDevice === product.productId ? "border-primary bg-primary/5" : "border-gray-50 bg-gray-50/50 hover:border-gray-200"
                            )}
                        >
                            <div className="w-14 h-12 bg-white rounded-sm flex items-center justify-center shadow-sm">
                                <Image
                                    src={product.image ? (product.image.startsWith('http') ? product.image : imageBaseURL + product.image) : "/placeholder-product.png"}
                                    alt={product.name}
                                    width={40}
                                    height={40}
                                    className="object-contain mix-blend-multiply"
                                />
                            </div>
                            <div className="flex-1 text-left">
                                <h4 className="font-medium text-gray-900">{product.name}</h4>
                                <p className="text-xs text-gray-400">{product.storage || ""} {product.color || ""}</p>
                            </div>
                            <div className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                selectedDevice === product.productId ? "border-primary" : "border-gray-300"
                            )}>
                                {selectedDevice === product.productId && <div className="w-3 h-3 bg-primary rounded-full transition-transform animate-in zoom-in-50" />}
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-10 text-gray-400 font-medium">
                            No products found in your billing history.
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg p-8 border border-gray-100 flex flex-col h-auto gap-6 text-center md:text-left">
                    <div>
                        <h4 className="font-medium text-gray-900">Can&apos;t find your device?</h4>
                        <p className="text-sm text-gray-400 mt-1 uppercase font-medium tracking-wider">Serial / IMEI number</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            className="w-full bg-white border border-gray-200 rounded-lg py-4 pl-12 pr-4 text-sm font-medium focus:outline-shadow focus:border-primary transition-all"
                            placeholder="Search & Enter device identifier"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-10">
                <Button
                    disabled={!selectedDevice}
                    onClick={nextStep}
                    className="h-14 px-12 cursor-pointer rounded-lg font-medium bg-primary text-white text-lg shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                    Next Step
                </Button>
            </div>
        </motion.div>
    );
};
