"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { ArrowLeft, Package, ImageIcon, Upload,Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import axios from "axios";

const UNITS = ["kg", "g", "L", "ml", "pcs", "pack", "dozen"];

const CATEGORIES = [
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Rice, Atta & Grains",
  "Snacks & Biscuits",
  "Spices & Masalas",
  "Beverages & Drinks",
  "Personal Care",
  "Household Essentials",
  "Instant & Packaged Food",
  "Baby & Pet Care",
];

export default function AddGrocery() {
  const router = useRouter();

  const [form, setForm] = useState({
    productName: "",
    price: "",
    unit: "kg",
    category: "",
    image: "",
  });
  const [backendImage, setBackendImage] = useState<File | null>(null);
  const [loading,setLoading] = useState(false);

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const previewPrice = form.price ? `₹${form.price}` : "₹0";

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setForm((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    setBackendImage(file);
  };

  const handleCancel = () => {
    router.push("/");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.productName);
      formData.append("price", form.price);
      formData.append("unit", form.unit);
      formData.append("category", form.category);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const res = await axios.post("/api/admin/add-grocery", formData);
      console.log(res.data);
     
    } catch (err: any) {
      console.log(err.response?.data)  
    } finally{
       setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f3ec]">
      {/* Navbar */}
      <div className="flex justify-between items-center px-10 py-5">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex gap-2 items-center text-green-600 hover:text-green-700 transition"
        >
          <ArrowLeft size={20} />
          <span className="text-base">Back to store</span>
        </button>
        <div className="flex gap-2 items-center">
          <img src="/favicon.ico" className="w-7 h-6" alt="logo" />
          <span className="text-lg font-bold">QuickBasket Admin</span>
        </div>
      </div>

      {/* Hero */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center pb-8"
      >
        <h1 className="text-5xl text-[#1D9330] font-extrabold mb-2">
          Add a new grocery
        </h1>
        <p className="text-gray-500">
          Fill in the details below to add a new grocery item to your catalog.
        </p>
      </motion.div>

      {/* Body */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex gap-8 px-10 pb-16 max-w-6xl mx-auto"
      >
        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-8 flex-1 shadow-xl"
        >
          {/* Product Image Upload */}
          <p className="text-xs font-semibold tracking-widest text-gray-500 mb-3">
            PRODUCT IMAGE<span className="text-red-500">*</span>
          </p>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="fileInput"
            onChange={handleImageChange}
          />
          <label htmlFor="fileInput">
            <div className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center py-10 mb-6 cursor-pointer hover:border-green-400 transition">
              {form.image ? (
                <img
                  src={form.image}
                  alt="preview"
                  className="h-32 object-contain rounded-xl"
                />
              ) : (
                <>
                  <div className="bg-green-100 rounded-full p-3 mb-3">
                    <ImageIcon
                      className="w-7 h-7 text-green-600"
                      strokeWidth={1.8}
                    />
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Click to upload product image
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG up to 5 MB
                  </p>
                </>
              )}
            </div>
          </label>

          {/* Product Name */}
          <div className="flex gap-4 mb-5">
            <div className="flex-1">
              <p className="text-xs font-semibold tracking-widest text-gray-500 mb-2">
                PRODUCT NAME<span className="text-red-500">*</span>
              </p>
              <input
                type="text"
                placeholder="e.g. sweets, Milk...."
                value={form.productName}
                onChange={(e) => set("productName", e.target.value)}
                className="w-full bg-[#f5f3ec] rounded-xl px-4 py-3 text-sm outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Price */}
          <div className="flex gap-4 mb-5">
            <div className="flex-1">
              <p className="text-xs font-semibold tracking-widest text-gray-500 mb-2">
                PRICE (₹)
              </p>
              <input
                type="number"
                placeholder="120"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className="w-full bg-[#f5f3ec] rounded-xl px-4 py-3 text-sm outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Unit */}
          <p className="text-xs font-semibold tracking-widest text-gray-500 mb-3">
            UNIT
          </p>
          <div className="flex gap-2 flex-wrap mb-5">
            {UNITS.map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => set("unit", u)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                  form.unit === u
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-green-400"
                }`}
              >
                {u}
              </button>
            ))}
          </div>

          {/* Category */}
          <p className="text-xs font-semibold tracking-widest text-gray-500 mb-3">
            CATEGORY
          </p>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full px-4 mb-5 py-3 rounded-2xl border border-gray-200 bg-[#f5f3ec] text-gray-700 outline-none focus:border-green-500"
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-3.5 rounded-2xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <motion.button
            disabled={loading}
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex-1 py-3.5 rounded-2xl bg-green-600 text-white font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
          {loading ? (
  <Loader className="w-5 h-5 animate-spin" />
) : (
  <>
    <Upload size={18} />
    <span>Upload Grocery</span>
  </>
)}
             
            </motion.button>
          </div>
        </form>

        {/* Live Preview */}
        <div className="w-80 flex-shrink-0">
          <p className="text-xs font-semibold tracking-widest text-gray-500 mb-4">
            LIVE PREVIEW
          </p>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-56 flex items-center justify-center">
              {form.image ? (
                <img
                  src={form.image}
                  alt="product"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Package size={48} className="text-gray-300" />
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-extrabold text-gray-900 mb-1">
                {form.productName || "Product name"}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">
                  {previewPrice}
                  <span className="text-sm font-normal text-gray-400">
                    {" "}/ {form.unit}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}