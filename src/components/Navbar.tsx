"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Wallet,
  User,
  Menu,
  X,
  LogOut,
  Package,
  Home,
  Store,
  ChevronDown,
  SlidersHorizontal,
  Crosshair,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, isLoggedIn, cart, login, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Нүүр", icon: Home },
    { href: "/marketplace", label: "Маркет", icon: Store },
    { href: "/sell", label: "Зарах", icon: Package },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-cs-darker/95 backdrop-blur-xl border-b border-cs-orange/10 shadow-[0_2px_30px_rgba(0,0,0,0.5)]"
          : "bg-cs-darker/80 backdrop-blur-md border-b border-cs-border/30"
      }`}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cs-orange/30 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <motion.div
                whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="relative w-8 h-8 bg-gradient-to-br from-cs-orange to-cs-yellow rounded flex items-center justify-center shadow-glow-sm"
              >
                <Crosshair size={16} className="text-black" />
                <div className="absolute inset-0 rounded bg-cs-orange/20 animate-pulse-slow" />
              </motion.div>
              <span className="text-cs-light font-bold text-base hidden sm:block tracking-tight">
                SKIN<span className="text-cs-orange text-glow">TRADE</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative px-3 py-1.5 rounded text-sm font-medium transition-all duration-300 group"
                  >
                    <span
                      className={`flex items-center gap-1.5 relative z-10 transition-colors ${
                        active
                          ? "text-cs-orange"
                          : "text-cs-gray group-hover:text-cs-light"
                      }`}
                    >
                      <Icon size={15} />
                      {link.label}
                    </span>
                    {active && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 bg-cs-orange/10 rounded border border-cs-orange/15"
                        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Center: Quick actions */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/marketplace"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cs-card/60 border border-cs-border/50 rounded text-xs text-cs-gray cursor-pointer hover:border-cs-orange/30 hover:text-cs-light transition-all duration-300 backdrop-blur-sm"
            >
              <SlidersHorizontal size={13} />
              <span>Шүүлтүүр</span>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5">
            <Link
              href="/marketplace"
              className="p-2 text-cs-gray hover:text-cs-orange rounded transition-all duration-300 hover:bg-cs-orange/5"
            >
              <Search size={18} />
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  href="/cart"
                  className="relative p-2 text-cs-gray hover:text-cs-orange rounded transition-all duration-300 hover:bg-cs-orange/5"
                >
                  <ShoppingCart size={18} />
                  <AnimatePresence>
                    {cart.length > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-cs-orange to-cs-muzzle text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-glow-sm"
                      >
                        {cart.length}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>

                <Link
                  href="/wallet"
                  className="group flex items-center gap-1.5 px-2.5 py-1.5 bg-cs-card/60 border border-cs-border/50 rounded hover:border-cs-orange/30 transition-all duration-300 ml-1 backdrop-blur-sm"
                >
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-cs-orange to-cs-yellow flex items-center justify-center shadow-glow-sm">
                    <span className="text-[8px] text-black font-bold">$</span>
                  </div>
                  <span className="text-cs-light font-semibold text-sm group-hover:text-cs-orange transition-colors">
                    {user!.balance.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </Link>

                <div className="relative ml-1">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 p-1 rounded hover:bg-cs-card/60 transition-all duration-300"
                  >
                    <div className="w-7 h-7 rounded bg-gradient-to-br from-cs-olive to-cs-military flex items-center justify-center text-cs-light text-xs font-bold border border-cs-olive/50">
                      {user!.username[0]}
                    </div>
                    <motion.div
                      animate={{ rotate: userMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={12} className="text-cs-gray hidden sm:block" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setUserMenuOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute right-0 mt-2 w-52 bg-cs-card/95 backdrop-blur-xl border border-cs-border/70 rounded-lg shadow-[0_10px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-cs-border/50 bg-gradient-to-r from-cs-olive/10 to-transparent">
                            <p className="text-cs-light font-medium text-sm">
                              {user!.username}
                            </p>
                            <p className="text-cs-gray text-xs mt-0.5">
                              Steam: {user!.steamId.slice(-8)}
                            </p>
                          </div>
                          <div className="py-1">
                            {[
                              { href: "/profile", icon: User, label: "Профайл" },
                              { href: "/wallet", icon: Wallet, label: "Хэтэвч" },
                              { href: "/sell", icon: Package, label: "Инвентар" },
                            ].map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-cs-gray hover:text-cs-orange hover:bg-cs-orange/5 transition-all duration-200"
                              >
                                <item.icon size={15} />
                                {item.label}
                              </Link>
                            ))}
                          </div>
                          <div className="border-t border-cs-border/50 py-1">
                            <button
                              onClick={() => {
                                logout();
                                setUserMenuOpen(false);
                              }}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-cs-red hover:bg-cs-red/5 transition-all duration-200 w-full"
                            >
                              <LogOut size={15} />
                              Гарах
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <motion.button
                onClick={login}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-steam"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.04 2 11.04c0 2.97 1.52 5.6 3.86 7.24l2.14-3.02A4.5 4.5 0 0 1 7.5 11.5C7.5 9.29 9.29 7.5 11.5 7.5S15.5 9.29 15.5 11.5 13.71 15.5 11.5 15.5c-.56 0-1.09-.1-1.58-.29l-2.14 3.02C9.14 19.3 10.53 20 12 20c5.52 0 10-4.04 10-9.04S17.52 2 12 2z" />
                </svg>
                <span className="hidden sm:inline">Steam нэвтрэх</span>
              </motion.button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-cs-gray hover:text-cs-light rounded transition-all duration-300"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden bg-cs-darker/95 backdrop-blur-xl border-t border-cs-border/30"
          >
            <div className="px-4 py-2 space-y-0.5">
              {navLinks.map((link, i) => {
                const Icon = link.icon;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all duration-300 ${
                        isActive(link.href)
                          ? "text-cs-orange bg-cs-orange/5 border-l-2 border-cs-orange"
                          : "text-cs-gray hover:text-cs-light hover:bg-cs-card/50"
                      }`}
                    >
                      <Icon size={16} />
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
