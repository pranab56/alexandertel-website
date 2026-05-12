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
import { useGetOverviewStatsQuery } from "@/features/overview/overviewApi";
import { useGetAllMyProductQuery, useGetAllRepairQuery } from "@/features/repair/repairApi";

export default function MyAccountOverview() {
    const { data: statsResponse, isLoading: statsLoading } = useGetOverviewStatsQuery({});
    const statsData = statsResponse?.data;
    const { data: AllOrder, isLoading: orderLoading } = useGetAllMyProductQuery(undefined);
    const { data: repairResponse, isLoading: repairLoading } = useGetAllRepairQuery(undefined);

    const orders = AllOrder?.data || [];
    const repairs = repairResponse?.data || [];

    const stats = [
        {
            id: 1,
            label: "Total Orders",
            value: statsData?.totalCompletedOrders?.toString() || "0",
            icon: Box,
            color: "text-blue-500"
        },
        {
            id: 2,
            label: "Wallet Balance",
            value: `€${statsData?.totalSpent?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }) || "0"}`,
            icon: Wallet,
            color: "text-indigo-500"
        },
        {
            id: 3,
            label: "Loyalty Points",
            value: statsData?.totalRedeemPoints?.toString() || "0",
            icon: Star,
            color: "text-purple-500"
        }
    ];

    if (statsLoading || orderLoading || repairLoading) {
        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-gray-50 rounded-lg" />
                    ))}
                </div>
                <div className="h-64 bg-gray-50 rounded-lg animate-pulse" />
                <div className="h-64 bg-gray-50 rounded-lg animate-pulse" />
            </div>
        );
    }
    return (
        <div className="space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
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
                            {orders.length > 0 ? orders.map((order: any, index: number) => (
                                <tr key={order.productId || index} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6 text-sm font-medium text-gray-900">#ORD-{order.productId?.slice(-6).toUpperCase() || index}</td>
                                    <td className="px-8 py-6 text-sm font-medium text-gray-500">
                                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Recently"}
                                    </td>
                                    <td className="px-8 py-6 text-sm font-medium text-gray-500">{order.name}</td>
                                    <td className="px-8 py-6 text-sm font-medium text-gray-900 text-right">€{order.price}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-8 py-10 text-center text-sm text-gray-400 font-medium">No orders found</td>
                                </tr>
                            )}
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
                    {repairs.length > 0 ? repairs.map((repair: any) => (
                        <div key={repair._id} className="flex items-center justify-between p-6 rounded-[1.5rem] bg-gray-50/50 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform">
                                    <Wrench size={24} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">{repair.description || "Repair Service"}</h4>
                                    <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">Type: {repair.serviceType}</p>
                                    <p className="text-[10px] text-gray-400 mt-1">Requested on {new Date(repair.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className={cn(
                                "px-4 py-1.5 rounded-full text-[10px] font-medium tracking-widest uppercase",
                                repair.status === "pending" ? "bg-orange-100 text-orange-600" :
                                repair.status === "completed" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                            )}>
                                {repair.status}
                            </div>
                        </div>
                    )) : (
                        <div className="py-10 text-center text-sm text-gray-400 font-medium">No repair requests found</div>
                    )}
                </div>
            </div>
        </div>
    );
}