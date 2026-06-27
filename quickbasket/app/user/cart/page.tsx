"use client";

import React from "react";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBasket,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "@/redux/cartSlice";

const CartPage = () => {
  const { cartData, subTotal, finalTotal, deliveryFee } = useSelector(
    (state: RootState) => state.cart
  );
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const savings = cartData.reduce(
    (acc, item) => acc + (item.price- item.price) * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#F8F6EC] py-10">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-4 mb-8 cursor-pointer"
        >
          <button className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="uppercase text-xs tracking-widest text-gray-500">
              Your Basket
            </p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-4xl font-extrabold text-green-950"
            >
              Shopping Cart
            </motion.h1>
          </div>
        </div>

        {cartData.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <ShoppingBasket size={80} className="text-green-600 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
            <p className="text-gray-500 max-w-md mb-6">
              Your cart is empty. Add some groceries to continue shopping.
            </p>
            <Link
              href="/"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition"
            >
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_380px] gap-8">

            {/* Left */}
            <div>
            
              

              {/* Cart Items */}
              <div className="space-y-5">
                <AnimatePresence>
                  {cartData.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white rounded-3xl p-5 shadow-sm flex justify-between items-center"
                    >
                      <div className="flex gap-5">
                       <div className="w-24 h-24 rounded-3xl bg-green-100 flex items-center justify-center overflow-hidden">
  <img
    src={item.image}
    alt={item.name}
    className="w-full h-full object-cover rounded-3xl"
  />
</div>
                        <div>
                          <h3 className="text-lg font-bold text-green-950">
                            {item.name}
                          </h3>
                          <p className="text-gray-500 mb-2">{item.unit}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-green-950">
                              ₹{Number(item.price * item.quantity)}
                            </span>
                           
                          </div>
                         
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-6">
                        <button onClick={() => dispatch(removeFromCart(item._id))}>
                          <Trash2 size={20} className="text-gray-500 hover:text-red-500 transition-all" />
                        </button>

                        <div className="flex items-center  border shadow-md rounded-full overflow-hidden">
                          <button
                            onClick={() => dispatch(decreaseQuantity(item._id))}
                            className="w-8 h-8 flex items-center justify-center"
                          >
                            <Minus size={18} />
                          </button>
                          <span className="px-5 font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => dispatch(increaseQuantity(item._id))}
                            className="w-8 h-8 bg-green-600 text-white flex items-center justify-center"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm h-fit sticky top-5"
            >
              <div className="bg-green-600 text-white p-8">
                <p className="uppercase tracking-[4px] text-xs">
                  Order Summary
                </p>
                <h2 className="text-5xl font-bold mt-2">₹{finalTotal}</h2>
               
              </div>

              <div className="p-8">
              
              

                <div className="space-y-4 border-b pb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subTotal}</span>
                  </div>
                
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                </div>

                <div className="flex justify-between mt-6 text-2xl font-bold">
                  <span>Final Total</span>
                  <span className="text-green-600">₹{finalTotal}</span>
                </div>

                <motion.button onClick={()=>router.push("/user/checkout")} whileTap={{scale:0.95}} className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-3 rounded-full text-md font-semibold">
                  Proceed to Checkout →
                </motion.button>

              
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;