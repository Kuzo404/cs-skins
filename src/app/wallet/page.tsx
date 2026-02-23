"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { usersAPI } from "@/lib/api";
import { Transaction } from "@/types";
import { motion } from "framer-motion";
import {
  Wallet,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Building2,
  Smartphone,
  Clock,
  CheckCircle2,
  XCircle,
  ShoppingCart,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function WalletPage() {
  const { user, isLoggedIn, updateBalance } = useApp();
  const [depositAmount, setDepositAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("qpay");
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (isLoggedIn) {
      usersAPI.transactions().then(setTransactions).catch(() => setTransactions([]));
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-16">
        <div className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg max-w-sm mx-auto p-6 text-center">
          <Wallet size={36} className="text-cs-gray/20 mx-auto mb-3" />
          <h2 className="text-cs-light font-semibold text-sm mb-1">Нэвтэрнэ үү</h2>
          <p className="text-cs-gray text-xs mb-3">
            Хэтэвч ашиглахын тулд Steam-ээр нэвтрэх шаардлагатай
          </p>
          <Link href="/" className="btn-steam inline-flex text-xs">
            Steam-ээр нэвтрэх
          </Link>
        </div>
      </div>
    );
  }

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  const paymentMethods = [
    {
      id: "qpay",
      name: "QPay",
      icon: Smartphone,
      desc: "QR код уншуулж төлөх",
    },
    {
      id: "bank",
      name: "Банк шилжүүлэг",
      icon: Building2,
      desc: "Дансаар шилжүүлэх",
    },
    {
      id: "card",
      name: "Карт",
      icon: CreditCard,
      desc: "Visa / Mastercard",
    },
  ];

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount > 0) {
      updateBalance(amount);
      setDepositSuccess(true);
      setTimeout(() => {
        setDepositSuccess(false);
        setShowDeposit(false);
        setDepositAmount("");
      }, 2000);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft size={16} className="text-cs-green" />;
      case "purchase":
        return <ShoppingCart size={16} className="text-cs-blue" />;
      case "sale":
        return <DollarSign size={16} className="text-cs-orange" />;
      case "withdrawal":
        return <ArrowUpRight size={16} className="text-cs-red" />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={14} className="text-cs-green" />;
      case "pending":
        return <Clock size={14} className="text-cs-orange" />;
      case "failed":
        return <XCircle size={14} className="text-cs-red" />;
      default:
        return null;
    }
  };

  const totalDeposits = transactions.filter(
    (t) => t.type === "deposit"
  ).reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transactions.filter(
    (t) => t.type === "purchase"
  ).reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalEarned = transactions.filter(
    (t) => t.type === "sale"
  ).reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 bg-gradient-to-b from-cs-orange to-cs-muzzle rounded-full" />
        <h1 className="text-lg font-bold text-cs-light">Хэтэвч</h1>
      </motion.div>

      {/* Balance Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-cs-card/60 backdrop-blur-sm border border-cs-orange/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={16} className="text-cs-orange" />
            <span className="text-cs-gray text-xs">Үлдэгдэл</span>
          </div>
          <p className="text-xl font-bold text-cs-light">
            ${user!.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <button
            onClick={() => setShowDeposit(true)}
            className="btn-primary w-full mt-3 text-xs py-2 flex items-center justify-center gap-1.5"
          >
            <Plus size={14} />
            Цэнэглэх
          </button>
        </div>

        <div className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownLeft size={16} className="text-green-400" />
            <span className="text-cs-gray text-xs">Цэнэглэлт</span>
          </div>
          <p className="text-xl font-bold text-cs-light">
            ${totalDeposits.toFixed(2)}
          </p>
        </div>

        <div className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart size={16} className="text-blue-400" />
            <span className="text-cs-gray text-xs">Зарцуулсан</span>
          </div>
          <p className="text-xl font-bold text-cs-light">
            ${totalSpent.toFixed(2)}
          </p>
        </div>

        <div className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-cs-orange" />
            <span className="text-cs-gray text-xs">Орлого</span>
          </div>
          <p className="text-xl font-bold text-cs-light">
            ${totalEarned.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !depositSuccess && setShowDeposit(false)}
          />
          <div className="relative bg-cs-card/95 backdrop-blur-xl border border-cs-border/70 rounded-lg w-full max-w-lg p-5 shadow-[0_10px_50px_rgba(0,0,0,0.5)]">
            {depositSuccess ? (
              <div className="text-center py-6">
                <CheckCircle2 size={48} className="text-green-400 mx-auto mb-3" />
                <h3 className="text-cs-light font-bold text-base mb-1">Амжилттай!</h3>
                <p className="text-cs-gray text-sm">
                  ${depositAmount} таны хэтэвчинд нэмэгдлээ
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-cs-light font-bold text-sm">
                    Хэтэвч цэнэглэх
                  </h3>
                  <button
                    onClick={() => setShowDeposit(false)}
                    className="text-cs-gray hover:text-cs-light p-1"
                  >
                    <XCircle size={18} />
                  </button>
                </div>

                {/* Amount */}
                <div className="mb-4">
                  <label className="text-cs-gray text-xs mb-1.5 block">
                    Дүн ($)
                  </label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="0.00"
                    className="input-field text-xl font-bold text-center"
                  />
                  <div className="grid grid-cols-3 gap-1.5 mt-2">
                    {presetAmounts.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setDepositAmount(amt.toString())}
                        className={`py-1.5 rounded text-xs font-medium transition-colors ${
                          depositAmount === amt.toString()
                            ? "bg-cs-orange text-black"
                            : "bg-cs-dark text-cs-gray hover:text-cs-light"
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-4">
                  <label className="text-cs-gray text-xs mb-1.5 block">
                    Төлбөрийн хэрэгсэл
                  </label>
                  <div className="space-y-1.5">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors ${
                            paymentMethod === method.id
                              ? "border-cs-orange/50 bg-cs-orange/5"
                              : "border-cs-border bg-cs-dark hover:border-cs-border-light"
                          }`}
                        >
                          <Icon
                            size={16}
                            className={
                              paymentMethod === method.id
                                ? "text-cs-orange"
                                : "text-cs-gray"
                            }
                          />
                          <div className="text-left">
                            <p className="text-cs-light text-xs font-medium">
                              {method.name}
                            </p>
                            <p className="text-cs-gray text-[10px]">
                              {method.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={handleDeposit}
                  disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {depositAmount
                    ? `$${parseFloat(depositAmount).toFixed(2)} цэнэглэх`
                    : "Дүн оруулна уу"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-cs-card/60 backdrop-blur-sm border border-cs-border/40 rounded-lg">
        <div className="px-4 py-3 border-b border-cs-border/50">
          <h2 className="text-cs-light font-semibold text-sm">Гүйлгээний түүх</h2>
        </div>
        <div className="divide-y divide-cs-border/20">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="px-4 py-3 flex items-center justify-between hover:bg-cs-orange/[0.02] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-cs-dark flex items-center justify-center">
                  {getTransactionIcon(tx.type)}
                </div>
                <div>
                  <p className="text-cs-light text-xs font-medium">
                    {tx.description}
                  </p>
                  <p className="text-cs-gray text-[10px] mt-0.5">
                    {new Date(tx.date).toLocaleDateString("mn-MN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p
                  className={`font-semibold text-xs ${
                    tx.amount > 0 ? "text-green-400" : "text-cs-light"
                  }`}
                >
                  {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                </p>
                {getStatusIcon(tx.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
