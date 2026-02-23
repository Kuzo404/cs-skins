"use client";

import { useState, useEffect, useCallback } from "react";
import SkinCard from "@/components/SkinCard";
import { RARITY_LABELS } from "@/lib/constants";
import { skinsAPI } from "@/lib/api";
import { Skin, Rarity, WeaponCategory, Wear } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ArrowUpDown,
  Crosshair,
  Loader2,
} from "lucide-react";

type SortOption = "price-asc" | "price-desc" | "newest" | "float-asc" | "float-desc";

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<WeaponCategory[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<Rarity[]>([]);
  const [selectedWears, setSelectedWears] = useState<Wear[]>([]);
  const [stattrakOnly, setStattrakOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [skins, setSkins] = useState<Skin[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const categories: WeaponCategory[] = [
    "Rifle",
    "Pistol",
    "SMG",
    "Shotgun",
    "Sniper",
    "Knife",
    "Gloves",
  ];

  const rarities: Rarity[] = [
    "consumer",
    "industrial",
    "milspec",
    "restricted",
    "classified",
    "covert",
    "gold",
  ];

  const wears: Wear[] = [
    "Factory New",
    "Minimal Wear",
    "Field-Tested",
    "Well-Worn",
    "Battle-Scarred",
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: "Шинэ нэмэгдсэн" },
    { value: "price-asc", label: "Үнэ: Бага → Их" },
    { value: "price-desc", label: "Үнэ: Их → Бага" },
    { value: "float-asc", label: "Float: Бага → Их" },
    { value: "float-desc", label: "Float: Их → Бага" },
  ];

  const categoryLabels: Record<WeaponCategory, string> = {
    Rifle: "Буу",
    Pistol: "Гар буу",
    SMG: "SMG",
    Shotgun: "Shotgun",
    Sniper: "Снайпер",
    Knife: "Хутга",
    Gloves: "Бээлий",
  };

  const toggleCategory = (cat: WeaponCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleRarity = (r: Rarity) => {
    setSelectedRarities((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
  };

  const toggleWear = (w: Wear) => {
    setSelectedWears((prev) =>
      prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedRarities([]);
    setSelectedWears([]);
    setStattrakOnly(false);
    setPriceMin("");
    setPriceMax("");
  };

  const hasActiveFilters =
    search ||
    selectedCategories.length > 0 ||
    selectedRarities.length > 0 ||
    selectedWears.length > 0 ||
    stattrakOnly ||
    priceMin ||
    priceMax;

  const fetchSkins = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        sort: sortBy,
        limit: 50,
        offset: 0,
      };
      if (search) params.search = search;
      if (selectedCategories.length > 0) params.category = selectedCategories.join(",");
      if (selectedRarities.length > 0) params.rarity = selectedRarities.join(",");
      if (selectedWears.length > 0) params.wear = selectedWears.join(",");
      if (stattrakOnly) params.stattrak = "true";
      if (priceMin) params.priceMin = priceMin;
      if (priceMax) params.priceMax = priceMax;

      const data = await skinsAPI.list(params);
      setSkins(data.skins || []);
      setTotalCount(data.total || 0);
    } catch (err) {
      console.error("Failed to fetch skins:", err);
      setSkins([]);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategories, selectedRarities, selectedWears, stattrakOnly, priceMin, priceMax, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSkins();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchSkins]);

  const rarityColorMap: Record<string, string> = {
    consumer: "bg-rarity-consumer",
    industrial: "bg-rarity-industrial",
    milspec: "bg-rarity-milspec",
    restricted: "bg-rarity-restricted",
    classified: "bg-rarity-classified",
    covert: "bg-rarity-covert",
    gold: "bg-rarity-gold",
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-5"
      >
        <div className="w-1 h-6 bg-gradient-to-b from-cs-orange to-cs-muzzle rounded-full" />
        <h1 className="text-lg font-bold text-cs-light">Маркет</h1>
        <span className="text-cs-gray text-xs bg-cs-card/60 px-2 py-0.5 rounded border border-cs-border/30">
          {totalCount} скин
        </span>
      </motion.div>

      {/* Top bar: search + sort + filter toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-2 mb-5"
      >
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-cs-gray"
          />
          <input
            type="text"
            placeholder="Скин хайх..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 py-2"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cs-gray hover:text-cs-light transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="input-field appearance-none pr-8 cursor-pointer min-w-[160px] py-2 text-xs"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown
              size={12}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cs-gray pointer-events-none"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center gap-1.5 py-2 text-xs transition-all duration-300 ${
              showFilters ? "border-cs-orange/50 text-cs-orange" : ""
            }`}
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">Шүүлтүүр</span>
          </motion.button>
        </div>
      </motion.div>

      <div className="flex gap-4">
        {/* Filter Sidebar */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-56 shrink-0 hidden lg:block"
          >
            <div className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg p-3 sticky top-20 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-cs-light font-semibold text-xs uppercase tracking-wider">Шүүлтүүр</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-cs-orange text-[10px] hover:underline"
                  >
                    Цэвэрлэх
                  </button>
                )}
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-cs-gray text-[10px] font-medium uppercase tracking-wider mb-2">
                  Төрөл
                </h4>
                <div className="space-y-0.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-all duration-300 ${
                        selectedCategories.includes(cat)
                          ? "bg-cs-orange/10 text-cs-orange border-l-2 border-cs-orange"
                          : "text-cs-gray hover:text-cs-light hover:bg-cs-card"
                      }`}
                    >
                      {categoryLabels[cat]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rarity */}
              <div>
                <h4 className="text-cs-gray text-[10px] font-medium uppercase tracking-wider mb-2">
                  Зэрэглэл
                </h4>
                <div className="space-y-0.5">
                  {rarities.map((r) => (
                    <button
                      key={r}
                      onClick={() => toggleRarity(r)}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-all duration-300 flex items-center gap-1.5 ${
                        selectedRarities.includes(r)
                          ? "bg-cs-orange/10 text-cs-orange border-l-2 border-cs-orange"
                          : "text-cs-gray hover:text-cs-light hover:bg-cs-card"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${rarityColorMap[r]}`}
                      />
                      {RARITY_LABELS[r]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wear */}
              <div>
                <h4 className="text-cs-gray text-[10px] font-medium uppercase tracking-wider mb-2">
                  Элэгдэл
                </h4>
                <div className="space-y-0.5">
                  {wears.map((w) => (
                    <button
                      key={w}
                      onClick={() => toggleWear(w)}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-all duration-300 ${
                        selectedWears.includes(w)
                          ? "bg-cs-orange/10 text-cs-orange border-l-2 border-cs-orange"
                          : "text-cs-gray hover:text-cs-light hover:bg-cs-card"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-cs-gray text-[10px] font-medium uppercase tracking-wider mb-2">
                  Үнийн хязгаар
                </h4>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    placeholder="Мин"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="input-field text-xs py-1.5"
                  />
                  <input
                    type="number"
                    placeholder="Макс"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="input-field text-xs py-1.5"
                  />
                </div>
              </div>

              {/* StatTrak */}
              <label className="flex items-center gap-2 cursor-pointer px-2.5 py-1.5 rounded hover:bg-cs-card transition-all duration-300">
                <input
                  type="checkbox"
                  checked={stattrakOnly}
                  onChange={(e) => setStattrakOnly(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-cs-border bg-cs-dark accent-cs-orange"
                />
                <span className="text-xs text-cs-gray">StatTrak™</span>
              </label>
            </div>
          </motion.div>
        )}

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Active filter tags (mobile) */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-1.5 mb-3 lg:hidden">
              {selectedCategories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1 bg-cs-orange/10 text-cs-orange text-[10px] font-medium px-2 py-0.5 rounded cursor-pointer"
                  onClick={() => toggleCategory(cat)}
                >
                  {categoryLabels[cat]} <X size={10} />
                </span>
              ))}
              {selectedRarities.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center gap-1 bg-cs-orange/10 text-cs-orange text-[10px] font-medium px-2 py-0.5 rounded cursor-pointer"
                  onClick={() => toggleRarity(r)}
                >
                  {RARITY_LABELS[r]} <X size={10} />
                </span>
              ))}
            </div>
          )}

          {/* Count */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-cs-gray text-xs">
              <span className="text-cs-light font-medium">{totalCount}</span> скин олдлоо
              {loading && <Loader2 size={12} className="inline ml-2 animate-spin" />}
            </p>
          </div>

          {/* Grid */}
          {loading && skins.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="text-cs-orange animate-spin" />
            </div>
          ) : skins.length > 0 ? (
            <motion.div
              layout
              className={`grid gap-3 ${
                showFilters
                  ? "grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                  : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              }`}
            >
              {skins.map((skin, i) => (
                <SkinCard key={skin.id} skin={skin} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg p-10 text-center"
            >
              <Search size={36} className="text-cs-gray/20 mx-auto mb-3" />
              <h3 className="text-cs-light font-semibold text-sm mb-1">
                Скин олдсонгүй
              </h3>
              <p className="text-cs-gray text-xs mb-3">
                Шүүлтүүрээ өөрчилж дахин хайна уу
              </p>
              <button onClick={clearFilters} className="btn-secondary text-xs">
                Шүүлтүүр цэвэрлэх
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
