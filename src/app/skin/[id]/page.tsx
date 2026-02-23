"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { RARITY_LABELS, RARITY_COLORS } from "@/lib/constants";
import { skinsAPI } from "@/lib/api";
import { Skin } from "@/types";
import {
  ArrowLeft,
  ShoppingCart,
  Shield,
  Clock,
  Tag,
  User,
  ExternalLink,
  CheckCircle2,
  Info,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import SkinCard from "@/components/SkinCard";

export default function SkinDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, cart, isLoggedIn, user } = useApp();
  const [skin, setSkin] = useState<Skin | null>(null);
  const [similarSkins, setSimilarSkins] = useState<Skin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    setLoading(true);
    skinsAPI.get(params.id as string)
      .then((data) => {
        setSkin(data);
        // Fetch similar skins
        skinsAPI.list({ category: data.category, limit: 5 })
          .then((res) => {
            setSimilarSkins((res.skins || []).filter((s: Skin) => s.id !== data.id).slice(0, 4));
          })
          .catch(() => setSimilarSkins([]));
      })
      .catch(() => setSkin(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20 flex justify-center">
        <Loader2 size={32} className="text-cs-orange animate-spin" />
      </div>
    );
  }

  if (!skin) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg max-w-md mx-auto p-4 text-center">
          <h2 className="text-cs-light font-semibold text-lg mb-2">
            Скин олдсонгүй
          </h2>
          <p className="text-cs-gray text-sm mb-4">
            Энэ скин устгагдсан эсвэл зарагдсан байж болзошгүй
          </p>
          <Link href="/marketplace" className="btn-primary inline-flex">
            Маркет руу буцах
          </Link>
        </div>
      </div>
    );
  }

  const isInCart = cart.some((item) => item.skin.id === skin.id);
  const isOwnSkin = user?.id === skin.sellerId;
  const rarityColor = RARITY_COLORS[skin.rarity] || "";

  const getRarityBorderColor = () => {
    const colorMap: Record<string, string> = {
      consumer: "#b0c3d9",
      industrial: "#5e98d9",
      milspec: "#4b69ff",
      restricted: "#8847ff",
      classified: "#d32ce6",
      covert: "#eb4b4b",
      gold: "#e4ae39",
    };
    return colorMap[skin.rarity] || "#1e1e2e";
  };

  const floatPercentage = skin.float * 100;
  const getFloatPosition = () => {
    // Translate float to a visual position
    return `${Math.min(skin.float * 100, 100)}%`;
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-cs-gray hover:text-cs-light text-sm mb-6 transition-all duration-300"
      >
        <ArrowLeft size={16} />
        Буцах
      </button>

      <div className="grid lg:grid-cols-2 gap-8 mb-16">
        {/* Left - Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg overflow-hidden"
        >
          {/* Rarity bar */}
          <div
            className="h-1.5 w-full"
            style={{ backgroundColor: getRarityBorderColor() }}
          />

          <div className="p-4 sm:p-6">
            <div className="aspect-square bg-gradient-to-b from-cs-border/20 to-transparent rounded-lg flex items-center justify-center relative">
              <div
                className="w-3/4 h-3/4 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${getRarityBorderColor()}15, ${getRarityBorderColor()}35)`,
                }}
              />
              <span className="absolute text-cs-light/40 text-lg font-medium">
                {skin.weapon} | {skin.name}
              </span>

              {/* StatTrak badge */}
              {skin.stattrak && (
                <div className="absolute top-4 left-4 bg-cs-orange text-black text-xs font-bold px-3 py-1 rounded-lg">
                  StatTrak™
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right - Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="space-y-6"
        >
          {/* Title */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`badge ${rarityColor.split(" ")[0]} bg-opacity-10 border`}
                style={{
                  borderColor: getRarityBorderColor(),
                  backgroundColor: `${getRarityBorderColor()}15`,
                  color: getRarityBorderColor(),
                }}
              >
                {RARITY_LABELS[skin.rarity]}
              </span>
              {skin.stattrak && (
                <span className="badge bg-cs-orange/10 text-cs-orange border border-cs-orange/30">
                  StatTrak™
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-cs-light mb-1">
              {skin.weapon} | {skin.name}
            </h1>
            <p className="text-cs-gray">{skin.wear}</p>
          </div>

          {/* Price */}
          <div className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-cs-gray text-sm">Үнэ</span>
              <span className="text-xl font-bold text-cs-orange">
                ${skin.price.toFixed(2)}
              </span>
            </div>

            {isLoggedIn && !isOwnSkin ? (
              <div className="flex gap-3">
                <button
                  onClick={() => !isInCart && addToCart(skin)}
                  disabled={isInCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
                    isInCart
                      ? "bg-cs-green/10 text-cs-green border border-cs-green/30"
                      : "btn-primary"
                  }`}
                >
                  {isInCart ? (
                    <>
                      <CheckCircle2 size={18} />
                      Сагсанд нэмсэн
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      Сагсанд нэмэх
                    </>
                  )}
                </button>
                {!isInCart && (
                  <button
                    onClick={() => {
                      addToCart(skin);
                      router.push("/cart");
                    }}
                    className="btn-secondary"
                  >
                    Шууд авах
                  </button>
                )}
              </div>
            ) : isOwnSkin ? (
              <div className="bg-cs-blue/10 border border-cs-blue/20 rounded-lg p-3 flex items-center gap-2">
                <Info size={16} className="text-cs-blue" />
                <span className="text-cs-gray text-sm">
                  Энэ бол таны скин
                </span>
              </div>
            ) : (
              <Link
                href="/"
                className="btn-steam w-full justify-center"
              >
                Худалдаж авахын тулд нэвтрэх
              </Link>
            )}
          </div>

          {/* Float Bar */}
          <div className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg p-4">
            <h3 className="text-cs-light font-semibold text-sm mb-4">
              Float Value
            </h3>
            <div className="relative mb-3">
              <div className="h-3 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500 opacity-40" />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-cs-dark"
                style={{ left: getFloatPosition() }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-cs-gray mb-4">
              <span>FN</span>
              <span>MW</span>
              <span>FT</span>
              <span>WW</span>
              <span>BS</span>
            </div>
            <div className="bg-cs-darker rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-cs-gray text-sm">Float</span>
              <span className="text-cs-light font-mono font-medium">
                {skin.float.toFixed(10)}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg p-4">
            <h3 className="text-cs-light font-semibold text-sm mb-4">
              Дэлгэрэнгүй
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-cs-border/30">
                <span className="text-cs-gray text-sm flex items-center gap-2">
                  <Tag size={14} />
                  Төрөл
                </span>
                <span className="text-cs-light text-sm">{skin.category}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-cs-border/30">
                <span className="text-cs-gray text-sm flex items-center gap-2">
                  <Shield size={14} />
                  Элэгдэл
                </span>
                <span className="text-cs-light text-sm">{skin.wear}</span>
              </div>
              {skin.collection && (
                <div className="flex items-center justify-between py-2 border-b border-cs-border/30">
                  <span className="text-cs-gray text-sm flex items-center gap-2">
                    <Tag size={14} />
                    Цуглуулга
                  </span>
                  <span className="text-cs-light text-sm">{skin.collection}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2 border-b border-cs-border/30">
                <span className="text-cs-gray text-sm flex items-center gap-2">
                  <Clock size={14} />
                  Байршуулсан
                </span>
                <span className="text-cs-light text-sm">
                  {new Date(skin.listedAt).toLocaleDateString("mn-MN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-cs-gray text-sm flex items-center gap-2">
                  <User size={14} />
                  Зарагч
                </span>
                <span className="text-cs-light text-sm flex items-center gap-2">
                  {skin.sellerName}
                  <ExternalLink size={12} className="text-cs-gray" />
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Similar Skins */}
      {similarSkins.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-lg font-bold text-cs-light mb-6">
            Төстэй скинүүд
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similarSkins.map((s, i) => (
              <SkinCard key={s.id} skin={s} index={i} />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
