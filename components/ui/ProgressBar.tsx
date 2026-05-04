"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

type Props = {
    value: number; // target value (0–100)
};

export default function ProgressBar({ value }: Props) {
    const progress = useMotionValue(0);

    // Convert motion value → rounded number
    const rounded = useTransform(progress, (latest) =>
        Math.round(latest)
    );

    useEffect(() => {
        const controls = animate(progress, value, {
            duration: 1.2,
            ease: "easeInOut",
        });

        return controls.stop;
    }, [value, progress]);

    return (
        <div className="w-full max-w-md">
            {/* Label */}
            <div className="flex justify-between mb-2 text-sm font-medium">
                <span>Progress</span>
                <motion.span>{rounded}</motion.span>%
            </div>
            {/* Bar Background */}
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

                {/* Animated Bar */}
                <motion.div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                        width: useTransform(progress, (v) => `${v}%`),
                    }}
                />
            </div>
        </div>
    );
}