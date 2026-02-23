"use client";

import { motion, AnimatePresence } from "framer-motion";

import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { RARITY_LABELS, RARITY_COLORS } from "@/lib/constants";
import { inventoryAPI, skinsAPI } from "@/lib/api";
import { InventoryItem } from "@/types";
import {
  Package,
  RefreshCw,
  DollarSign,
  CheckCircle2,
  Tag,
  Info,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";

export default function SellPage() {
  const { isLoggedIn } = useApp();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [listingSuccess, setListingSuccess] = useState(false);
  const [search, setSearch] = useState("");
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loadingInventory, setLoadingInventory] = useState(false);

  const fetchInventory = async () => {
    setLoadingInventory(true);
    try {
      const items = await inventoryAPI.get();
      setInventory(items.map((item: any, idx: number) => ({
        id: item.assetId || String(idx),
        name: item.name,
        weapon: item.weapon,
        category: item.category,
        rarity: item.rarity,
        wear: item.wear,
        float: 0,
        imageUrl: item.imageUrl,
        stattrak: item.stattrak,
        tradable: item.tradable !== false,
        marketPrice: 0,
      })));
    } catch {
      setInventory([]);
    } finally {
      setLoadingInventory(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchInventory();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg max-w-md mx-auto p-4 text-center">
          <Package size={48} className="text-cs-gray/20 mx-auto mb-4" />
          <h2 className="text-cs-light font-semibold text-lg mb-2">
            Нэвтэрнэ үү
          </h2>
          <p className="text-cs-gray text-sm mb-4">
            Steam инвентараа уншуулахын тулд нэвтэрнэ үү
          </p>
          <Link href="/" className="btn-steam inline-flex">
            Steam-ээр нэвтрэх
          </Link>
        </div>
      </div>
    );
  }

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
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

  const handleListItems = async () => {
    if (selectedItems.length === 0) return;
    try {
      for (const id of selectedItems) {
        const item = inventory.find((i) => i.id === id);
        if (!item) continue;
        const price = prices[id] ? parseFloat(prices[id]) : item.marketPrice;
        await skinsAPI.create({
          name: item.name,
          weapon: item.weapon,
          category: item.category,
          rarity: item.rarity,
          wear: item.wear,
          floatValue: item.float,
          price,
          imageUrl: item.imageUrl,
          stattrak: item.stattrak,
          steamAssetId: id,
        });
      }
      setListingSuccess(true);
      setTimeout(() => {
        setListingSuccess(false);
        setSelectedItems([]);
        setPrices({});
      }, 3000);
    } catch (err) {
      console.error("Failed to list items:", err);
    }
  };

  const filteredInventory = inventory.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.weapon.toLowerCase().includes(q) ||
      `${item.weapon} ${item.name}`.toLowerCase().includes(q)
    );
  });

  const totalListingValue = selectedItems.reduce((sum, id) => {
    const price = prices[id];
    if (price) return sum + parseFloat(price);
    const item = inventory.find((i) => i.id === id);
    return sum + (item?.marketPrice || 0);
  }, 0);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-xl font-bold text-cs-light">Скин зарах</h1>
          <p className="text-cs-gray mt-1">
            Steam инвентараасаа скинүүдээ маркет дээр байршуулаарай
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={fetchInventory}
          disabled={loadingInventory}
          className="btn-secondary flex items-center gap-2 text-sm shrink-0 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loadingInventory ? "animate-spin" : ""} />
          Инвентар шинэчлэх
        </motion.button>
      </motion.div>

      {/* Success message */}
      {listingSuccess && (
        <div className="bg-cs-card border border-cs-green/30 rounded-lg p-4 mb-6 bg-cs-green/5">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={24} className="text-cs-green" />
            <div>
              <p className="text-cs-light font-medium">
                Амжилттай байршуулагдлаа!
              </p>
              <p className="text-cs-gray text-sm">
                Таны скинүүд маркет дээр худалдаанд гарлаа
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Inventory */}
        <div className="flex-1">
          {/* Search */}
          <div className="relative mb-4">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-cs-gray"
            />
            <input
              type="text"
              placeholder="Инвентараас хайх..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cs-gray hover:text-cs-light"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg">
            <div className="px-4 py-3 border-b border-cs-border flex items-center justify-between">
              <p className="text-cs-gray text-sm">
                <span className="text-cs-light font-medium">
                  {filteredInventory.length}
                </span>{" "}
                скин инвентарт
              </p>
              {selectedItems.length > 0 && (
                <button
                  onClick={() => setSelectedItems([])}
                  className="text-cs-orange text-xs hover:underline"
                >
                  Бүгдийг болих
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
              {filteredInventory.map((item) => {
                const isSelected = selectedItems.includes(item.id);
                const rarityColor =
                  RARITY_COLORS[item.rarity]?.split(" ")[0] || "";

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: item.tradable ? 1.02 : 1 }}
                    onClick={() => item.tradable && toggleSelect(item.id)}
                    className={`relative rounded-lg border p-3 transition-all cursor-pointer ${
                      !item.tradable
                        ? "opacity-50 cursor-not-allowed border-cs-border"
                        : isSelected
                        ? "border-cs-orange bg-cs-orange/5"
                        : "border-cs-border hover:border-cs-orange/30 bg-cs-darker"
                    }`}
                  >
                    {/* Checkbox */}
                    <div
                      className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-cs-orange bg-cs-orange"
                          : "border-cs-border"
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2 size={14} className="text-black" />
                      )}
                    </div>

                    {/* Item content */}
                    <div className="flex gap-3">
                      <div
                        className="w-20 h-16 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${getRarityBorderColor(
                            item.rarity
                          )}22, ${getRarityBorderColor(item.rarity)}44)`,
                        }}
                      >
                        <span className="text-cs-light/50 text-[10px]">
                          {item.weapon}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-cs-light text-sm font-medium truncate">
                          {item.weapon} | {item.name}
                        </h4>
                        <p className="text-cs-gray text-xs mt-0.5">
                          {item.wear} • Float: {item.float.toFixed(4)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs ${rarityColor}`}>
                            {RARITY_LABELS[item.rarity]}
                          </span>
                          {item.stattrak && (
                            <span className="text-[10px] bg-cs-orange/20 text-cs-orange px-1.5 py-0.5 rounded">
                              ST™
                            </span>
                          )}
                          {!item.tradable && (
                            <span className="text-[10px] bg-cs-red/20 text-cs-red px-1.5 py-0.5 rounded">
                              Түгжээтэй
                            </span>
                          )}
                        </div>
                        <p className="text-cs-green text-sm font-semibold mt-1">
                          ${item.marketPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Listing Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full lg:w-80 shrink-0"
        >
          <div className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg sticky top-24">
            <div className="px-4 py-3 border-b border-cs-border/50">
              <h3 className="text-cs-light text-sm font-semibold flex items-center gap-2">
                <Tag size={16} className="text-cs-orange" />
                Зарах жагсаалт
              </h3>
            </div>

            {selectedItems.length === 0 ? (
              <div className="p-4 text-center">
                <Package size={32} className="text-cs-gray/20 mx-auto mb-3" />
                <p className="text-cs-gray text-sm">
                  Зарах скинүүдээ сонгоно уу
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {selectedItems.map((id) => {
                  const item = inventory.find((i) => i.id === id);
                  if (!item) return null;

                  return (
                    <div
                      key={id}
                      className="bg-cs-darker rounded-lg p-3 border border-cs-border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-cs-light text-xs font-medium truncate mr-2">
                          {item.weapon} | {item.name}
                        </p>
                        <button
                          onClick={() => toggleSelect(id)}
                          className="text-cs-gray hover:text-cs-red shrink-0"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-cs-gray text-xs shrink-0">$</span>
                        <input
                          type="number"
                          placeholder={item.marketPrice.toFixed(2)}
                          value={prices[id] || ""}
                          onChange={(e) =>
                            setPrices({ ...prices, [id]: e.target.value })
                          }
                          className="input-field text-sm py-1.5"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <p className="text-cs-gray text-[10px] mt-1">
                        Маркет үнэ: ${item.marketPrice.toFixed(2)}
                      </p>
                    </div>
                  );
                })}

                {/* Info */}
                <div className="bg-cs-blue/10 border border-cs-blue/20 rounded-lg p-3 flex gap-2">
                  <Info size={14} className="text-cs-blue shrink-0 mt-0.5" />
                  <p className="text-cs-gray text-xs">
                    Шимтгэл: 5%. Зарагдсаны дараа мөнгө таны хэтэвчинд шууд
                    орно.
                  </p>
                </div>

                {/* Summary */}
                <div className="border-t border-cs-border pt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-cs-gray text-sm">
                      Нийт ({selectedItems.length} скин)
                    </span>
                    <span className="text-cs-light font-semibold">
                      ${totalListingValue.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-cs-gray text-xs">
                      Шимтгэл (5%)
                    </span>
                    <span className="text-cs-gray text-xs">
                      -${(totalListingValue * 0.05).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-4 pt-2 border-t border-cs-border/50">
                    <span className="text-cs-light text-sm font-medium">
                      Таны орлого
                    </span>
                    <span className="text-cs-green font-bold">
                      ${(totalListingValue * 0.95).toFixed(2)}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleListItems}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <DollarSign size={16} />
                    Маркетад байршуулах
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
