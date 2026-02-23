"use client";

import { motion, AnimatePresence } from "framer-motion";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { RARITY_LABELS } from "@/lib/constants";
import {
  ShoppingCart,
  Trash2,
  X,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Shield,
  Wallet,
} from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    clearCart,
    cartTotal,
    isLoggedIn,
    user,
    updateBalance,
  } = useApp();
  const [purchaseStep, setPurchaseStep] = useState<
    "cart" | "confirm" | "success" | "insufficient"
  >("cart");

  if (!isLoggedIn) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20">
        <div className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg max-w-md mx-auto p-6 text-center">
          <ShoppingCart size={48} className="text-cs-gray/20 mx-auto mb-4" />
          <h2 className="text-cs-light font-semibold text-lg mb-2">
            Нэвтэрнэ үү
          </h2>
          <p className="text-cs-gray text-sm mb-4">
            Сагс ашиглахын тулд Steam-ээр нэвтэрнэ үү
          </p>
          <Link href="/" className="btn-steam inline-flex">
            Steam-ээр нэвтрэх
          </Link>
        </div>
      </div>
    );
  }

  const handlePurchase = () => {
    if (user && user.balance >= cartTotal) {
      setPurchaseStep("confirm");
    } else {
      setPurchaseStep("insufficient");
    }
  };

  const confirmPurchase = () => {
    updateBalance(-cartTotal);
    clearCart();
    setPurchaseStep("success");
  };

  const getRarityBorderColor = (rarity: string) => {
    const colorMap: Record<string, string> = {
      consumer: "#b0c3d9",
      industrial: "#5e98d9",
      milspec: "#4b69ff",
      restricted: "#8847ff",
      classified: "#d32ce6",
      covert: "#eb4b4b",
      gold: "#e4ae39",
    };
    return colorMap[rarity] || "#1e1e2e";
  };

  // Success screen
  if (purchaseStep === "success") {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20">
        <div className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg max-w-md mx-auto p-6 text-center">
          <CheckCircle2 size={64} className="text-green-400 mx-auto mb-4" />
          <h2 className="text-cs-light font-bold text-xl mb-2">
            Худалдан авалт амжилттай!
          </h2>
          <p className="text-cs-gray mb-6">
            Скинүүд таны Steam инвентар руу шилжүүлэгдэх болно. Хүлээх хугацаа
            2-5 минут.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/marketplace" className="btn-primary">
              Маркет руу буцах
            </Link>
            <Link href="/profile" className="btn-secondary">
              Профайл харах
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20">
        <div className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg max-w-md mx-auto p-6 text-center">
          <ShoppingCart size={48} className="text-cs-gray/20 mx-auto mb-4" />
          <h2 className="text-cs-light font-semibold text-lg mb-2">
            Сагс хоосон байна
          </h2>
          <p className="text-cs-gray text-sm mb-6">
            Маркетаас скинүүд сонгож сагсанд нэмнэ үү
          </p>
          <Link href="/marketplace" className="btn-primary inline-flex">
            Маркет руу очих
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-cs-light">Сагс</h1>
          <p className="text-cs-gray mt-1">
            {cart.length} скин сагсанд байна
          </p>
        </div>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-red-400 text-sm hover:underline flex items-center gap-1"
          >
            <Trash2 size={14} />
            Бүгдийг устгах
          </button>
        )}
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart Items */}
        <div className="flex-1 space-y-3">
          <AnimatePresence>
          {cart.map((item, index) => {
            const { skin } = item;
            return (
              <motion.div
                key={skin.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
                className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg p-4 flex items-center gap-4"
              >
                {/* Rarity indicator */}
                <div
                  className="w-1 h-16 rounded-full shrink-0"
                  style={{
                    backgroundColor: getRarityBorderColor(skin.rarity),
                  }}
                />

                {/* Image placeholder */}
                <div
                  className="w-20 h-16 rounded-lg shrink-0 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${getRarityBorderColor(
                      skin.rarity
                    )}22, ${getRarityBorderColor(skin.rarity)}44)`,
                  }}
                >
                  <span className="text-cs-light/40 text-[10px]">
                    {skin.weapon}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/skin/${skin.id}`}
                    className="text-cs-light font-medium text-sm hover:text-cs-orange transition-all duration-300"
                  >
                    {skin.weapon} | {skin.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-cs-gray text-xs">{skin.wear}</span>
                    <span className="text-cs-gray text-xs">•</span>
                    <span className="text-cs-gray text-xs">
                      Float: {skin.float.toFixed(4)}
                    </span>
                    {skin.stattrak && (
                      <>
                        <span className="text-cs-gray text-xs">•</span>
                        <span className="text-cs-orange text-xs font-medium">
                          StatTrak™
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-cs-gray text-xs mt-1">
                    Зарагч: {skin.sellerName}
                  </p>
                </div>

                {/* Price & Remove */}
                <div className="text-right shrink-0">
                  <p className="text-cs-orange font-bold text-lg">
                    ${skin.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(skin.id)}
                    className="text-cs-gray hover:text-red-400 text-xs mt-1 flex items-center gap-1 ml-auto transition-all duration-300"
                  >
                    <X size={12} />
                    Устгах
                  </button>
                </div>
              </motion.div>
            );
          })}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full lg:w-80 shrink-0"
        >
          <div className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg sticky top-24">
            <div className="px-4 py-3 border-b border-cs-border/50">
              <h3 className="text-cs-light font-semibold">Захиалгын мэдээлэл</h3>
            </div>

            <div className="p-4 space-y-4">
              {/* items breakdown */}
              <div className="space-y-2">
                {cart.map((item) => (
                  <div
                    key={item.skin.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-cs-gray text-sm truncate mr-4">
                      {item.skin.weapon} | {item.skin.name}
                    </span>
                    <span className="text-cs-light text-sm shrink-0">
                      ${item.skin.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-cs-border pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-cs-light font-semibold">Нийт дүн</span>
                    <span className="text-cs-orange text-lg font-bold">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>

                {/* Wallet balance */}
                <div className="bg-cs-darker rounded-lg px-4 py-3 mb-4 flex items-center justify-between">
                  <span className="text-cs-gray text-sm flex items-center gap-2">
                    <Wallet size={14} />
                    Хэтэвч үлдэгдэл
                  </span>
                  <span
                    className={`font-medium text-sm ${
                      user!.balance >= cartTotal
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    ${user!.balance.toFixed(2)}
                  </span>
                </div>

                {/* Insufficient funds warning */}
                {(purchaseStep === "insufficient" ||
                  user!.balance < cartTotal) && (
                  <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-3 mb-4 flex gap-2">
                    <AlertCircle
                      size={16}
                      className="text-red-400 shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-red-400 text-sm font-medium">
                        Үлдэгдэл хүрэлцэхгүй байна
                      </p>
                      <p className="text-cs-gray text-xs mt-1">
                        Дутуу дүн: $
                        {(cartTotal - user!.balance).toFixed(2)}
                      </p>
                      <Link
                        href="/wallet"
                        className="text-cs-orange text-xs hover:underline mt-1 inline-block"
                      >
                        Хэтэвч цэнэглэх →
                      </Link>
                    </div>
                  </div>
                )}

                {/* Confirm modal */}
                {purchaseStep === "confirm" && (
                  <div className="bg-cs-orange/5 border border-cs-orange/20 rounded-lg p-4 mb-4">
                    <p className="text-cs-light text-sm font-medium mb-3">
                      Та ${cartTotal.toFixed(2)}-ээр {cart.length} скин худалдаж
                      авахдаа итгэлтэй байна уу?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={confirmPurchase}
                        className="btn-primary flex-1 text-sm py-2"
                      >
                        Тийм, авах
                      </button>
                      <button
                        onClick={() => setPurchaseStep("cart")}
                        className="btn-secondary flex-1 text-sm py-2"
                      >
                        Болих
                      </button>
                    </div>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handlePurchase}
                  disabled={purchaseStep === "confirm"}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CreditCard size={18} />
                  Худалдаж авах
                </motion.button>

                <div className="flex items-center gap-2 justify-center mt-3">
                  <Shield size={12} className="text-green-400" />
                  <span className="text-cs-gray text-xs">
                    Аюулгүй худалдан авалт
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
