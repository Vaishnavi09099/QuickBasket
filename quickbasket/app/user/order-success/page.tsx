"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";

const OrderSuccessPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white flex items-center justify-center px-4">

         <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
    <div className="absolute top-20 left-[10%] w-2 h-2 bg-green-400 rounded-full animate-bounce" />
    <div className="absolute top-32 left-[30%] w-2 h-2 bg-green-400 rounded-full animate-pulse" />
    <div className="absolute top-16 left-[70%] w-2 h-2 bg-green-400 rounded-full animate-pulse" />
    <div className="absolute top-28 left-[85%] w-2 h-2 bg-green-300 rounded-full animate-bounce" />
    <div className="absolute top-10 left-[20%] w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
    <div className="absolute top-36 left-[60%] w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" />
    {/* Bottom side bhi */}
    <div className="absolute bottom-20 left-[15%] w-2 h-2 bg-green-300 rounded-full animate-bounce" />
    <div className="absolute bottom-32 left-[35%] w-2 h-2 bg-green-400 rounded-full animate-pulse" />
    <div className="absolute bottom-16 left-[75%] w-3 h-3 bg-green-300 rounded-full animate-bounce" />
    <div className="absolute bottom-24 left-[90%] w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
  </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", damping: 10, stiffness: 100 }}
        className="bg-white rounded-3xl shadow-xl px-10 py-12 w-100 flex flex-col items-center text-center"
      >
        {/* Animated checkmark with pulse rings */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="mb-6 relative flex items-center justify-center w-24 h-24"
        >
          {/* Ring 1 */}
          <motion.div
            className="absolute inset-0 blur-lg rounded-full bg-green-200"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0.3, 0, 0.3], scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Ring 2 */}
          <motion.div
            className="absolute inset-0 blur-lg rounded-full bg-green-200"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0.2, 0, 0.2], scale: [1, 1.8, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
          <CheckCircle size={80} className="text-green-600 relative z-10" strokeWidth={1.5} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-extrabold text-green-950 mb-3"
        >
          Order Placed Successfully
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-gray-500 leading-relaxed mb-8"
        >
          Thank you for shopping with us! Your order has been placed and is being
          processed. You can track its progress in your{" "}
          <span className="text-green-600 font-semibold">My Orders</span> section.
        </motion.p>

        {/* Box icon */}
        <motion.div
          initial={{ opacity:0,y:40 }}
          animate={{ opacity:1, y:[0,-10,0]}}
          transition={{ delay: 1,duration:2,repeat:Infinity,ease:"easeInOut"}}
          className="mb-8"
        >
          <ShoppingBag size={48} className="text-green-600" strokeWidth={1.5} />
        </motion.div>

        {/* Button */}
        <motion.button
          onClick={() => router.push("/user/myOrder")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-full bg-green-600 text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
        >
          Go to My Orders
          <ArrowRight size={18} />
        </motion.button>

        {/* Back to home */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => router.push("/")}
         
          className="mt-4 text-xs text-gray-400 cursor-pointer hover:text-green-600 transition-colors"
        >
          ← Back to Home
        </motion.p>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;