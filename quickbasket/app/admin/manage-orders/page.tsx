'use client'

import { IOrderItem } from '@/models/order.model'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Sparkles, Package, Clock,
  Truck, IndianRupee, Search
} from 'lucide-react'
import AdminOrderCard from '@/components/AdminOrderCard'
import { getSocket } from '@/lib/socket'


const filterTabs = [
  "All", "Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"
]

const ManageOrders = () => {
  const router = useRouter()
  const [orders, setOrders] = useState<IOrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await axios.get("/api/admin/get-orders")
        setOrders(res.data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    getOrders()
    // listen for real-time new orders
    const socket = getSocket()
    socket?.on("new-order", (newOrder: IOrderItem) => {
      setOrders((prev) => [newOrder, ...prev])
    })

    return () => {
      socket?.off("new-order")
    }
  }, [])



  // Metrics
  const total   = orders.length
  const pending = orders.filter((o) => o.status === "pending").length
  const active  = orders.filter((o) =>
    ["preparing", "out of delivery"].includes(o.status)
  ).length
  const revenue = orders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0)

  // Filter + search
  const filtered = orders.filter((o) => {
    const matchFilter =
      activeFilter === "All" ||
      o.status.toLowerCase() === activeFilter.toLowerCase()

    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      o._id?.toString().includes(q) ||
      o.address.fullName.toLowerCase().includes(q) ||
      o.address.mobile.includes(q)

    return matchFilter && matchSearch
  })

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 
                      via-yellow-50 to-[#FFF9E6]">
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
          <div className="w-32 h-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-56 h-10 bg-gray-200 rounded-xl animate-pulse" />
          <div className="grid grid-cols-4 gap-3 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-2xl 
                                      animate-pulse" />
            ))}
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-white rounded-2xl 
                                    animate-pulse border border-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 
                    via-yellow-50 to-[#FFF9E6]">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-sm text-gray-600 
                         bg-white border border-gray-200 px-4 py-2 
                         rounded-full shadow-sm hover:bg-gray-50 
                         transition-colors mb-4"
            >
              <ArrowLeft size={15} />
              Home
            </button>
            <p className="text-xs font-semibold tracking-widest 
                          text-green-700 uppercase mb-1">
              Operations
            </p>
            <h1 className="text-5xl font-extrabold text-green-950 mb-1">
              Manage Orders
            </h1>
            <p className="text-gray-500 text-sm">
              Update status, view customer details, and keep every 
              basket moving.
            </p>
          </div>

         
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "TOTAL",   value: total,   icon: Package,     bg: "bg-green-50" },
            { label: "PENDING", value: pending, icon: Clock,       bg: "bg-amber-50" },
            { label: "ACTIVE",  value: active,  icon: Truck,       bg: "bg-sky-50" },
            {
              label: "REVENUE",
              value: `₹${revenue.toLocaleString()}`,
              icon: IndianRupee,
              bg: "bg-emerald-50",
            },
          ].map((m) => (
            <div
              key={m.label}
              className={`${m.bg} rounded-2xl p-4 border border-white shadow-sm`}
            >
              <div className="w-8 h-8 rounded-lg bg-white flex items-center 
                              justify-center mb-3 shadow-sm">
                <m.icon size={15} className="text-green-700" />
              </div>
              <p className="text-xs font-semibold tracking-widest 
                            text-gray-500 mb-1">
                {m.label}
              </p>
              <p className="text-2xl font-bold text-green-950">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="bg-white rounded-2xl border border-gray-100 
                        shadow-sm px-5 py-4 mb-5">
          <div className="flex items-center gap-2 border border-gray-200 
                          rounded-xl px-4 py-2.5 mb-4">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by order id, customer, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm text-gray-700 outline-none 
                         bg-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium 
                            transition-colors
                            ${activeFilter === tab
                              ? "bg-green-600 text-white"
                              : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Orders list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order, i) => (
              <AdminOrderCard
                key={i}
                order={order}
            
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageOrders