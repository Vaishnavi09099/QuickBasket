import mongoose, { Schema, Document, Model } from "mongoose";

 interface IGrocery extends Document {
  name: string;
  
  price: Number;
  category: string;
  image: string;
 
  unit: string;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const GrocerySchema = new Schema<IGrocery>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

  
    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      enum:[
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Rice, Atta & Grains",
  "Snacks & Biscuits",
  "Spices & Masalas",
  "Beverages & Drinks",
  "Personal Care",
  "Household Essentials",
  "Instant & Packaged Food",
  "Baby & Pet Care"
],
      required: true,
    },

    image: {
      type: String,
      required: true,
    },


    unit: {
      type: String,
      required:true,
      enum:[
        "kg", "g", "L", "ml", "pcs", "pack", "dozen"

      ],
      default: "kg", // kg, litre, packet, piece, etc.
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Grocery: Model<IGrocery> =
  mongoose.models.Grocery ||
  mongoose.model<IGrocery>("Grocery", GrocerySchema);

export default Grocery;


