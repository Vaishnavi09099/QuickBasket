'use client'
import { getSocket } from '@/lib/socket';
import { RootState } from '@/redux/store';
import { Leaf, ShoppingBasket, Smartphone, Truck } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'








const HeroSection = () => {
  



    const slides = [
  {
    id: 1,
    icon: (
      <Leaf className="w-20 h-20 sm:w-28 sm:h-28 text-green-400 drop-shadow-lg" />
    ),
    title: "Fresh Organic Groceries ",
    subtitle:
      "Farm-fresh fruits, vegetables, and daily essentials delivered to you.",
    btnText: "Shop Now",
    bg: "/fresh-organic-groceries.png",
  },
  {
    id: 2,
    icon: (
      <Truck className="w-20 h-20 sm:w-28 sm:h-28 text-yellow-400 drop-shadow-lg" />
    ),
    title: "Fast & Reliable Delivery ",
    subtitle:
      "We ensure your groceries reach your doorstep in no time.",
    btnText: "Order Now",
    bg: "/fastdelivery.png",
  },
  {
    id: 3,
    icon: (
      <Smartphone className="w-20 h-20 sm:w-28 sm:h-28 text-blue-400 drop-shadow-lg" />
    ),
    title: "Shop Anytime, Anywhere ",
    subtitle:
      "Easy and seamless online grocery shopping experience.",
    btnText: "Get Started",
    bg: "/shop-anytime-anywhere.png",
  },
];

const [currSlide,setCurrentSlide] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, 4000);

  return () => clearInterval(timer);
}, [slides.length]);

// ensure we always use a valid slide index
const currentIndex = currSlide % slides.length;
const slide = slides[currentIndex];
  return (
    <>
    <div className='relative w-[95%] mx-auto mt-2 h-[80vh] rounded-3xl overflow-hidden shadow-2xl'>
        <AnimatePresence mode='wait'> 
          <motion.div key={slide.bg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {slide && (
              <Image src={slide.bg} fill alt={slide.title} priority className='object-cover object-top' />
             
            )}
             <div className='absolute inset-0 bg-black/50 backdrop-blur-[1px]'/>
          </motion.div>

          

        </AnimatePresence>
        <div className='absolute inset-0 flex items-center justify-center text-center text-white px-6'>
          <motion.div initial={{y:30 ,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.8}} className='flex flex-col items-center justify-center gap-6 max-w-3xl'>
            <div className='bg-white/10 backdrop-blur-md p-6 rounded-full shadow-1'>
              {slide.icon}
            </div>
            <h1 className='text-2xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter drop-shadow-lg'>{slide.title}</h1>
            <p className='text-lg sm:text-xl text-gray-200 max-w-2xl'>{slide.subtitle}</p>
            <motion.button transition={{duration:0.2}} whileHover={{scale:1.09}} whileTap={{scale:0.76}} className='bg-white text-green-700 hover:bg-green-100 px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 flex items-center gap-2'>
              <ShoppingBasket className='w-5 h-5'/>
              {slide.btnText}
              </motion.button>

          </motion.div>

        </div>
        <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3'>
        {slides.map((_,index)=>(
          <button key={index} className={`w-3 h-3 rounded-full transition-all ${index=== currentIndex ? "bg-white w-6" : "bg-white/50"}`}>

          </button>
        ))}

        </div>

    </div>

    </>
  )
}

export default HeroSection