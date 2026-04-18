"use client";

import React from "react";
import Link from "next/link";
import {
    Box,
    Wallet,
    Star,
    ChevronRight,
    Wrench
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function MyAccountOverview() {
    return (
        <div className="space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { id: 1, label: "Total Orders", value: "2", icon: Box, color: "text-blue-500" },
                    { id: 2, label: "Wallet Balance", value: "€450", icon: Wallet, color: "text-indigo-500" },
                    { id: 3, label: "Loyalty Points", value: "1250", icon: Star, color: "text-purple-500" }
                ].map((stat) => (
                    <motion.div
                        key={stat.id}
                        className="bg-white rounded-lg p-6 border border-gray-100 flex items-center gap-6"
                    >
                        <div className={cn("w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center shadow-inner", stat.color)}>
                            <stat.icon size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <div className="text-3xl font-medium text-gray-900 leading-tight">{stat.value}</div>
                            <div className="text-sm font-medium text-gray-400">{stat.label}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100">
                    <h2 className="text-2xl font-medium text-gray-900">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Items</th>
                                <th className="px-8 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { id: "MT-1234", date: "2026-04-08", items: "iPhone 15 Pro", total: "€1199" },
                                { id: "MT-1235", date: "2026-04-08", items: "iPhone 15 Pro", total: "€1199" },
                            ].map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6 text-sm font-medium text-gray-900">{order.id}</td>
                                    <td className="px-8 py-6 text-sm font-medium text-gray-500">{order.date}</td>
                                    <td className="px-8 py-6 text-sm font-medium text-gray-500">{order.items}</td>
                                    <td className="px-8 py-6 text-sm font-medium text-gray-900 text-right">{order.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Repair Requests Section */}
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-2xl font-medium text-gray-900">Repair Requests</h2>
                    <Link href="/repair" className="text-primary font-medium text-sm flex items-center gap-2 hover:underline">
                        New Repair
                        <ChevronRight size={16} />
                    </Link>
                </div>
                <div className="p-4 space-y-4">
                    {[1, 2].map((item) => (
                        <div key={item} className="flex items-center justify-between p-6 rounded-[1.5rem] bg-gray-50/50 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform">
                                    <Wrench size={24} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Samsung Galaxy S23</h4>
                                    <p className="text-xs text-gray-400 font-medium tracking-wider">Screen Damage</p>
                                    <p className="text-[10px] text-gray-400 mt-1">Requested on 2026-04-09</p>
                                </div>
                            </div>
                            <div className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-medium tracking-widest">
                                In Progress
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}