"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MyRepairsPage() {
    return (
        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm min-h-[500px] flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Recent Repairs</h2>
            <p className="text-gray-400 max-w-sm mb-8">
                View the status of your current repair requests or start a new one.
            </p>
            <Link href="/repair">
                <Button className="rounded-xl px-10 h-14 font-bold shadow-lg shadow-primary/20">
                    Book a New Repair
                </Button>
            </Link>
        </div>
    );
}
