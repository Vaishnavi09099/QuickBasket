"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  ShoppingBasket,
  Package,
  LogOut,
  X,
  PlusCircle,
  PackageSearch,
  ShoppingCart,
  Menu,
  LogOutIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface IUser {
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "admin" | "deliveryBoy";
  img?: string;
}

const Navbar = ({ user }: { user: IUser }) => {
  const [open, setOpen] = useState(false);
  const [searchBarOpen,setSearchBarOpen] = useState(false);
  const [menuOpen,setMenuOpen] = useState(false);
  const {cartData} = useSelector((state:RootState)=>state.cart)
  const router = useRouter();
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => setOpen(false);

    if (open) {
      window.addEventListener("click", handleClick);
    }

    return () => window.removeEventListener("click", handleClick);
  }, [open]);

  // render mobile sidebar inline (avoid portal complexity)

  return (
    <nav className="w-full bg-[#00A63E] shadow-md px-6 py-2 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img
          src="/favicon.ico"
          alt="logo"
          className="w-9 h-9 object-contain"
        />

        <Link
          href="/"
          className="text-2xl font-bold text-white tracking-tight"
        >
          QuickBasket
        </Link>
      </div>

      {/* Search */}
      {user.role == "user" && (<div className="hidden md:flex flex-1 max-w-3xl mx-8">
        <div className="w-full flex items-center bg-white rounded-full px-5 py-2 shadow-sm">
          <Search className="text-gray-500" size={20} />

          <input
            type="text"
            placeholder="Search groceries, fruits, brands..."
            className="flex-1 ml-3 outline-none bg-transparent"
          />
        </div>
      </div>)
      
      
      }




      {/* Right Side */}
      <div className="flex items-center gap-4">

        {user.role=="user" &&( 
          <>
          
         <div  onClick = {()=>setSearchBarOpen((prev)=>!prev)} className="w-11 h-11 md:hidden rounded-full bg-white flex items-center justify-center">
            <Search size={22} />
          </div>
        {/* Cart */}
        <div className="relative cursor-pointer" onClick={() => router.push("/user/cart")}>
          <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center">
            <ShoppingBasket size={22} />
          </div>

          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {cartData.length}
          </span>
        </div>
          </>
          

        )}

       {user.role === "admin" && (<>
  <div className="hidden md:flex items-center gap-4">
    <Link
      href="/admin/add-grocery"
      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2.5 font-medium text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
    >
      <PlusCircle size={18} />
      Add Grocery
    </Link>

    <Link
      href="/admin/view-grocery"
      className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-medium text-gray-700 shadow-md transition-all hover:scale-105 hover:bg-gray-100 hover:shadow-lg"
    >
      <PackageSearch size={18} />
      View Groceries
    </Link>

    <Link
      href="/admin/manage-orders"
      className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 font-medium text-white shadow-md transition-all hover:scale-105 hover:bg-orange-600 hover:shadow-lg"
    >
      <ShoppingCart size={18} />
      Manage Orders
    </Link>
    
  </div>
 <div
  className="md:hidden bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
  onClick={() => setMenuOpen((prev) => !prev)}
>
    <Menu className='text-green-600 w-6 h-6'/>

  </div>
  </>
)}



        {/* User Dropdown */}
        <div className="relative">
          <div
            onClick={(e) => {
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
            className="w-11 h-11 rounded-full bg-orange-500 flex items-center justify-center cursor-pointer overflow-hidden"
          >
            {user?.img ? (
              <img
                src={user.img}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{
                  opacity: 0,
                  scale: 0.95,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  y: -10,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                {/* User Info */}
                <div className="flex items-center gap-3 p-4 border-b">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold overflow-hidden">
                    {user?.img ? (
                      <img
                        src={user.img}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold">{user?.name?.charAt(0)?.toUpperCase()}</span>
                    )}
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-800">{user?.name}</h2>

                    <p className="text-sm text-gray-500">
                      {(["delivery", "deliveryBoy"] as string[]).includes(user?.role as string)
                        ? "deliveryBoy"
                        : user?.role}
                    </p>
                  </div>
                </div>

                {/* Orders */}
               {user.role =="user" &&(
                 <Link
                  href="/user/myOrder"
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 transition-all"
                >
                  <Package
                    size={18}
                    className="text-green-500"
                  />

                  <span className="text-gray-700">
                    My Orders
                  </span>
                </Link>
               )}

                {/* Logout */}
                <button
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition-all text-red-500"
                  onClick={() => {
                    signOut({callbackUrl:"/login"})
                  }}
                >
                  <LogOut size={18} />

                  <span>Log Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {searchBarOpen && 
            

            <motion.div  initial={{
                  opacity: 0,
                  scale: 0.95,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  y: -10,
                }}
                transition={{
                  duration: 0.2,
                }}
                className='fixed top-24 flex left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-full shadow-lg z-40 items-center px-4 py-2'>
                  <Search className='text-gray-500 w-5 h-5 mr-2' />
                  <form className="grow">
                    <input type="text" className="w-full outline-none text-gray-700"></input>
                  </form>
                  <button onClick={()=>setSearchBarOpen(false)}>
                    <X className='text-gray-500 w-5 h-5 ' />
                  </button>



            </motion.div>
            
            
            }


          </AnimatePresence>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type:"spring" ,stiffness:100,damping:14}}
                className="fixed top-0 left-0 h-full w-[70%] md:hidden z-50 bg-gradient-to-b from-green-800/95 via-green-700/85 to-green-900/95 backdrop-blur-xl border-r border-green-400/20 shadow-lg flex flex-col p-6 text-white"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="text-xl font-extrabold">Admin Panel</div>
                 
                  <button
                    aria-label="Close menu"
                    onClick={() => setMenuOpen(false)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20"
                  >
                    <X size={20} />
                  </button>
                </div>
                 <div className="flex items-center gap-4 p-2 rounded-2xl mb-5
                bg-white/10
                backdrop-blur-md
                border border-white/20
                shadow-lg" >
                    <div>
                    <img src={user.img} className='h-10 w-10 rounded-full'></img>
                    </div>
                    <div>
                      <p className='font-bold'>{user.name}</p>
                      <p>Admin</p>
                    </div>
                  </div>
                <nav className="flex flex-col gap-4">
                  <Link href="/" onClick={() => setMenuOpen(false)} className="text-white text-lg">
                    Home
                  </Link>

                  {user.role === "admin" ? (
                    <>
                      <Link href="/admin/add-grocery" onClick={() => setMenuOpen(false)} className="text-white text-lg">
                        Add Grocery
                      </Link>

                      <Link href="/admin/view-grocery" onClick={() => setMenuOpen(false)} className="text-white text-lg">
                        View Groceries
                      </Link>

                      <Link href="/admin/manage-orders" onClick={() => setMenuOpen(false)} className="text-white text-lg">
                        Manage Orders
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/orders" onClick={() => setMenuOpen(false)} className="text-white text-lg">
                        My Orders
                      </Link>
                    </>
                  )}

                  <div className='flex'>
                      <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-red-200 text-left font-bold flex gap-2 mt-[99%]">
                   <LogOutIcon/> <span>Log Out</span>
                  </button>

                  </div>

                
                </nav>
              </motion.div>
            )}
          </AnimatePresence>



        </div>
      </div>
    </nav>
  );
};

export default Navbar;