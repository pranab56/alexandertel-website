"use client";

import React from "react";
import { motion } from "framer-motion";
import { Truck, Store, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Fast Delivery",
    description: "Free shipping in Winterswijk, €5 same-day delivery nearby",
    icon: Truck,
    color: "bg-blue-100/50 text-blue-600",
  },
  {
    title: "Store Pickup",
    description: "Order online and pick up at our Winterswijk store",
    icon: Store,
    color: "bg-cyan-100/50 text-cyan-600",
  },
  {
    title: "Secure Payment",
    description: "iDEAL, Wallet, or pay in store - your choice",
    icon: ShieldCheck,
    color: "bg-purple-100/50 text-purple-600",
  },
];

export default function Features() {
  return (
    <section className="bg-[#f2f2f2] py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              {/* Icon Container */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 ${feature.color}`}>
                <feature.icon size={28} />
              </div>

              {/* Text Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed max-w-[280px]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}