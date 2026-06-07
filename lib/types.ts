export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  capacity: string;
  energyRating: string;
  description: string;
  features: string[];
  image: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  region: string;
  notes?: string;
  referralCode?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  details: OrderDetails;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "cod";
  status: "pending" | "confirmed" | "delivered";
  createdAt: string;
  referralCodeUsed?: string;
}

export interface ReferralReward {
  id: string;
  referrerCode: string;
  orderId: string;
  amount: number;
  createdAt: string;
}
