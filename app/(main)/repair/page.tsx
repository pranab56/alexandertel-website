"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ChevronRight,
    CheckCircle2,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useGetAllMyProductQuery, useGetAllServicesQuery, useCreateRepairMutation } from "@/features/repair/repairApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Import separated components
import { Devices } from "@/components/repair/Devices";
import { Services } from "@/components/repair/Services";
import { Issue } from "@/components/repair/Issue";
import CustomLoading from "@/components/ui/CustomLoading";

// --- Sub-components (Keep indicator here or move if needed) ---
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
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [serviceType, setServiceType] = useState<"pickup" | "self">("pickup");
    
    const [formData, setFormData] = useState({
        pickupDate: "",
        timeSlot: "10:00-12:00",
        address: "",
        description: ""
    });

    const [isMounted, setIsMounted] = useState(false);

    // Persist step and data on reload
    useEffect(() => {
        setIsMounted(true);
        const savedData = localStorage.getItem("repair-steps-data");
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.step) setStep(parsed.step);
                if (parsed.selectedDevice) setSelectedDevice(parsed.selectedDevice);
                if (parsed.selectedServices) setSelectedServices(parsed.selectedServices);
                if (parsed.serviceType) setServiceType(parsed.serviceType);
                if (parsed.formData) setFormData(parsed.formData);
            } catch (error) {
                console.error("Error parsing saved repair data", error);
            }
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            const dataToSave = {
                step,
                selectedDevice,
                selectedServices,
                serviceType,
                formData
            };
            localStorage.setItem("repair-steps-data", JSON.stringify(dataToSave));
        }
    }, [step, selectedDevice, selectedServices, serviceType, formData, isMounted]);

    // API Queries
    const { data: myProductsResponse , isLoading: isLoadingMyProducts } = useGetAllMyProductQuery(undefined);
    const { data: servicesResponse , isLoading: isLoadingServices } = useGetAllServicesQuery(undefined);
    const [createRepair, { isLoading: isSubmitting }] = useCreateRepairMutation();

    const myProducts = myProductsResponse?.data || [];
    const availableServices = servicesResponse?.data || [];

    const toggleService = (id: string) => {
        setSelectedServices(prev => 
            prev.includes(id) 
                ? prev.filter(s => s !== id) 
                : [...prev, id]
        );
    };

    const nextStep = () => setStep(s => Math.min(3, s + 1));
    const prevStep = () => setStep(s => Math.max(1, s - 1));

    const totalPrice = useMemo(() => {
        return availableServices
            .filter((s: any) => selectedServices.includes(s._id))
            .reduce((total: number, s: any) => total + s.price, 0);
    }, [availableServices, selectedServices]);

    const handleSubmit = async () => {
        if (!selectedDevice || selectedServices.length === 0 || !formData.address || !formData.pickupDate) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const payload = {
                product: selectedDevice,
                service: selectedServices,
                serviceType,
                ...formData
            };
            const response = await createRepair({ data: payload }).unwrap();
            if (response.success) {
                toast.success("Repair request submitted successfully!");
                localStorage.removeItem("repair-steps-data");
                router.push("/my-account");
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to submit request");
        }
    };

    if (!isMounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <CustomLoading />
            </div>
        );
    }

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
                <div className="container mx-auto">
                    <div className="bg-white/80 backdrop-blur-xl rounded-lg p-4 md:p-8 border border-white/20 mb-10">
                        <StepIndicator currentStep={step} />

                        <div className="bg-white rounded-lg p-8 border border-gray-100 shadow-sm mt-4 min-h-[500px]">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <Devices 
                                        myProducts={myProducts} 
                                        selectedDevice={selectedDevice} 
                                        setSelectedDevice={setSelectedDevice} 
                                        nextStep={nextStep} 
                                        isLoadingMyProducts={isLoadingMyProducts}
                                    />
                                )}

                                {step === 2 && (
                                    <Services 
                                        availableServices={availableServices} 
                                        selectedServices={selectedServices} 
                                        toggleService={toggleService} 
                                        nextStep={nextStep} 
                                        prevStep={prevStep} 
                                    />
                                )}

                                {step === 3 && (
                                    <Issue 
                                        serviceType={serviceType} 
                                        setServiceType={setServiceType} 
                                        formData={formData} 
                                        setFormData={setFormData} 
                                        totalPrice={totalPrice} 
                                        prevStep={prevStep} 
                                        handleSubmit={handleSubmit} 
                                        isSubmitting={isSubmitting} 
                                        selectedServices={selectedServices} 
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}