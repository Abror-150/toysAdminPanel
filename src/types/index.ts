export type MaterialType = 'TRIKOTAJ' | 'ASTARLIK' | 'PAXTALIK';

export interface Material {
  id: string;
  type: MaterialType;
  description: string;
  naborId: string;
}

export interface Accessory {
  id: string;
  name: string;
  naborId: string;
}

export interface Furniture {
  id: string;
  name: string;
  naborId: string;
}

export interface Andoza {
  id: string;
  name: string;
  naborId: string;
}

export interface Nabor {
  id: string;
  name: string;
  description: string;
  image: string;
  has_manual: boolean;
  createdAt: string;
  materials: Material[];
  accessories: Accessory[];
  furnitures: Furniture[];
  andozalar: Andoza[];
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  isRead?: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  totalPrice: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  naborName: string;
  quantity: number;
  price: number;
}

export interface DashboardStats {
  totalNabors: number;
  totalOrders: number;
  monthlyRevenue: number;
  totalMessages: number;
}

export interface MonthlyStats {
  month: string;
  revenue: number;
  orders: number;
}
