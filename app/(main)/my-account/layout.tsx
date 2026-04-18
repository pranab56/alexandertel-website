"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Wrench,
    Settings,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/my-account" },
    { id: "orders", label: "Orders", icon: ShoppingBag, href: "/my-account/orders" },
    { id: "repairs", label: "Repairs", icon: Wrench, href: "/my-account/repairs" },
    { id: "settings", label: "Settings", icon: Settings, href: "/my-account/settings" },
];

export default function MyAccountLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-[#F3F4F6] pb-24">
            {/* Header / Hero Section */}
            <section className="relative h-[350px] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/home/hero/image1.jpg"
                        alt="Account Header"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-blue-900/60 z-10" />
                </div>

                <div className="container mx-auto px-6 relative z-20 text-white">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-5xl font-extrabold tracking-tight">My Account</h1>
                        <p className="text-xl text-white/70">
                            Welcome back, John!
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-6 mt-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Container */}
                    <div className="w-full lg:w-[320px] shrink-0">
                        <div className="bg-white rounded-xl p-4 border border-gray-100 flex flex-col items-center text-center">
                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg shadow-blue-500/30">
                                JD
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">John Doe</h3>
                            <p className="text-gray-400 text-sm font-medium mb-10">john@example.com</p>

                            {/* Navigation Menu */}
                            <div className="w-full space-y-2">
                                {menuItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.id}
                                            href={item.href}
                                            className={cn(
                                                "w-full flex items-center gap-4 px-6 py-4 rounded-lg font-medium text-sm transition-all group",
                                                isActive
                                                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                                                    : "text-gray-400 hover:text-gray-900 hover:bg-gray-50 border border-transparent"
                                            )}
                                        >
                                            <item.icon size={20} className={cn(
                                                "transition-transform",
                                                isActive ? "scale-110" : "group-hover:scale-110"
                                            )} />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                                <div className="h-px bg-gray-100 w-full my-6" />
                                <button className="w-full flex items-center gap-4 px-6 py-4 rounded-lg font-medium text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer group">
                                    <LogOut size={20} />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area (Children) */}
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
