'use client'

import { addToCart, decreaseQuantity, increaseQuantity } from '@/redux/cartSlice'
import { AppDispatch } from '@/redux/store'
import { RootState } from "@/redux/store";
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'




interface IGrocery {
  _id: string
  name: string
  price: number
  category: string
  image: string
  unit: string
  isAvailable: boolean
  createdAt?: Date
  updatedAt?: Date
}

function GroceryItemCard({ item }: { item: IGrocery }) {

  const dispatch = useDispatch<AppDispatch >();
  const {cartData} = useSelector((state:RootState)=>state.cart)
  const cartItem = cartData.find(i=>i._id == item._id)


  return (

    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false, amount: 0.3 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 group overflow-hidden relative flex flex-col"
    >
      {/* Image Section */}
      <div className="relative w-full h-48 bg-gray-50">
        <Image
          src={item.image}
          fill
          alt={item.name}
          className="object-cover"
        />
         <div className='absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300'>

        </div>
      
       
      </div>
       

      {/* Content Section */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        {/* Category */}
        <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
          {item.category}
        </span>

        {/* Name */}
        <h3 className="text-base font-semibold text-gray-800 leading-snug line-clamp-2">
          {item.name}
        </h3>

        {/* Price + Unit */}
        <div className="mt-auto pt-3 flex items-end justify-between">
          <div>
            <span className="text-lg font-bold text-emerald-600">
              ₹{item.price.toString()}
            </span>
            <span className="text-xs text-gray-400 ml-1">/ {item.unit}</span>
          </div>



    {!cartItem ? <motion.button onClick={()=>dispatch(addToCart({...item,quantity:1}))} whileTap={{scale:0.96}}
  className='mt-4 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full py-2 px-4 text-sm font-medium transition-all'
>
  <ShoppingCart />
  Add to Cart
</motion.button> :<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
  className="mt-4 flex items-center justify-between bg-green-50 border border-green-200 rounded-full px-2 py-2"
>
  <button   onClick={()=>dispatch(decreaseQuantity(item._id))}
    className="h-6 w-6 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-red-50 transition"
  >
    <Minus size={16} />
  </button>

  <span className="font-semibold text-gray-800 text-lg min-w-8 text-center">
    {cartItem.quantity}
  </span>

  <button onClick={()=>dispatch(increaseQuantity(item._id))}
    className="h-6 w-6 flex items-center justify-center rounded-full bg-green-600 text-white shadow-sm hover:bg-green-700 transition"
  >
    <Plus size={16} />
  </button>
</motion.div>}

          {/* Add Button */}
          
        </div>
      </div>
    </motion.div>
  )
}

export default GroceryItemCard