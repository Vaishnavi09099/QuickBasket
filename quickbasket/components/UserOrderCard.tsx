"use client"
import { IOrderItem } from '@/models/order.model'
import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { 
  CreditCard, MapPin, Package, 
  ChevronDown, ChevronUp, Truck 
} from 'lucide-react'

const paymentStatusStyles: Record<string, string> = {
  unpaid: "bg-red-100 text-red-700 border-red-300",
  paid:   "bg-green-100 text-green-700 border-green-300",
}

const deliveryStatusStyles: Record<string, string> = {
  "pending":         "text-amber-600",
  "delivered":       "text-green-600",
  "out of delivery": "text-blue-600",
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-300"
    case "out of delivery":
      return "bg-blue-100 text-blue-700 border-blue-300"
    case "delivered":
      return "bg-green-100 text-green-700 border-green-300"
    default:
      return "bg-gray-100 text-gray-600 border-gray-300"
  }
}

const UserOrderCard = ({ order }: { order: IOrderItem }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-md 
                 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center 
                      justify-between gap-3 border-b border-gray-100 
                      px-5 py-4 bg-gradient-to-r from-green-50 to-white">
        <div>
          <h3 className="text-sm font-bold text-green-800">
            order #{order._id?.toString().slice(-6)}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date(order.createdAt!).toLocaleString()}
          </p>
        </div>

        {/* Status badges */}
        <div className="flex gap-2">
          <span className={`text-xs font-medium px-2.5 py-1 
                            rounded-full border capitalize
                            ${order.isPaid
                              ? paymentStatusStyles["paid"]
                              : paymentStatusStyles["unpaid"]}`}>
            {order.isPaid ? "Paid" : "Unpaid"}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 
                            rounded-full border capitalize
                            ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-2">

        {/* Payment method */}
        {order.paymentMethod === "cod" ? (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Truck size={13} className="text-green-600 flex-shrink-0" />
            <span>Cash on Delivery</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <CreditCard size={13} className="text-green-600 flex-shrink-0" />
            <span>Online Payment</span>
          </div>
        )}

        {/* Address */}
        <div className="flex items-start gap-2 text-xs text-gray-500">
          <MapPin size={13} 
                  className="text-green-600 flex-shrink-0 mt-0.5" />
          <span>{order.address.fullAddress}</span>
        </div>

        {/* Toggle items */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs font-medium
                     text-green-700 mt-2 hover:text-green-800 
                     transition-colors pt-1"
        >
          <Package size={13} />
          {expanded ? "Hide Order Items" : "Show Order Items"}
          {expanded
            ? <ChevronUp size={13} />
            : <ChevronDown size={13} />
          }
        </button>
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
              {order.items.map((item, index) => (
                <div key={index}
                     className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 
                                    flex items-center justify-center 
                                    overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.quantity} x {item.unit}
                      </p>
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

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 
                      bg-gray-50 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <Package
            size={13}
            className={deliveryStatusStyles[order.status] ?? "text-gray-400"}
          />
          <span className={`text-xs font-medium capitalize
                            ${deliveryStatusStyles[order.status] 
                              ?? "text-gray-400"}`}>
            Delivery: {order.status}
          </span>
        </div>
        <p className="text-sm font-bold text-gray-900">
          Total: ₹{order.totalAmount}
        </p>
      </div>
    </motion.div>
  )
}

export default UserOrderCard