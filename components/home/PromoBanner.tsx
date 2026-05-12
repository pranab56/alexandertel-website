"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full min-h-[400px] md:min-h-[500px]  overflow-hidden flex items-center"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/home/banner/Banner.png"
            alt="Promo Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30 z-10" />
        </div>

        <div className="relative z-20 container mx-auto w-full px-10 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left Side: Content */}
          <div className="flex flex-col gap-4 text-left">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[#58A6FF] text-sm font-normal tracking-[0.2em]"
            >
              Hurry Up!
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-medium text-white leading-tight"
            >
              Pure Sound. Zero Noise.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-white/60 text-sm md:text-base"
            >
              Experience next-level audio clarity
            </motion.p>

            <Link href={"/shop"}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="pt-4"
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white rounded-sm cursor-pointer px-10 h-12 text-sm font-bold transition-transform hover:scale-105"
                >
                  Shop Now
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}