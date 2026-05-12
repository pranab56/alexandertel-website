"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X, LogOut, UserCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { removeAuthCookie } from "@/app/actions/auth";
import toast from "react-hot-toast";
import { useMyAllProductQuery } from "@/features/shop/cartApi";
import { useGetAllProductQuery } from "@/features/shop/shopApi";
import { imageBaseURL } from "@/utils/BaseURL";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  // Search API Call
  const { data: searchData, isLoading: isSearchLoading } = useGetAllProductQuery({
    searchTerm: searchTerm,
  }, { skip: !searchTerm || !isSearchOpen });

  const searchResults = searchData?.data || [];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsProfileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await removeAuthCookie();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const { data: cartData } = useMyAllProductQuery({});
  const cartCount = cartData?.data?.items?.length || 0;

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
            <Image src="/icons/Logo.png" alt="Logo" width={100} height={100} className="w-full h-full" />
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
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown Custom implementation */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="text-white cursor-pointer hover:text-primary transition-colors outline-none"
              >
                <User size={20} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-46 bg-black/80 backdrop-blur-3xl border border-white/10 text-white rounded-lg p-2 shadow-2xl overflow-hidden"
                  >
                    <div className="space-y-1">
                      <Link
                        href="/my-account"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg transition-all cursor-pointer group"
                      >
                        <UserCircle size={18} className="text-white/60 group-hover:text-primary transition-colors" />
                        <span className="text-sm font-medium">My Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-lg transition-all cursor-pointer group"
                      >
                        <LogOut size={18} className="text-red-400/60 group-hover:text-red-400" />
                        <span className="text-sm font-medium">Log Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
              onClick={() => {
                setIsSearchOpen(false);
                setSearchTerm("");
              }}
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-white/5 border-b-2 border-white/10 py-8 pl-20 pr-16 text-3xl font-normal text-white outline-none focus:border-primary transition-colors"
                />
                {isSearchLoading && (
                  <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 text-primary animate-spin" size={32} />
                )}
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {searchTerm && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-4 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden max-h-[60vh] overflow-y-auto"
                  >
                    {searchResults.length > 0 ? (
                      <div className="divide-y divide-white/5">
                        {searchResults.map((product: any) => (
                          <Link
                            key={product._id}
                            href={`/shop/${product._id}`}
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchTerm("");
                            }}
                            className="flex items-center gap-6 p-4 hover:bg-white/5 transition-all group"
                          >
                            <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center p-2 shrink-0">
                              <Image
                                src={product.image ? (product.image.startsWith('http') ? product.image : imageBaseURL + product.image) : "/images/placeholder.jpg"}
                                alt={product.name}
                                width={80}
                                height={80}
                                className="object-contain"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xl font-medium text-white group-hover:text-primary transition-colors line-clamp-1">
                                {product.name}
                              </h4>
                              <p className="text-white/40 text-sm line-clamp-1">{product.description}</p>
                            </div>
                            <div className="text-2xl font-bold text-primary shrink-0">
                              €{product.basePrice}
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : !isSearchLoading ? (
                      <div className="p-10 text-center text-white/40 text-xl font-medium">
                        No products found for &quot;{searchTerm}&quot;
                      </div>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}