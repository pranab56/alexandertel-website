"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function TopLoader() {
    const controls = useAnimation();
    const pathname = usePathname();

    useEffect(() => {
        let isMounted = true;

        const startLoading = async () => {
            // Start from 0%
            await controls.start({
                width: "0%",
                opacity: 1,
                transition: { duration: 0 },
            });

            // Animate to 80% (slow realistic progress)
            controls.start({
                width: "80%",
                transition: {
                    duration: 0.8,
                    ease: "easeInOut",
                },
            });

            // Small delay then complete
            setTimeout(() => {
                if (!isMounted) return;

                controls.start({
                    width: "100%",
                    transition: {
                        duration: 0.4,
                        ease: "easeOut",
                    },
                });

                // Fade out after complete
                setTimeout(() => {
                    controls.start({
                        opacity: 0,
                        transition: { duration: 0.3 },
                    });
                }, 300);
            }, 500);
        };

        startLoading();

        return () => {
            isMounted = false;
        };
    }, [pathname, controls]);

    return (
        <motion.div
            initial={{ width: "0%", opacity: 0 }}
            animate={controls}
            className="fixed top-0 left-0 h-[3px] z-[9999] bg-blue-500"
            style={{
                boxShadow: "0 0 10px rgba(59,130,246,0.7)",
            }}
        />
    );
}