"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PackageSearch } from "lucide-react";
import { motion } from "motion/react";
import axios from "axios";
import { IOrderItem } from "@/models/order.model";
import UserOrderCard from "@/components/UserOrderCard";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<IOrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getMyOrders = async () => {
      try {
        const res = await axios.get("/api/user/my-orders")
        setOrders(res.data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    getMyOrders()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 
                      via-yellow-50 to-[#FFF9E6]">
        <div className="max-w-3xl mx-auto px-4 py-10">
          {/* Header skeleton */}
          <div className="mb-10">
            <div className="w-24 h-8 bg-gray-200 rounded-full 
                            animate-pulse mb-5" />
            <div className="w-28 h-3 bg-gray-200 rounded-full 
                            animate-pulse mb-3" />
            <div className="w-48 h-10 bg-gray-200 rounded-xl 
                            animate-pulse mb-2" />
            <div className="w-72 h-3 bg-gray-200 rounded-full 
                            animate-pulse" />
          </div>
          {/* Skeleton cards */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm 
                                      border border-gray-100 
                                      overflow-hidden animate-pulse">
                <div className="px-5 pt-5 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="w-28 h-4 bg-gray-200 
                                      rounded-full mb-2" />
                      <div className="w-36 h-3 bg-gray-100 
                                      rounded-full" />
                    </div>
                    <div className="flex gap-2">
                      <div className="w-16 h-6 bg-gray-200 rounded-full" />
                      <div className="w-16 h-6 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-2 mt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-200 rounded-full" />
                      <div className="w-32 h-3 bg-gray-100 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-200 rounded-full" />
                      <div className="w-64 h-3 bg-gray-100 rounded-full" />
                    </div>
                  </div>
                  <div className="w-32 h-3 bg-gray-100 
                                  rounded-full mt-4" />
                </div>
                <div className="flex items-center justify-between 
                                px-5 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="w-24 h-3 bg-gray-200 rounded-full" />
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-3 bg-gray-200 rounded-full" />
                    <div className="w-20 h-7 bg-gray-200 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 
                    via-yellow-50 to-[#FFF9E6] w-full">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-sm text-gray-600 
                         bg-white border border-gray-200 px-4 py-2 
                         rounded-full shadow-sm hover:bg-gray-50 
                         transition-colors mb-5"
            >
              <ArrowLeft size={15} />
              Home
            </button>
            <p className="text-xs font-semibold tracking-widest 
                          text-green-700 uppercase mb-1">
              Your Journey
            </p>
            <motion.h1  initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }} className="text-5xl font-extrabold text-green-950 mb-2">
              My Orders
            </motion.h1>
            <p className="text-gray-500 text-sm">
              Track every order in real time. Stay updated from 
              confirmation to delivery.
            </p>
          </div>
        </div>

        {/* Orders list */}
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <PackageSearch size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm font-medium">
              No orders yet!
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Start shopping to view your orders here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <UserOrderCard order={order} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrdersPage