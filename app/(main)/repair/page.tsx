"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ChevronRight,
    CheckCircle2,
    Clock,
    Calendar,
    Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- Sub-components for Repair Flow ---

const StepIndicator = ({ currentStep }: { currentStep: number }) => (
    <div className="flex items-center shadow-sm rounded-lg justify-center gap-4 md:gap-12 py-10">
        {[
            { id: 1, label: "Device" },
            { id: 2, label: "Issue" },
            { id: 3, label: "Service" }
        ].map((step) => (
            <div key={step.id} className="flex items-center gap-3">
                <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    currentStep === step.id ? "bg-primary text-white scale-110 shadow-lg shadow-primary/30" :
                        currentStep > step.id ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                )}>
                    {currentStep > step.id ? <CheckCircle2 size={20} /> : step.id}
                </div>
                <span className={cn(
                    "font-medium text-sm hidden sm:block",
                    currentStep >= step.id ? "text-gray-900" : "text-gray-400"
                )}>{step.label}</span>
                {step.id < 3 && <div className="hidden md:block w-20 h-px bg-gray-200 mx-2" />}
            </div>
        ))}
    </div>
);

export default function RepairPage() {
    const [step, setStep] = useState(1);
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
    const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
    const [serviceType, setServiceType] = useState<"pickup" | "instore">("pickup");

    // Dummy data to match mockups
    const devices = [
        { id: "1", name: "iPhone 15 Pro", desc: "128GB, Natural Titanium", img: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro.jpg" },
        { id: "2", name: "iPhone 15 Pro", desc: "128GB, Natural Titanium", img: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro.jpg" },
        { id: "3", name: "iPhone 15 Pro", desc: "128GB, Natural Titanium", img: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro.jpg" },
    ];

    const issues = [
        { id: "screen", name: "Cracked Screen", desc: "Display or glass repair", icon: "🔧" },
        { id: "battery", name: "Battery Issues", desc: "Drainage or shutdown", icon: "🔋" },
        { id: "water", name: "Water Damage", desc: "Liquid exposure", icon: "💧" },
        { id: "charging", name: "Charging Port", desc: "Not charging", icon: "⚡" },
        { id: "camera", name: "Camera", desc: "Focus or lens blur", icon: "📷" },
        { id: "other", name: "Other", desc: "Hardware or software", icon: "🛠️" },
    ];

    const nextStep = () => setStep(s => Math.min(3, s + 1));
    const prevStep = () => setStep(s => Math.max(1, s - 1));

    return (
        <div className="min-h-screen pb-24">
            {/* Header Hero */}
            <section className="relative h-[350px] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/home/hero/image1.jpg"
                        alt="Repair Header"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-blue-900/60 z-10" />
                </div>
                <div className="container mx-auto px-6 relative z-20">
                    <div className="flex flex-col gap-3 text-white">
                        <div className="flex items-center gap-2 text-sm text-white/70">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <ChevronRight size={14} />
                            <span className="text-white font-medium">Repair</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-medium tracking-tight">Select your device</h1>
                        <p className="text-xl text-white/70">Step {step} of 3: Identify the device needing repair.</p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-6">

                {/* Flow Content */}
                <div className="container mx-auto">
                    <div className="bg-white/80 backdrop-blur-xl  rounded-lg p-4 md:p-8 border border-white/20 mb-10">
                        <StepIndicator currentStep={step} />

                        <div className="bg-white rounded-lg p-8 border border-gray-100 shadow-sm mt-4 min-h-[500px]">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-8 "
                                    >
                                        <div>
                                            <h2 className="text-2xl font-medium text-gray-900">Select Your Device</h2>
                                            <p className="text-gray-500">Choose the device you need to repair</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-4 p-6 rounded-lg shadow-sm">
                                                {devices.map((device) => (
                                                    <div
                                                        key={device.id}
                                                        onClick={() => setSelectedDevice(device.id)}
                                                        className={cn(
                                                            "p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-6",
                                                            selectedDevice === device.id ? "border-primary bg-primary/5" : "border-gray-50 bg-gray-50/50 hover:border-gray-200"
                                                        )}
                                                    >
                                                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm">
                                                            <Image src={device.img} alt={device.name} width={40} height={40} className="object-contain mix-blend-multiply" />
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                            <h4 className="font-medium text-gray-900">{device.name}</h4>
                                                            <p className="text-xs text-gray-400">{device.desc}</p>
                                                        </div>
                                                        <div className={cn(
                                                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                                            selectedDevice === device.id ? "border-primary" : "border-gray-300"
                                                        )}>
                                                            {selectedDevice === device.id && <div className="w-3 h-3 bg-primary rounded-full transition-transform animate-in zoom-in-50" />}
                                                        </div>
                                                    </div>
                                                ))}
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
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-8"
                                    >
                                        <div>
                                            <h2 className="text-2xl font-medium text-gray-900">What&apos;s the issue?</h2>
                                            <p className="text-gray-500">Pick the main problem you&apos;re experiencing</p>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {issues.map((issue) => (
                                                <div
                                                    key={issue.id}
                                                    onClick={() => setSelectedIssue(issue.id)}
                                                    className={cn(
                                                        "p-8 rounded-lg border-2 transition-all cursor-pointer text-center group",
                                                        selectedIssue === issue.id ? "border-primary bg-primary/5" : "border-gray-50 bg-gray-50/50 hover:border-gray-100 hover:bg-gray-50"
                                                    )}
                                                >
                                                    <div className="w-16 h-16 bg-white/50 rounded-xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                                        {issue.icon}
                                                    </div>
                                                    <h4 className="font-medium text-gray-900 mb-1">{issue.name}</h4>
                                                    <p className="text-sm text-gray-400 font-medium">{issue.desc}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex justify-between pt-10">
                                            <Button variant="outline" onClick={prevStep} className="h-14 px-8 rounded-lg font-medium cursor-pointer border-gray-200">Back</Button>
                                            <Button
                                                disabled={!selectedIssue}
                                                onClick={nextStep}
                                                className="h-14 px-12 cursor-pointer rounded-lg font-medium bg-primary text-white text-lg shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                            >
                                                Summary
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                            <div className="lg:col-span-2 space-y-8">
                                                {/* Service Selection */}
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
                                                        <input type="checkbox" checked={serviceType === "pickup"} readOnly className="absolute top-8 right-8 w-6 h-6 accent-primary" />
                                                    </div>

                                                    <div
                                                        onClick={() => setServiceType("instore")}
                                                        className={cn(
                                                            "rounded-xl border-2 p-8 flex items-center justify-between transition-all cursor-pointer group",
                                                            serviceType === "instore" ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📍</div>
                                                            <div>
                                                                <h4 className="font-medium text-gray-900 text-xl">In-Store Drop-off</h4>
                                                                <p className="text-xs text-gray-400">Visit our nearest service center</p>
                                                            </div>
                                                        </div>
                                                        <div className={cn(
                                                            "w-6 h-6 rounded-full border-2 transition-colors",
                                                            serviceType === "instore" ? "border-primary bg-primary" : "border-gray-200 group-hover:border-primary"
                                                        )} />
                                                    </div>
                                                </div>

                                                {/* Pickup Form */}
                                                <div className="bg-gray-50/50 rounded-lg p-8 border border-gray-100 space-y-6">
                                                    <h3 className="text-xl font-medium text-gray-900">Pickup Address</h3>
                                                    <input
                                                        type="text"
                                                        placeholder="123 Innovation Drive, Tech Valley"
                                                        className="w-full bg-white border border-gray-200 rounded-sm p-4 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                                                    />
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-medium text-gray-400 uppercase tracking-widest px-2">Date</label>
                                                            <div className="relative mt-1">
                                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                                <input type="date" className="w-full bg-white border border-gray-200 rounded-sm p-4 pl-12 text-sm font-medium" />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-medium text-gray-400 uppercase tracking-widest px-2">Time</label>
                                                            <div className="relative mt-1">
                                                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                                <select className="w-full bg-white border border-gray-200 rounded-sm p-4 pl-12 text-sm font-medium appearance-none">
                                                                    <option>10:30 Pm</option>
                                                                    <option>11:30 Pm</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-medium text-gray-400 uppercase tracking-widest px-2">Special Instructions (Optional)</label>
                                                        <textarea
                                                            placeholder="e.g. Gate code 1234, leave with front desk, etc."
                                                            className="w-full bg-white border mt-1 border-gray-200 rounded-sm p-5 text-sm font-medium focus:ring-2 focus:ring-primary outline-none h-32"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Price Breakdown Sidebar */}
                                            <div className="space-y-6">
                                                <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 space-y-8">
                                                    <h3 className="text-2xl font-medium text-gray-900">Price Breakdown</h3>
                                                    <div className="space-y-4 pt-4">
                                                        <div className="flex justify-between items-center text-gray-400 font-medium">
                                                            <span>Amount</span>
                                                            <span className="text-gray-900">$989</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-gray-400 font-medium">
                                                            <span>Shipping</span>
                                                            <span className="text-gray-900">$10</span>
                                                        </div>
                                                        <div className="h-px bg-gray-50 flex-1" />
                                                        <div className="flex justify-between items-center text-2xl font-medium text-gray-900">
                                                            <span>Total</span>
                                                            <span>$999</span>
                                                        </div>
                                                    </div>

                                                    <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-base cursor-pointer font-medium text-lg shadow-xl shadow-primary/20 transition-all">
                                                        Submit Repair Request
                                                    </Button>
                                                </div>

                                                <button onClick={prevStep} className="w-full text-center text-gray-400 font-medium hover:text-gray-900 transition-colors cursor-pointer">Go Back and Edit</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}