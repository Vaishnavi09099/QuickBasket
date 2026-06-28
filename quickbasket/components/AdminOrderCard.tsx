"use client"


import { IOrderItem } from '@/models/order.model'
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import {
  Truck, User, Phone, MapPin, CreditCard,
  ChevronDown, ChevronUp, ShoppingBasket,
  UserCheck
} from 'lucide-react'
import axios from 'axios'
import { getSocket } from '@/lib/socket'


const statusOptions: IOrderItem["status"][] = [
  "pending" , "out of delivery" , "delivered"
]

// ✅ "out for delivery" fix kiya
const statusColors: Record<IOrderItem["status"], string> = {
  pending:            "bg-yellow-100 text-yellow-700 border-yellow-300",

 
  "out of delivery": "bg-green-100 text-green-700 border-green-300",
  delivered:          "bg-blue-100 text-blue-700 border-blue-300",

}

const statusDot: Record<IOrderItem["status"], string> = {
  pending:            "bg-yellow-500",
 
  "out of delivery": "bg-green-500",
  delivered:          "bg-blue-500",
 
}

const AdminOrderCard = ({ order }: { order: IOrderItem }) => {
  const [expanded, setExpanded] = useState(false)
  const [status, setStatus] = useState<IOrderItem["status"]>("pending")

  const updateStatus = async (orderId: string, nextStatus: IOrderItem["status"]) => {
    try {
      const res = await axios.post(`/api/admin/status-change/${orderId}`, { status: nextStatus })
      console.log(res.data)
      setStatus(nextStatus)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(()=>{
    setStatus(order.status)
   
    },[order])


  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* Card Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-4">

          {/* Left */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0">
              <ShoppingBasket size={18} className="text-white" />
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2 mb-0.5">
                <h3 className="text-sm font-bold text-green-700">
                  Order #{order._id?.toString().slice(-6)}
                </h3>
                <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border capitalize ${statusColors[status]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot[status]}`} />
                  {status}
                </span>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border capitalize ${
                  order.isPaid
                    ? "bg-green-50 text-green-700 border-green-300"
                    : "bg-red-50 text-red-600 border-red-300"
                }`}>
                  {order.isPaid ? "Paid" : "Unpaid"}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {new Date(order.createdAt!).toLocaleString()}
              </p>
            </div>
          </div>

          
           



          {/* Right — status dropdown */}
          <div className="flex-shrink-0">
            <select
              value={status}
              onChange={(e) => updateStatus(order._id?.toString()!, e.target.value as IOrderItem["status"])}
              className="px-3 py-2 text-xs font-semibold border border-gray-200 rounded-xl bg-white outline-none"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Customer details */}
        {/* Customer details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <User size={13} className="text-green-600 flex-shrink-0" />
            <span>{order.address.fullName ?? "—"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Phone size={13} className="text-green-600 flex-shrink-0" />
            <span>{order.address.mobile ?? "—"}</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-gray-500">
            <MapPin size={13} className="text-green-600 flex-shrink-0 mt-0.5" />
            <span>{order.address?.fullAddress ?? "—"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <CreditCard size={13} className="text-green-600 flex-shrink-0" />
            <span>{order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Truck size={13} className="text-green-600 flex-shrink-0" />
            <span>Delivery: <span className="font-semibold capitalize text-gray-700">{status}</span></span>
          </div>
        </div>

        {/* Assigned Delivery Boy */}
        {order.assignedDeliveryBoy && (
          <div className="mt-3 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <UserCheck size={15} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">
                  {order.assignedDeliveryBoy.name}
                </p>
                <p className="text-xs text-gray-500">
                  +91 {order.assignedDeliveryBoy.mobile}
                </p>
              </div>
            </div>
            <a
              href={`tel:${order.assignedDeliveryBoy.mobile}`}
              className="text-xs font-semibold bg-blue-800 border border-blue-900 text-black px-3 py-1.5 rounded-lg  transition"
            >
              Call
            </a>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs font-medium text-green-700 hover:text-green-800 transition-colors"
        >
          <ShoppingBasket size={13} />
          {expanded ? "Hide items" : `View ${order.items?.length ?? 0} item${order.items?.length !== 1 ? "s" : ""}`}
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Total</p>
          <p className="text-lg font-bold text-green-700">₹{order.totalAmount}</p>
        </div>
      </div>

      {/* Expandable items */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 px-5 py-3 space-y-3">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.quantity} x {item.unit}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    ₹{Number(item.price) * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default AdminOrderCard

