"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Repair", href: "/repair" },
  { name: "Offers", href: "/offers" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-300  py-4",
          isScrolled ? "bg-black/20 backdrop-blur-xl" : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-2 md:px-5 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group h-16 w-16">
            <Image src="/icons/Logo.png" alt="Logo" width={1000} height={1000} className="w-full h-full" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "transition-colors text-sm font-medium relative group",
                    isActive ? "text-white" : "text-white/60 hover:text-white"
                  )}
                >
                  {link.name}
                  <span className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all",
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-white cursor-pointer  hover:text-primary transition-colors"
            >
              <Search size={20} />
            </button>
            <Link href="/cart" className="relative group text-white cursor-pointer hover:text-primary transition-colors">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </Link>
            <Link href="/my-account" className="text-white cursor-pointer  hover:text-primary transition-colors">
              <User size={20} />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-white cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-2xl overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "text-lg font-medium transition-colors",
                        isActive ? "text-primary" : "text-white/80 hover:text-white"
                      )}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/10 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-10 right-10 text-white hover:text-primary transition-colors cursor-pointer"
            >
              <X size={40} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl"
            >
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={32} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-white/5 border-b-2 border-white/10 py-8 pl-20 pr-6 text-3xl font-normal text-white outline-none focus:border-primary transition-colors"
                />
              </div>
              <p className="mt-6 text-white/40 text-lg">Hit enter to search or ESC to close</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}