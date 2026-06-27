import mongoose from "mongoose";

export interface IOrderItem {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: {
    grocery: mongoose.Types.ObjectId;
    name: string;
    price: string;
    unit: string;
    quantity: number;
    image: string;
  }[];
  totalAmount: number;
  isPaid: boolean;
  paymentMethod: "cod" | "online";
  assignment?: mongoose.Types.ObjectId;
  address: {
    fullName: string;
    city: string;
    mobile: string;
    state: string;
    pincode: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
  };
  // ✅ string union, array nahi
  status: "pending" | "out of delivery" | "delivered";
  assignedDeliveryBoy?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const orderSchema = new mongoose.Schema<IOrderItem>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        grocery: { type: mongoose.Schema.Types.ObjectId, ref: "Grocery" },
        name: String,
        price: String,
        unit: String,
        image: String,
        quantity: Number,
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },
    address: {
      fullName: String,
      city: String,
      mobile: String,
      state: String,
      pincode: String,
      fullAddress: String,
      latitude: Number,
      longitude: Number,
    },
    totalAmount: Number,
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryAssignment",
      default: null,
    },
    assignedDeliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      // ✅ "out for delivery" consistent rakha
      enum: [ "pending" , "out of delivery" , "delivered"],
      default: "pending",
    },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model<IOrderItem>("Order", orderSchema);

export default Order;