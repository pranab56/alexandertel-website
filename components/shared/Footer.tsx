"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import toast from "react-hot-toast";

export default function Footer() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubscribe = () => {
    if (!email) {
      setError("Email address is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    toast.success("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <footer className="w-full bg-[#f2f2f2]">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-black text-white p-10 md:p-16"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(108,99,255,0.15)_0%,transparent_60%)]" />
          {/* Animated Light Ray */}
          <motion.div
            animate={{
              opacity: [0.1, 0.2, 0.1],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-[linear-gradient(45deg,rgba(108,99,255,0.05)_0%,transparent_50%)]"
          />
        </div>

        <div className="relative container mx-auto px-5 z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Logo & About */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="inline-block h-16 w-16">
              <Image src="/icons/Logo.png" alt="Logo" width={1000} height={1000} className="w-full h-full" />
            </Link>
            <p className="text-white/60 text-lg max-w-xs leading-relaxed">
              Your trusted telecom partner in the Netherlands
            </p>
          </div>

          {/* Shop Links */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xl font-bold">Shop</h4>
            <div className="flex flex-col gap-4">
              <Link href="/shop/smartphones" className="text-white/50 hover:text-white transition-colors">Smartphones</Link>
              <Link href="/shop/accessories" className="text-white/50 hover:text-white transition-colors">Accessories</Link>
              <Link href="/shop/new-arrivals" className="text-white/50 hover:text-white transition-colors">New Arrivals</Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xl font-medium">Never Miss a Deal</h4>
            <p className="text-white/50">
              Subscribe to our newsletter and be the first to know about exclusive offers and promotions
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Typing your email address here..."
                  className="bg-white/10 border-white/10 text-white placeholder:text-white/30 h-12 rounded-sm focus:ring-primary focus:border-primary"
                />
                <Button onClick={handleSubscribe} className="bg-primary cursor-pointer hover:bg-primary/90 text-white h-12 px-8 rounded-sm shrink-0 font-medium">
                  Subscribe
                </Button>
              </div>
              {error && <p className="text-red-500 text-xs font-medium ml-1 animate-in fade-in slide-in-from-top-1">{error}</p>}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative z-10 pt-10 border-t border-white/10 text-center">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} Mission Telecom. All rights reserved.
          </p>
        </div>
      </motion.div>
    </footer>
  );
}