
export interface User {
  id: number;
  name: string;
  lunchCount: number;
  dinnerCount: number;
  hasUpdated: boolean;
}

export interface UserExtra {
  id: number;
  userId: number;
  description: string;
  amount: number;
  date: string;
}

export interface InventoryItem {
  id: number;
  item: string;
  quantity: string;
  status: string;
  price: string;
}
