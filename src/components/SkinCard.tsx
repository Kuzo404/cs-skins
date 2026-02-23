"use client";

import Link from "next/link";
import { Skin } from "@/types";
import { RARITY_LABELS } from "@/lib/constants";
import { ShoppingCart, Heart, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";

interface SkinCardProps {
  skin: Skin;
  showSeller?: boolean;
  index?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  knife: "from-red-500/80 to-red-600/80",
  gloves: "from-purple-500/80 to-purple-600/80",
  rifle: "from-blue-500/80 to-blue-600/80",
  pistol: "from-green-500/80 to-green-600/80",
  smg: "from-cyan-500/80 to-cyan-600/80",
  shotgun: "from-amber-500/80 to-amber-600/80",
  machinegun: "from-orange-500/80 to-orange-600/80",
  sniper: "from-indigo-500/80 to-indigo-600/80",
};

function getWeaponCategory(weapon: string): string {
  const w = weapon.toLowerCase();
  if (
    w.includes("karambit") || w.includes("butterfly") || w.includes("bayonet") ||
    w.includes("flip") || w.includes("knife") || w.includes("talon") ||
    w.includes("navaja") || w.includes("stiletto") || w.includes("ursus") ||
    w.includes("bowie") || w.includes("falchion") || w.includes("gut") ||
    w.includes("huntsman") || w.includes("shadow daggers") || w.includes("classic") ||
    w.includes("paracord") || w.includes("survival") || w.includes("nomad") ||
    w.includes("skeleton")
  ) return "knife";
  if (w.includes("gloves") || w.includes("wraps") || w.includes("hand")) return "gloves";
  if (w.includes("ak-47") || w.includes("m4a1") || w.includes("m4a4") || w.includes("galil") || w.includes("famas") || w.includes("sg 553") || w.includes("aug")) return "rifle";
  if (w.includes("awp") || w.includes("ssg 08") || w.includes("scar") || w.includes("g3sg1")) return "sniper";
  if (w.includes("glock") || w.includes("usp") || w.includes("desert eagle") || w.includes("five-seven") || w.includes("cz75") || w.includes("tec-9") || w.includes("p250") || w.includes("p2000") || w.includes("dual berettas") || w.includes("r8")) return "pistol";
  if (w.includes("mp9") || w.includes("mac-10") || w.includes("mp7") || w.includes("ump") || w.includes("p90") || w.includes("pp-bizon") || w.includes("mp5")) return "smg";
  if (w.includes("nova") || w.includes("xm1014") || w.includes("mag-7") || w.includes("sawed-off")) return "shotgun";
  if (w.includes("m249") || w.includes("negev")) return "machinegun";
  return "rifle";
}

function getRarityBorderColor(rarity: string): string {
  const colorMap: Record<string, string> = {
    consumer: "#b0c3d9",
    industrial: "#5e98d9",
    milspec: "#4b69ff",
    restricted: "#8847ff",
    classified: "#d32ce6",
    covert: "#eb4b4b",
    gold: "#e4ae39",
  };
  return colorMap[rarity] || "#2e2c24";
}

export default function SkinCard({ skin, index = 0 }: SkinCardProps) {
  const { addToCart, cart, isLoggedIn } = useApp();
  const isInCart = cart.some((item) => item.skin.id === skin.id);
  const category = getWeaponCategory(skin.weapon);
  const categoryColor = CATEGORY_COLORS[category] || "from-gray-500/80 to-gray-600/80";
  const rarityBorder = getRarityBorderColor(skin.rarity);

  const isNew =
    new Date().getTime() - new Date(skin.listedAt).getTime() <
    7 * 24 * 60 * 60 * 1000;

  return (
    <Link href={`/skin/${skin.id}`} className="block group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -4, transition: { duration: 0.25 } }}
        className="relative bg-cs-card/80 backdrop-blur-sm border border-cs-border/60 rounded-lg overflow-hidden transition-all duration-300 group-hover:border-opacity-100"
        style={{
          borderTopColor: rarityBorder,
          borderTopWidth: "2px",
        }}
      >
        {/* Hover glow effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${rarityBorder}12 0%, transparent 60%)`,
          }}
        />

        {/* Top row: category + badges */}
        <div className="flex items-center justify-between px-3 pt-2.5 relative z-10">
          <span className={`bg-gradient-to-r ${categoryColor} text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide`}>
            {skin.weapon}
          </span>
          <div className="flex items-center gap-1">
            {skin.stattrak && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-cs-orange to-cs-yellow text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow-glow-sm"
              >
                ST™
              </motion.span>
            )}
            {isNew && (
              <span className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <Sparkles size={8} />
                NEW
              </span>
            )}
          </div>
        </div>

        {/* Skin Image Area */}
        <div className="relative px-4 py-3">
          <div className="aspect-[4/3] flex items-center justify-center relative">
            <motion.div
              className="w-4/5 h-4/5 rounded-lg opacity-40 group-hover:opacity-70 transition-all duration-500"
              style={{
                background: `radial-gradient(ellipse at center, ${rarityBorder}30, transparent 70%)`,
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
            <span className="absolute text-cs-light/30 text-[10px] font-medium uppercase tracking-wider group-hover:text-cs-light/50 transition-colors duration-300">
              {skin.weapon} | {skin.name}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="px-3 pb-2 relative z-10">
          <h3 className="text-cs-light text-sm font-medium truncate leading-tight group-hover:text-white transition-colors duration-300">
            {skin.name}
          </h3>
          <p className="text-cs-gray text-[11px] mt-0.5">{skin.wear}</p>
        </div>

        {/* Bottom: Price + Actions */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-cs-border/30 bg-cs-darker/40 relative z-10">
          <div>
            <span className="text-[10px] text-cs-gray">Үнэ:</span>
            <span className="text-cs-light font-bold text-sm ml-1 group-hover:text-cs-orange transition-colors duration-300">
              ${skin.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
            {isLoggedIn && (
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isInCart) addToCart(skin);
                }}
                disabled={isInCart}
                className={`p-1.5 rounded transition-all duration-300 ${
                  isInCart
                    ? "text-cs-green bg-cs-green/10"
                    : "text-cs-gray hover:text-cs-orange hover:bg-cs-orange/10"
                }`}
                title={isInCart ? "Сагсанд байна" : "Сагсанд нэмэх"}
              >
                <ShoppingCart size={14} />
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="p-1.5 rounded text-cs-gray hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
              title="Хадгалах"
            >
              <Heart size={14} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
