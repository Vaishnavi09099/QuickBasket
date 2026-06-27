'use client';
import React from "react";
import {
  Clock3,
  Leaf,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";
type WelcomeProps = {
  nextStep?: (s: number) => void;
};

const Welcome = ({ nextStep = () => {} }: WelcomeProps) => {
  return (
    <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:0.6}} className="w-full min-h-screen px-12 py-6">

      {/* Navbar */}
      <nav className="flex items-center mb-5 ml-18">
        <div className="w-14 h-14 flex items-center justify-center">
          <img
            src="/favicon.ico"
            alt="Logo"
            className="w-8 h-6"
          />
        </div>

        <h1 className="text-2xl font-extrabold text-[#0b1b0b]">
          QuickBasket
        </h1>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

        {/* Left Section */}
        <div className="space-y-8">

         

          <div>
            <h1 className="text-6xl lg:text-7xl mt-4 font-extrabold leading-tight tracking-tight text-[#0f2612]">
              Fresh groceries,
            </h1>

            <h1 className="text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-green-600">
              at your doorstep.
            </h1>
          </div>

          <motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.3}}  className="text-gray-600 text-xl leading-wide max-w-xl">
            Skip the queues. QuickBasket delivers handpicked produce,
            pantry staples, and daily essentials — straight from local
            farms to your kitchen.
          </motion.p>

          <div className="flex items-center gap-5">
            <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.2 }}
  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full flex items-center gap-3 text-lg font-semibold cursor-pointer"
    onClick={() => nextStep(2)}
>
  Next

  <motion.span
    className="bg-white/20 p-2 rounded-full"
    whileHover={{ x: 6 }}
    transition={{ duration: 0.2 }}
  >
    <ArrowRight size={20} />
  </motion.span>
</motion.button>

           
          </div>

          {/* Stats */}
          <div className="flex gap-20 pt-5">

            <div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-3">
                <Clock3 size={20}/>
              </div>

              <h3 className="text-xl font-bold">
                30 min
              </h3>

              <p className="text-gray-500">
                avg. delivery
              </p>
            </div>

            <div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-3">
                <Leaf size={20}/>
              </div>

              <h3 className="text-xl font-bold">
                100%
              </h3>

              <p className="text-gray-500">
                farm fresh
              </p>
            </div>

            <div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-3">
                <ShieldCheck size={20}/>
              </div>

              <h3 className="text-xl font-bold">
                Top Quality
              </h3>

              <p className="text-gray-500">
                Pure Freshness
              </p>
            </div>

          </div>
        </div>

        {/* Right Section */}
        <div className="relative">

          {/* Floating Card */}
         <motion.div
  animate={{
    y: [0, -12, 0],
  }}
  transition={{
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  className="absolute -top-5 left-4 bg-white rounded-3xl shadow-lg px-5 py-4 flex items-center gap-4 z-10"
>
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
              <Clock3 size={20}/>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Arriving in
              </p>

              <h3 className="font-bold text-xl">
                18 min
              </h3>
            </div>
          </motion.div>

          {/* Main Image */}
          <div className="overflow-hidden rounded-[40px] shadow-xl">
            <img
              src="/right_bg.png"
              alt="Groceries"
              className="w-full h-[550px] object-cover"
            />
          </div>

          {/* Bottom Card */}
          <motion.div
  animate={{
    y: [0, 12, 0],
  }}
  transition={{
    duration: 3.5,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  className="absolute bottom-4 right-4 bg-white rounded-3xl shadow-lg px-6 py-4 flex items-center gap-4"
> 
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <Leaf size={20}/>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Today's pick
              </p>

              <h3 className="font-bold text-xl">
                Organic 🥬
              </h3>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default Welcome;