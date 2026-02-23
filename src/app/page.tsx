"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SkinCard from "@/components/SkinCard";
import DustParticles from "@/components/DustParticles";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/MotionElements";
import { skinsAPI } from "@/lib/api";
import { Skin } from "@/types";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Shield,
  Zap,
  Users,
  TrendingUp,
  Crosshair,
  Target,
  Swords,
} from "lucide-react";

export default function HomePage() {
  const { isLoggedIn, login } = useApp();
  const [allSkins, setAllSkins] = useState<Skin[]>([]);

  useEffect(() => {
    skinsAPI.list({ limit: 20, sort: "newest" })
      .then((data) => setAllSkins(data.skins || []))
      .catch(() => setAllSkins([]));
  }, []);

  const featuredSkins = allSkins.filter(
    (s) => s.rarity === "gold" || s.price > 1000
  ).slice(0, 4);

  const newSkins = allSkins.slice(0, 8);

  const popularSkins = [...allSkins]
    .sort((a, b) => b.price - a.price)
    .slice(0, 8);

  return (
    <div className="overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cs-orange/5 rounded-full blur-[150px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cs-muzzle/5 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cs-olive/5 rounded-full blur-[200px]" />
        </div>

        {/* Tactical grid */}
        <div className="absolute inset-0 bg-tactical-grid bg-grid-size opacity-[0.04]" />

        {/* Dust particles */}
        <DustParticles count={40} />

        {/* Scan line effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cs-orange/10 to-transparent"
            animate={{ y: ["0vh", "70vh"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-4 py-20 sm:py-28 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tactical badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cs-card/60 border border-cs-border/50 backdrop-blur-sm mb-6"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-cs-green animate-pulse" />
              <span className="text-cs-gray text-xs font-medium tracking-wide">ХАМГИЙН АЮУЛГҮЙ МАРКЕТ</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-black text-cs-light mb-5 leading-[1.1] tracking-tight"
            >
              CS2 СКИН{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cs-orange via-cs-yellow to-cs-sand text-glow">
                  МАРКЕТ
                </span>
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-cs-orange to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  style={{ transformOrigin: "left" }}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-cs-gray text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed"
            >
              Steam скинүүдээ аюулгүй, хурдан худалдаж аваарай.
              <br className="hidden sm:block" />
              Хамгийн сайн үнэ, шууд шилжүүлэг.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center justify-center gap-4"
            >
              <Link href="/marketplace">
                <motion.span
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(232, 169, 36, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3"
                >
                  <Crosshair size={18} />
                  Маркет үзэх
                  <ArrowRight size={16} />
                </motion.span>
              </Link>
              {!isLoggedIn && (
                <motion.button
                  onClick={login}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-steam px-6 py-3 text-sm"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.04 2 11.04c0 2.97 1.52 5.6 3.86 7.24l2.14-3.02A4.5 4.5 0 0 1 7.5 11.5C7.5 9.29 9.29 7.5 11.5 7.5S15.5 9.29 15.5 11.5 13.71 15.5 11.5 15.5c-.56 0-1.09-.1-1.58-.29l-2.14 3.02C9.14 19.3 10.53 20 12 20c5.52 0 10-4.04 10-9.04S17.52 2 12 2z" />
                  </svg>
                  Steam нэвтрэх
                </motion.button>
              )}
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cs-bg to-transparent" />
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="relative border-y border-cs-border/30 bg-cs-card/20 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-cs-orange/[0.02] via-transparent to-cs-muzzle/[0.02]" />
        <div className="max-w-[1400px] mx-auto px-4 py-6 relative">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Нийт скин", value: "12,450+", icon: TrendingUp, color: "text-cs-orange" },
              { label: "Хэрэглэгч", value: "8,200+", icon: Users, color: "text-cs-sand" },
              { label: "Арилжаа", value: "45,000+", icon: Shield, color: "text-cs-olive" },
              { label: "Шилжүүлэг", value: "< 2 мин", icon: Zap, color: "text-cs-muzzle" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <StaggerItem key={i}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-3 justify-center p-3 rounded-lg hover:bg-cs-card/50 transition-all duration-300 cursor-default"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-cs-card/80 border border-cs-border/30 flex items-center justify-center ${stat.color}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-cs-light font-bold text-lg leading-tight">{stat.value}</p>
                      <p className="text-cs-gray text-xs">{stat.label}</p>
                    </div>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== FEATURED SKINS ===== */}
      <section className="max-w-[1400px] mx-auto px-4 py-12">
        <FadeInUp>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-cs-orange to-cs-muzzle rounded-full" />
              <h2 className="text-xl font-bold text-cs-light">Онцлох скинүүд</h2>
            </div>
            <Link
              href="/marketplace"
              className="group flex items-center gap-1 text-cs-orange hover:text-cs-yellow text-xs font-medium transition-all duration-300"
            >
              Бүгдийг харах
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </FadeInUp>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {featuredSkins.map((skin, i) => (
            <SkinCard key={skin.id} skin={skin} index={i} />
          ))}
        </div>
      </section>

      {/* ===== NEW LISTINGS ===== */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-cs-bg via-cs-darker/50 to-cs-bg" />
        <div className="absolute inset-0 bg-tactical-grid bg-grid-size opacity-[0.02]" />
        <div className="max-w-[1400px] mx-auto px-4 py-12 relative">
          <FadeInUp>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-cs-green to-cs-olive rounded-full" />
                <h2 className="text-xl font-bold text-cs-light">Шинэ нэмэгдсэн</h2>
              </div>
              <Link
                href="/marketplace?sort=newest"
                className="group flex items-center gap-1 text-cs-orange hover:text-cs-yellow text-xs font-medium transition-all duration-300"
              >
                Бүгдийг харах
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeInUp>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {newSkins.map((skin, i) => (
              <SkinCard key={skin.id} skin={skin} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== POPULAR / EXPENSIVE ===== */}
      <section className="max-w-[1400px] mx-auto px-4 py-12">
        <FadeInUp>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-cs-red to-cs-rust rounded-full" />
              <h2 className="text-xl font-bold text-cs-light">Хамгийн үнэтэй</h2>
            </div>
            <Link
              href="/marketplace?sort=price_desc"
              className="group flex items-center gap-1 text-cs-orange hover:text-cs-yellow text-xs font-medium transition-all duration-300"
            >
              Бүгдийг харах
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </FadeInUp>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {popularSkins.map((skin, i) => (
            <SkinCard key={skin.id} skin={skin} index={i} />
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative border-y border-cs-border/20 overflow-hidden">
        <div className="absolute inset-0 bg-cs-card/10" />
        <div className="absolute inset-0 bg-tactical-grid bg-grid-size opacity-[0.03]" />
        <DustParticles count={15} />

        <div className="max-w-[1400px] mx-auto px-4 py-14 relative">
          <FadeInUp>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-cs-light">
                Хэрхэн ажилладаг вэ?
              </h2>
              <p className="text-cs-gray text-sm mt-2">3 энгийн алхамаар скин худалдаагаа эхлүүлээрэй</p>
            </div>
          </FadeInUp>
          <StaggerContainer className="grid md:grid-cols-3 gap-5">
            {[
              {
                step: "01",
                title: "Steam холбох",
                desc: "Steam аккаунтаа холбож нэвтрэх.",
                icon: Target,
                color: "from-cs-orange/20 to-cs-orange/5",
                borderColor: "border-cs-orange/20",
              },
              {
                step: "02",
                title: "Скин сонгох / Зарах",
                desc: "Маркетаас скин авах эсвэл өөрийнхөө скинүүдийг зарах.",
                icon: Swords,
                color: "from-cs-olive/20 to-cs-olive/5",
                borderColor: "border-cs-olive/20",
              },
              {
                step: "03",
                title: "Шууд шилжүүлэг",
                desc: "Мөнгө болон скин шууд аюулгүй шилжинэ.",
                icon: Shield,
                color: "from-cs-muzzle/20 to-cs-muzzle/5",
                borderColor: "border-cs-muzzle/20",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <StaggerItem key={i}>
                  <motion.div
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className={`bg-cs-card/60 backdrop-blur-sm border ${item.borderColor} rounded-xl p-6 text-center relative overflow-hidden group`}
                  >
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-b ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <div className="relative z-10">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="w-12 h-12 rounded-xl bg-cs-darker/80 border border-cs-border/30 flex items-center justify-center mx-auto mb-4"
                      >
                        <Icon size={22} className="text-cs-orange" />
                      </motion.div>
                      <div className="text-cs-orange font-bold text-[10px] tracking-widest uppercase mb-2">
                        АЛХАМ {item.step}
                      </div>
                      <h3 className="text-cs-light font-semibold text-sm mb-2">
                        {item.title}
                      </h3>
                      <p className="text-cs-gray text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="max-w-[1400px] mx-auto px-4 py-14">
        <FadeInUp>
          <motion.div
            whileHover={{ boxShadow: "0 0 40px rgba(232, 169, 36, 0.1)" }}
            className="relative bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-2xl p-8 sm:p-12 text-center overflow-hidden"
          >
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cs-orange/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cs-muzzle/5 rounded-full blur-[80px]" />
            <div className="absolute inset-0 bg-tactical-grid bg-grid-size opacity-[0.02]" />

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cs-orange/20 to-cs-muzzle/20 border border-cs-orange/20 flex items-center justify-center mx-auto mb-5"
              >
                <Crosshair size={24} className="text-cs-orange" />
              </motion.div>
              <h2 className="text-2xl sm:text-3xl font-bold text-cs-light mb-3">
                Скин худалдаагаа эхлүүлээрэй
              </h2>
              <p className="text-cs-gray text-sm mb-7 max-w-md mx-auto">
                CS2-ийн хамгийн том скин маркетад нэгдээрэй. Аюулгүй, хурдан, хямд.
              </p>
              {!isLoggedIn ? (
                <motion.button
                  onClick={login}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3"
                >
                  Одоо эхлэх <ArrowRight size={16} />
                </motion.button>
              ) : (
                <Link href="/marketplace">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3"
                  >
                    Маркет үзэх <ArrowRight size={16} />
                  </motion.span>
                </Link>
              )}
            </div>
          </motion.div>
        </FadeInUp>
      </section>
    </div>
  );
}
