import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
}

export interface IOrderDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  region: string;
  notes?: string;
  referralCode?: string;
}

export interface IOrder extends Document {
  orderId: string; // User-facing order ID (e.g. FM-XXXX)
  userId?: mongoose.Types.ObjectId; // Reference to logged-in user, if any
  items: IOrderItem[];
  details: IOrderDetails;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "cod";
  status: "pending" | "processing" | "delivered" | "cancelled";
  referralCodeUsed?: string;
  referralRewarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const OrderDetailsSchema = new Schema<IOrderDetails>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true },
  notes: { type: String },
  referralCode: { type: String },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    items: { type: [OrderItemSchema], required: true },
    details: { type: OrderDetailsSchema, required: true },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, required: true, enum: ["cod"], default: "cod" },
    status: {
      type: String,
      required: true,
      enum: ["pending", "processing", "delivered", "cancelled"],
      default: "pending",
    },
    referralCodeUsed: { type: String },
    referralRewarded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;