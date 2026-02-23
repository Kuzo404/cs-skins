export type Rarity =
  | "consumer"
  | "industrial"
  | "milspec"
  | "restricted"
  | "classified"
  | "covert"
  | "gold";

export type Wear =
  | "Factory New"
  | "Minimal Wear"
  | "Field-Tested"
  | "Well-Worn"
  | "Battle-Scarred";

export type WeaponCategory =
  | "Rifle"
  | "Pistol"
  | "SMG"
  | "Shotgun"
  | "Sniper"
  | "Knife"
  | "Gloves";

export interface Skin {
  id: string;
  name: string;
  weapon: string;
  category: WeaponCategory;
  rarity: Rarity;
  wear: Wear;
  float: number;
  price: number;
  imageUrl: string;
  stattrak: boolean;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  listedAt: string;
  collection?: string;
}

export interface User {
  id: string;
  steamId: string;
  username: string;
  avatar: string;
  balance: number;
  totalSales: number;
  totalPurchases: number;
  joinedAt: string;
  isOnline: boolean;
}

export interface Transaction {
  id: string;
  type: "purchase" | "sale" | "deposit" | "withdrawal";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
  skinId?: string;
  skinName?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  weapon: string;
  category: WeaponCategory;
  rarity: Rarity;
  wear: Wear;
  float: number;
  imageUrl: string;
  stattrak: boolean;
  tradable: boolean;
  marketPrice: number;
}

export interface CartItem {
  skin: Skin;
  addedAt: string;
}
