"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CartItem, Order, OrderDetails, Product } from "./types";
import { addReferralReward, getOrCreateReferralCode } from "./referral";
import { useSession } from "next-auth/react";


const CART_KEY = "fridgemall-cart";
const ORDERS_KEY = "fridgemall-orders";


interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (details: OrderDetails) => Order;
  sendSms : (message: string, number: string) => void;
  orders: Order[];
}

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function loadOrders(): Order[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(ORDERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setOrders(loadOrders());
    setHydrated(true);
  }, []);

  const {data} = useSession();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get("referredby") || params.get("refferedby");
      if (refCode) {
        localStorage.setItem("fridgemall-referredby", refCode);
      }
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const sendSms = useCallback(async (message: string, number: string) => {
    try {
      const response = await fetch("/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, recipient: number }),
      });
      return response.json();
    } catch (err) {
      console.error("[sendSms error]", err);
    }
  }, []);

 

  const placeOrder = useCallback(
    (details: OrderDetails): Order => {
      const deliveryFee = 0;
    
      const order: Order = {
        id: `FM-${Date.now().toString(36).toUpperCase()}`,
        items: [...items],
        details,
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
        paymentMethod: "cod",
        status: "pending",
        createdAt: new Date().toISOString(),
        referralCodeUsed: details.referralCode,

      };

      const itemLines = order.items
        .map((item) => `${item.product.name} x${item.quantity} (GHS ${item.product.price})`)
        .join("\n");

      sendSms(
        `Dear customer,\nYour order has been placed!\nOrder ID: ${order.id}\n${itemLines}\nTotal: GHS ${subtotal}\nPayment: Pay on Delivery\nWe will call you to arrange delivery. Thank you for shopping with us!\n\n Visit https://fridgemall.com/dashboard to track your order!` ,
        `${details.phone}`
      );

      const updatedOrders = [order, ...loadOrders()];
      localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
      setOrders(updatedOrders);

      // Async sync order details to Mongoose DB
      fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
          items: order.items,
          details: order.details,
          subtotal: order.subtotal,
          deliveryFee: order.deliveryFee,
          total: order.total,
          paymentMethod: order.paymentMethod,
          status: order.status,
          referralCodeUsed: order.referralCodeUsed,
        }),
      }).catch((err) => console.error("Error syncing order to DB:", err));

      if (details.referralCode) {
        const myCode = getOrCreateReferralCode();
        if (details.referralCode !== myCode) {
          addReferralReward(details.referralCode, order.id);
        }
      }

      clearCart();
      return order;
    },
    [items, subtotal, clearCart, sendSms]
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      placeOrder,
      sendSms,
      orders,
    }),
    [
      items,
      itemCount,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      placeOrder,
      sendSms,
      orders,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
