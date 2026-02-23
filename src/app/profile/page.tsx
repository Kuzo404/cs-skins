"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { useApp } from "@/context/AppContext";
import { usersAPI } from "@/lib/api";
import { Skin, Transaction } from "@/types";
import {
  User,
  Wallet,
  ShoppingCart,
  DollarSign,
  Calendar,
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isLoggedIn } = useApp();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [listings, setListings] = useState<Skin[]>([]);

  useEffect(() => {
    if (isLoggedIn) {
      usersAPI.transactions({ limit: 5 }).then(setTransactions).catch(() => setTransactions([]));
      usersAPI.listings("listed").then(setListings).catch(() => setListings([]));
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20">
        <div className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg max-w-md mx-auto p-4 text-center">
          <User size={48} className="text-cs-gray/20 mx-auto mb-4" />
          <h2 className="text-cs-light font-semibold text-lg mb-2">
            Нэвтэрнэ үү
          </h2>
          <p className="text-cs-gray text-sm mb-4">
            Профайл үзэхийн тулд Steam-ээр нэвтрэх шаардлагатай
          </p>
          <Link href="/" className="btn-steam inline-flex">
            Steam-ээр нэвтрэх
          </Link>
        </div>
      </div>
    );
  }

  const recentPurchases = transactions.filter(
    (t) => t.type === "purchase"
  ).slice(0, 5);
  const recentSales = transactions.filter((t) => t.type === "sale").slice(
    0,
    5
  );

  const activeLisitngs = listings.slice(0, 3);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg p-4 sm:p-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-cs-purple to-cs-blue flex items-center justify-center text-cs-light text-2xl font-bold">
              {user!.username[0]}
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-cs-green rounded-full border-2 border-cs-card" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-lg font-bold text-cs-light">
                {user!.username}
              </h1>
              <span className="badge bg-cs-green/10 text-cs-green border border-cs-green/20">
                Онлайн
              </span>
            </div>
            <p className="text-cs-gray text-sm mb-3">
              Steam ID: {user!.steamId}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-cs-gray">
                <Calendar size={14} />
                Бүртгүүлсэн:{" "}
                {new Date(user!.joinedAt).toLocaleDateString("mn-MN")}
              </span>
              <a
                href={`https://steamcommunity.com/profiles/${user!.steamId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-cs-blue hover:text-blue-400 transition-all duration-300"
              >
                <ExternalLink size={14} />
                Steam профайл
              </a>
            </div>
          </div>

          <div className="flex gap-3 shrink-0">
            <Link href="/wallet" className="btn-primary text-sm py-2.5">
              <Wallet size={16} className="inline mr-2" />
              Хэтэвч
            </Link>
            <Link href="/sell" className="btn-secondary text-sm py-2.5">
              <Package size={16} className="inline mr-2" />
              Зарах
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ y: -3 }}
          className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-cs-orange/10 flex items-center justify-center">
              <Wallet size={18} className="text-cs-orange" />
            </div>
            <span className="text-cs-gray text-xs">Баланс</span>
          </div>
          <p className="text-lg font-bold text-cs-light">
            ${user!.balance.toFixed(2)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ y: -3 }}
          className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-cs-green/10 flex items-center justify-center">
              <TrendingUp size={18} className="text-cs-green" />
            </div>
            <span className="text-cs-gray text-xs">Нийт борлуулалт</span>
          </div>
          <p className="text-lg font-bold text-cs-light">
            ${user!.totalSales.toFixed(2)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ y: -3 }}
          className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-cs-blue/10 flex items-center justify-center">
              <ShoppingCart size={18} className="text-cs-blue" />
            </div>
            <span className="text-cs-gray text-xs">Нийт худалдаж авсан</span>
          </div>
          <p className="text-lg font-bold text-cs-light">
            ${user!.totalPurchases.toFixed(2)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          whileHover={{ y: -3 }}
          className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-cs-purple/10 flex items-center justify-center">
              <DollarSign size={18} className="text-cs-purple" />
            </div>
            <span className="text-cs-gray text-xs">Ашиг</span>
          </div>
          <p className="text-lg font-bold text-cs-light">
            ${(user!.totalSales - user!.totalPurchases).toFixed(2)}
          </p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Active Listings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg"
        >
          <div className="px-4 py-3 border-b border-cs-border flex items-center justify-between">
            <h2 className="text-cs-light font-semibold text-sm">
              Идэвхтэй зарууд
            </h2>
            <Link
              href="/sell"
              className="text-cs-orange text-xs hover:underline"
            >
              Бүгдийг харах
            </Link>
          </div>
          <div className="divide-y divide-cs-border/20">
            {activeLisitngs.map((skin) => (
              <div
                key={skin.id}
                className="px-4 py-3 flex items-center justify-between hover:bg-cs-border/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-10 rounded-lg bg-cs-darker flex items-center justify-center text-cs-light/30 text-[10px]">
                    {skin.weapon}
                  </div>
                  <div>
                    <p className="text-cs-light text-sm font-medium">
                      {skin.weapon} | {skin.name}
                    </p>
                    <p className="text-cs-gray text-xs">{skin.wear}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-cs-orange font-semibold text-sm">
                    ${skin.price.toFixed(2)}
                  </p>
                  <p className="text-cs-gray text-[10px] flex items-center gap-1 justify-end">
                    <Clock size={10} />
                    {new Date(skin.listedAt).toLocaleDateString("mn-MN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg"
        >
          <div className="px-4 py-3 border-b border-cs-border flex items-center justify-between">
            <h2 className="text-cs-light font-semibold text-sm">
              Сүүлийн үйлдлүүд
            </h2>
            <Link
              href="/wallet"
              className="text-cs-orange text-xs hover:underline"
            >
              Бүгдийг харах
            </Link>
          </div>
          <div className="divide-y divide-cs-border/20">
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                className="px-4 py-3 flex items-center justify-between hover:bg-cs-border/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      tx.type === "purchase"
                        ? "bg-cs-blue/10"
                        : tx.type === "sale"
                        ? "bg-cs-orange/10"
                        : "bg-cs-green/10"
                    }`}
                  >
                    {tx.type === "purchase" ? (
                      <ShoppingCart size={16} className="text-cs-blue" />
                    ) : tx.type === "sale" ? (
                      <DollarSign size={16} className="text-cs-orange" />
                    ) : (
                      <Wallet size={16} className="text-cs-green" />
                    )}
                  </div>
                  <div>
                    <p className="text-cs-light text-sm font-medium truncate max-w-[200px]">
                      {tx.description}
                    </p>
                    <p className="text-cs-gray text-xs">
                      {new Date(tx.date).toLocaleDateString("mn-MN")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-semibold text-sm ${
                      tx.amount > 0 ? "text-cs-green" : "text-cs-light"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                  </span>
                  <CheckCircle2 size={14} className="text-cs-green" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
