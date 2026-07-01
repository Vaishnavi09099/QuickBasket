'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { ArrowLeft, ArrowUpRight, ChevronDown, IndianRupee, Package, Settings, Sparkles, Truck, Users } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import Link from 'next/link'

type propType = {
  earning: {
    today: number,
    sevenDays: number,
    total: number
  },
  stats: {
    title: string;
    value: number;
  }[],
  chartData: {
    day: string;
    orders: number;
  }[]
}

const FILTERS = [
  { key: "total", label: "Total" },
  { key: "sevenDays", label: "Last 7 Days" },
  { key: "today", label: "Today" },
] as const

const STAT_THEME = [
  { bg: "bg-emerald-100", icon: "text-emerald-700", icon_el: Package },
  { bg: "bg-sky-100", icon: "text-sky-700", icon_el: Users },
  { bg: "bg-orange-100", icon: "text-orange-600", icon_el: Truck },
  { bg: "bg-violet-100", icon: "text-violet-700", icon_el: IndianRupee },
]

function AdminDashboardClient({ earning, stats, chartData }: propType) {

  const [filter, setFilter] = useState<"today" | "sevenDays" | "total">("total")
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const currenEarning = filter === "today" ? earning.today
    : filter === "sevenDays" ? earning.sevenDays
      : earning.total

  const title = filter === "today" ? "Today's Earning"
    : filter === "sevenDays" ? "Last 7 Days Earning"
      : "Total Earning"

  const badge = filter === "today" ? "TODAY" : filter === "sevenDays" ? "7 DAYS" : "TOTAL"

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50'>
      <div className='pt-10 pb-20 w-[90%] md:w-[80%] mx-auto'>


        {/* Heading row */}
        <div className='flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className='text-xs font-bold tracking-[0.2em] text-emerald-600 mb-2'>OVERVIEW</p>
            <h1 className='font-serif text-4xl md:text-5xl font-bold text-emerald-950 leading-tight'>
              Admin Dashboard
            </h1>
            <p className='text-gray-500 mt-3 max-w-md'>
              Live snapshot of earnings, orders, and customer activity across QuickBasket.
            </p>
          </motion.div>

          {/* Custom dropdown */}
          <div className='relative shrink-0'>
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className='flex items-center justify-between gap-8 bg-white border border-emerald-200 rounded-2xl px-5 py-3 text-sm font-semibold text-gray-800 shadow-sm min-w-[180px]'
            >
              {FILTERS.find(f => f.key === filter)?.label}
              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <>
                  <div
                    className='fixed inset-0 z-10'
                    onClick={() => setDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className='absolute right-0 mt-2 w-full min-w-[180px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20'
                  >
                    {FILTERS.map((f) => (
                      <button
                        key={f.key}
                        onClick={() => {
                          setFilter(f.key)
                          setDropdownOpen(false)
                        }}
                        className={`w-full flex items-center justify-between px-5 py-3 text-sm font-semibold transition-colors
                          ${filter === f.key
                            ? "bg-emerald-600 text-white"
                            : "text-gray-700 hover:bg-gray-50"}`}
                      >
                        {f.label}
                        {filter === f.key && <span className='w-1.5 h-1.5 rounded-full bg-white' />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Earning card */}
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden bg-gradient-to-br from-emerald-100 via-emerald-50 to-teal-50 border border-emerald-200/60 shadow-sm rounded-3xl p-8 text-center mb-10"
        >
          <span className='inline-flex items-center gap-1.5 bg-white/80 text-emerald-700 text-xs font-bold tracking-wider px-3 py-1.5 rounded-full mb-5'>
            <ArrowUpRight size={12} />
            {badge}
          </span>
          <h2 className='text-lg font-semibold text-emerald-800 mb-2'>{title}</h2>
          <p className=' text-5xl md:text-6xl font-bold text-emerald-950 flex items-center justify-center gap-1'>
            <IndianRupee className='w-10 h-10 md:w-12 md:h-12' strokeWidth={2.5} />
            {currenEarning.toLocaleString()}
          </p>
          <p className='text-emerald-700 text-sm font-medium mt-3 flex items-center justify-center gap-1'>
            <ArrowUpRight size={14} />
            All-time platform earnings
          </p>
        </motion.div>

    {/* Stat cards */}
<div className='grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10'>
  {stats.map((s, i) => {
    const theme = STAT_THEME[i % STAT_THEME.length]
    const Icon = theme.icon_el
    return (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.08 }}
        className="bg-white/70 backdrop-blur border border-gray-100 shadow-sm rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all"
      >
        <div className={`${theme.bg} p-3 rounded-xl shrink-0`}>
          <Icon className={`${theme.icon} w-6 h-6`} />
        </div>
        <div>
          <p className="text-gray-500 text-sm">{s.title}</p>
          <p className="text-2xl font-bold text-gray-900">{s.value}</p>
        </div>
      </motion.div>
    )
  })}
</div>

        {/* Chart */}
        <div className='bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-8'>
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-3'>
              <div className='bg-emerald-100 w-10 h-10 rounded-xl flex items-center justify-center'>
                <Package className='text-emerald-700 w-5 h-5' />
              </div>
              <div>
                <h2 className='font-serif text-lg font-bold text-gray-900'>Orders Overview</h2>
                <p className='text-xs text-gray-500'>Last 7 Days</p>
              </div>
            </div>
            <div className='flex items-center gap-1.5 text-xs font-semibold text-gray-600'>
              <span className='w-2 h-2 rounded-full bg-emerald-500' />
              Orders
            </div>
          </div>
      <ResponsiveContainer width="100%" height={300}>
  <BarChart data={chartData}>
    <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
    <XAxis dataKey="day" />
    <Tooltip />
    <Bar dataKey="orders" fill="#16A34A" radius={[3, 3, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
        </div>

      </div>
    </div>
  )
}

export default AdminDashboardClient