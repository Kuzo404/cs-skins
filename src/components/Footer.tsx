"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Crosshair } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-cs-darker border-t border-cs-border/30 mt-10 overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cs-orange/20 to-transparent" />

      {/* Subtle background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-tactical-grid bg-grid-size" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 relative">
        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
          {[
            {
              title: "Маркет",
              links: [
                { href: "/marketplace", label: "Бүх скинүүд" },
                { href: "/marketplace?category=Knife", label: "Хутганууд" },
                { href: "/marketplace?category=Gloves", label: "Бээлийнүүд" },
                { href: "/marketplace?category=Rifle", label: "Буунууд" },
              ],
            },
            {
              title: "Хэрэглэгч",
              links: [
                { href: "/profile", label: "Профайл" },
                { href: "/sell", label: "Скин зарах" },
                { href: "/wallet", label: "Хэтэвч" },
              ],
            },
            {
              title: "Тусламж",
              links: [
                { href: "#", label: "Түгээмэл асуулт" },
                { href: "#", label: "Холбоо барих" },
                { href: "#", label: "Нөхцөл" },
              ],
            },
            {
              title: "Сошиал",
              links: [
                { href: "#", label: "Discord" },
                { href: "#", label: "Telegram" },
                { href: "#", label: "Facebook" },
              ],
            },
          ].map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <h3 className="text-cs-light font-semibold text-xs mb-3 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-1.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-cs-gray text-xs hover:text-cs-orange transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-cs-border/20 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-cs-orange to-cs-yellow rounded flex items-center justify-center shadow-glow-sm">
              <Crosshair size={10} className="text-black" />
            </div>
            <span className="text-cs-gray text-[10px]">
              © 2025 SkinTrade. Бүх эрх хуулиар хамгаалагдсан.
            </span>
          </div>
          <p className="text-cs-gray/30 text-[10px] text-center sm:text-right">
            Valve Corporation эсвэл Steam-тай холбоогүй.
          </p>
        </div>
      </div>
    </footer>
  );
}
