import mongoose from "mongoose";

interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "admin" | "deliveryBoy";
  img?: string;
  location?: {
    type: "Point";
    coordinates: number[];
  };
  socketId: string | null;
  isOnline: boolean;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    mobile: { type: String },
    role: {
      type: String,
      enum: ["user", "admin", "deliveryBoy"],
      default: "user",
      required: true,
    },
    img: { type: String },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
        //longitude, latitude 
      },
    },
    socketId: { type: String, default: null },
    isOnline: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.index({ location: "2dsphere" });

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;