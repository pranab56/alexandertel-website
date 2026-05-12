"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ServicesProps {
    availableServices: any[];
    selectedServices: string[];
    toggleService: (id: string) => void;
    nextStep: () => void;
    prevStep: () => void;
}

export const Services = ({ 
    availableServices, 
    selectedServices, 
    toggleService, 
    nextStep, 
    prevStep 
}: ServicesProps) => {
    return (
        <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
        >
            <div>
                <h2 className="text-2xl font-medium text-gray-900">Select Services Required</h2>
                <p className="text-gray-500">Pick the services you need for your repair</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableServices.map((service: any) => (
                    <div
                        key={service._id}
                        onClick={() => toggleService(service._id)}
                        className={cn(
                            "p-8 rounded-lg border-2 transition-all cursor-pointer text-center group relative",
                            selectedServices.includes(service._id) ? "border-primary bg-primary/5" : "border-gray-50 bg-gray-50/50 hover:border-gray-100 hover:bg-gray-50"
                        )}
                    >
                        <div className="w-16 h-16 bg-white/50 rounded-xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                            🔧
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">{service.name}</h4>
                        <p className="text-sm text-gray-400 font-medium mb-3">€{service.price}</p>
                        
                        {selectedServices.includes(service._id) && (
                            <div className="absolute top-4 right-4 text-primary">
                                <CheckCircle2 size={24} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-between pt-10">
                <Button variant="outline" onClick={prevStep} className="h-14 px-8 rounded-lg font-medium cursor-pointer border-gray-200">Back</Button>
                <Button
                    disabled={selectedServices.length === 0}
                    onClick={nextStep}
                    className="h-14 px-12 cursor-pointer rounded-lg font-medium bg-primary text-white text-lg shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                    Summary
                </Button>
            </div>
        </motion.div>
    );
};
