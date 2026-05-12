"use client";

import React from "react";
import { Clock, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface IssueProps {
    serviceType: "pickup" | "self";
    setServiceType: (type: "pickup" | "self") => void;
    formData: {
        pickupDate: string;
        timeSlot: string;
        address: string;
        description: string;
    };
    setFormData: (data: any) => void;
    totalPrice: number;
    prevStep: () => void;
    handleSubmit: () => void;
    isSubmitting: boolean;
    selectedServices: string[];
}

export const Issue = ({
    serviceType,
    setServiceType,
    formData,
    setFormData,
    totalPrice,
    prevStep,
    handleSubmit,
    isSubmitting,
    selectedServices
}: IssueProps) => {
    return (
        <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    {/* Service Type Selection */}
                    <div className="space-y-4">
                        <div
                            onClick={() => setServiceType("pickup")}
                            className={cn(
                                "relative group rounded-xl overflow-hidden border-2 p-8 transition-all cursor-pointer",
                                serviceType === "pickup" ? "border-primary bg-primary/5 shadow-xl shadow-primary/5" : "border-gray-50 bg-gray-50/50 hover:border-gray-100"
                            )}
                        >
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-medium text-gray-900">Pickup & Delivery</h3>
                                    <p className="text-gray-500 max-w-sm">We come to your location, pick up the device, and bring it back</p>
                                </div>
                                <div className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 backdrop-blur-md">
                                    <Clock size={14} />
                                    Faster
                                </div>
                            </div>
                            <input type="radio" checked={serviceType === "pickup"} readOnly className="absolute top-8 right-8 w-6 h-6 accent-primary" />
                        </div>

                        <div
                            onClick={() => setServiceType("self")}
                            className={cn(
                                "rounded-xl border-2 p-8 flex items-center justify-between transition-all cursor-pointer group",
                                serviceType === "self" ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📍</div>
                                <div>
                                    <h4 className="font-medium text-gray-900 text-xl">Self Drop-off</h4>
                                    <p className="text-xs text-gray-400">Visit our nearest service center</p>
                                </div>
                            </div>
                            <div className={cn(
                                "w-6 h-6 rounded-full border-2 transition-colors",
                                serviceType === "self" ? "border-primary bg-primary" : "border-gray-200 group-hover:border-primary"
                            )} />
                        </div>
                    </div>

                    {/* Pickup Form */}
                    <div className="bg-gray-50/50 rounded-lg p-8 border border-gray-100 space-y-6">
                        <h3 className="text-xl font-medium text-gray-900">Service Information</h3>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-400 px-2 ">Service Address</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Enter your street address, city"
                                className="w-full bg-white border border-gray-200 mt-2 rounded-sm p-4 text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 px-2">Pickup Date</label>
                                <div className="mt-1">
                                    <Popover>
                                        <PopoverTrigger
                                            render={
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full h-14 justify-start text-left font-normal border-gray-200 rounded-sm bg-gray-50/50 hover:bg-gray-50/50",
                                                        !formData.pickupDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-3 h-5 w-5 text-gray-400" />
                                                    {formData.pickupDate ? (
                                                        <span className="text-gray-900 font-medium">
                                                            {format(new Date(formData.pickupDate), "PPP")}
                                                        </span>
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                </Button>
                                            }
                                        />
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={formData.pickupDate ? new Date(formData.pickupDate) : undefined}
                                                onSelect={(date) =>
                                                    setFormData({
                                                        ...formData,
                                                        pickupDate: date ? format(date, "yyyy-MM-dd") : ""
                                                    })
                                                }
                                                initialFocus
                                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 px-2">Time Slot</label>
                                <div className="mt-1">
                                    <Select
                                        value={formData.timeSlot}
                                        onValueChange={(value) => setFormData({ ...formData, timeSlot: value })}
                                    >
                                        <SelectTrigger className="w-full h-14 py-7 border-gray-200 rounded-sm focus:ring-primary focus:ring-offset-0 font-medium text-gray-900">
                                            <div className="flex items-center gap-3">
                                                <Clock className="h-5 w-5 text-gray-400" />
                                                <SelectValue placeholder="Select a time slot" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className={`p-1`}>
                                            <SelectItem className="p-4" value="10:00-12:00">10:00 AM - 12:00 PM</SelectItem>
                                            <SelectItem className="p-4" value="12:00-14:00">12:00 PM - 02:00 PM</SelectItem>
                                            <SelectItem className="p-4" value="14:00-16:00">02:00 PM - 04:00 PM</SelectItem>
                                            <SelectItem className="p-4" value="16:00-18:00">04:00 PM - 06:00 PM</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400  px-2">Issue Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Please describe the problem in detail..."
                                className="w-full bg-white border mt-1 border-gray-200 rounded-sm p-5 text-sm font-medium focus:ring-2 focus:ring-primary outline-none h-32 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Price Breakdown Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-2xl shadow-gray-200/50 space-y-8">
                        <h3 className="text-2xl font-medium text-gray-900 border-b border-gray-50 pb-4">Order Summary</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-gray-500">
                                <span className="font-medium">Selected Services ({selectedServices.length})</span>
                                <span className="text-gray-900 font-bold">€{totalPrice}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-500">
                                <span className="font-medium">Service Fee ({serviceType})</span>
                                <span className="text-gray-900 font-bold">€{serviceType === "pickup" ? 10 : 0}</span>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex justify-between items-center text-3xl font-bold text-primary">
                                    <span>Total</span>
                                    <span>€{totalPrice + (serviceType === "pickup" ? 10 : 0)}</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-2xl cursor-pointer font-medium text-lg shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : "Confirm & Submit Request"}
                        </Button>
                    </div>

                    <button onClick={prevStep} className="w-full text-center text-gray-400 font-medium hover:text-gray-900 transition-colors cursor-pointer py-2 px-4 rounded-xl hover:bg-gray-50">
                        Go Back and Edit
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
