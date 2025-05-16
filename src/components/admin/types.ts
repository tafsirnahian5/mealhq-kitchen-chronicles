
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

export interface ExpenseSummary {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  riceCount: number;
  eggCount: number;
  riceAmount: number;
  eggAmount: number;
  otherAmount: number;
}

export interface ExtraItemRecord {
  userId: number;
  userName: string;
  riceCount: number;
  eggCount: number;
  date: string;
}

export interface MealWithExtras {
  userId: number;
  userName: string;
  mealCount: number;
  date: string;
  hasExtra: boolean;
  extraRice: number;
  extraEgg: number;
}
