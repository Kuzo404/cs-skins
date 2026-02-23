"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { User, CartItem, Skin } from "@/types";
import { authAPI, cartAPI } from "@/lib/api";

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  cart: CartItem[];
  login: () => void;
  logout: () => void;
  addToCart: (skin: Skin) => void;
  removeFromCart: (skinId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  updateBalance: (amount: number) => void;
  refreshUser: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = user !== null;

  const refreshUser = useCallback(async () => {
    try {
      const data = await authAPI.getMe();
      if (data) {
        setUser({
          id: data.id,
          steamId: data.steamId,
          username: data.username,
          avatar: data.avatar,
          balance: data.balance || 0,
          totalSales: data.totalSales || 0,
          totalPurchases: data.totalPurchases || 0,
          joinedAt: data.createdAt || new Date().toISOString(),
          isOnline: true,
        });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart([]);
      return;
    }
    try {
      const items = await cartAPI.get();
      setCart(
        items.map((item: any) => ({
          skin: item.skin,
          addedAt: item.addedAt,
        }))
      );
    } catch {
      setCart([]);
    }
  }, [user]);

  // On mount, check auth status
  useEffect(() => {
    (async () => {
      await refreshUser();
      setLoading(false);
    })();
  }, [refreshUser]);

  // When user changes, refresh cart
  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      setCart([]);
    }
  }, [user, refreshCart]);

  const login = () => {
    window.location.href = authAPI.loginUrl();
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // ignore
    }
    setUser(null);
    setCart([]);
  };

  const addToCart = async (skin: Skin) => {
    if (cart.find((item) => item.skin.id === skin.id)) return;
    // Optimistic update
    setCart((prev) => [...prev, { skin, addedAt: new Date().toISOString() }]);
    try {
      await cartAPI.add(skin.id);
    } catch {
      // Revert on failure
      setCart((prev) => prev.filter((item) => item.skin.id !== skin.id));
    }
  };

  const removeFromCart = async (skinId: string) => {
    const prev = cart;
    setCart(cart.filter((item) => item.skin.id !== skinId));
    try {
      await cartAPI.remove(skinId);
    } catch {
      setCart(prev);
    }
  };

  const clearCart = async () => {
    const prev = cart;
    setCart([]);
    try {
      await cartAPI.clear();
    } catch {
      setCart(prev);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.skin.price, 0);

  const updateBalance = (amount: number) => {
    if (user) {
      setUser({ ...user, balance: user.balance + amount });
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        cart,
        login,
        logout,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        updateBalance,
        refreshUser,
        refreshCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
