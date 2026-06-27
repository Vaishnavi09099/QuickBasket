"use client";

import React, { useEffect,useState, useRef } from "react";
import {
  Apple,
  Milk,
  Wheat,
  Cookie,
  ShoppingCart,
  Soup,
  Coffee,
  HeartPulse,
  Home,
  Package,
  PawPrint,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";



const CategorySlider = () => {
  const categories = [
    {
      name: "Fruits & Vegetables",
      icon: Apple,
      bg: "bg-green-100",
      text: "text-green-600",
    },
    {
      name: "Dairy & Eggs",
      icon: Milk,
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    {
      name: "Rice, Atta & Grains",
      icon: Wheat,
      bg: "bg-yellow-100",
      text: "text-yellow-600",
    },
    {
      name: "Snacks & Biscuits",
      icon: Cookie,
      bg: "bg-orange-100",
      text: "text-orange-600",
    },
    {
      name: "Spices & Masalas",
      icon: Soup,
      bg: "bg-red-100",
      text: "text-red-600",
    },
    {
      name: "Beverages & Drinks",
      icon: Coffee,
      bg: "bg-cyan-100",
      text: "text-cyan-600",
    },
    {
      name: "Personal Care",
      icon: HeartPulse,
      bg: "bg-pink-100",
      text: "text-pink-600",
    },
    {
      name: "Household Essentials",
      icon: Home,
      bg: "bg-indigo-100",
      text: "text-indigo-600",
    },
    {
      name: "Instant & Packaged Food",
      icon: Package,
      bg: "bg-purple-100",
      text: "text-purple-600",
    },
    {
      name: "Baby & Pet Care",
      icon: PawPrint,
      bg: "bg-emerald-100",
      text: "text-emerald-600",
    },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const autoScroll = setInterval(()=>{
         if(!scrollRef.current) return

    const {scrollLeft,scrollWidth,clientWidth} = scrollRef.current
      if((clientWidth+scrollLeft)>=scrollWidth-5){
 scrollRef.current.scrollTo({left:0,behavior:"smooth"})
      }else{
         scrollRef.current.scrollBy({left:300,behavior:"smooth"})

      }

       

    },2000)
    return ()=>clearInterval(autoScroll)

  },[])

  const [showLeft,setShowLeft] = useState<Boolean>()
  const [showRight,setShowRight] = useState<Boolean>()

  const scroll = (direction:"left" |"right")=>{
    if(!scrollRef.current){
        return;

    }
    const scrollAmount = direction =="left" ? -300 : 300
    scrollRef.current.scrollBy({left:scrollAmount,behavior:"smooth"})

  }

  const checkScroll=()=>{
    if(!scrollRef.current) return
    const {scrollLeft,scrollWidth,clientWidth} = scrollRef.current
    setShowLeft(scrollLeft>0)
        setShowRight((clientWidth+scrollLeft)<=scrollWidth-5)
    


  }

  useEffect(()=>{
    scrollRef.current?.addEventListener("scroll",checkScroll)
    return ()=>removeEventListener("scroll",checkScroll)
 


  },[])

return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false, amount: 0.5 }}
      className="mt-10"
    >
      {/* Heading */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <ShoppingCart className="text-green-700" size={30} />
        <h2 className="text-2xl md:text-3xl font-bold text-green-700">
          Shop by Category
        </h2>
      </div>

      {/* Categories + Buttons wrapper */}
      <div className="relative flex items-center w-[90%] mx-auto">
        {showLeft && (
             <button onClick={()=>scroll("left")} className="absolute left-0 z-10 bg-white shadow-lg hover:bg-green-100 rounded-full w-10 h-10 flex items-center justify-center transition-all">
          <ChevronLeft className="w-6 h-6 text-green-700" />
        </button>

        )}
        
        {/* Left Button */}
       

        {/* Categories */}
        <div className="flex gap-6 overflow-x-auto px-12 md:px-14 pb-4 scrollbar-hide scroll-smooth w-full" ref={scrollRef}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                whileHover={{ y: -8, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`min-w-[150px] md:min-w-[180px] h-[160px] rounded-2xl ${cat.bg} shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center`}
              >
                <Icon className={`w-12 h-12 mb-4 ${cat.text}`} />
                <p className="text-center text-sm md:text-base font-semibold text-gray-700 px-2">
                  {cat.name}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Right Button */}
      {showRight &&   <button onClick={()=>scroll("right")} className="absolute right-0 z-10 bg-white shadow-lg hover:bg-green-100 rounded-full w-10 h-10 flex items-center justify-center transition-all">
          <ChevronRight className="w-6 h-6 text-green-700" />
        </button>}

      </div>
    </motion.section>
  );
};

export default CategorySlider;