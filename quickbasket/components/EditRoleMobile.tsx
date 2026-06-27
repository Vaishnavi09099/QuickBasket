"use client";

import { useState, useEffect } from "react";  // ✅ useEffect add kiya
import { ArrowLeft, Phone, ShoppingBag, Bike, Store, Check } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// ✅ Fix 1: useState component ke bahar nahi hota, ye data bahar rakh
const defaultRoles = [
  {
    id: "user",
    title: "Customer",
    description: "Shop fresh groceries",
    icon: ShoppingBag,
  },
  {
    id: "deliveryBoy",
    title: "Delivery Partner",
    description: "Deliver orders, earn daily",
    icon: Bike,
  },
  {
    id: "admin",
    title: "Store Owner",
    description: "Sell on QuickBasket",
    icon: Store,
  },
]

export default function EditRoleMobile() {
  const router = useRouter();
  const [roles, setRoles] = useState(defaultRoles)  // ✅ component ke andar
  const [selectedRole, setSelectedRole] = useState("");
  const [mobile, setMobile] = useState("");
  const { update } = useSession()

  // ✅ Fix 2: useEffect mein call karo
  useEffect(() => {
    const checkForAdmin = async () => {
      try {
        const res = await axios.get("/api/check-for-admin")
        if (res.data.adminExists) {
          setRoles(prev => prev.filter(r => r.id !== "admin"))
        }
      } catch (err) {
        console.log(err)
      }
    }
    checkForAdmin()
  }, [])

  const handleEdit = async () => {
    try {
      const res = await axios.post("/api/user/editRoleMobile", {
        role: selectedRole,
        mobile
      })
      await update({ role: selectedRole })
      router.push("/")
      router.refresh();
      console.log(res.data);
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="min-h-screen bg-gradient-to-r from-green-50 via-[#f7f5eb] to-[#f9e6c9] px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-green-700 font-medium">
        <ArrowLeft size={18} />
        Back
      </Link>

      <div className="max-w-3xl mx-auto mt-5">
        <div className="flex justify-center mb-4">
          <img src="./favicon.ico" className="w-14 h-10" />
        </div>

        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-green-700 font-serif">
            One last step
          </h1>
          <p className="text-gray-600 mt-3 text-md tracking-tight">
            Tell us who you are and how to reach you.
          </p>
        </div>

        <div className="mt-14">
          <h3 className="font-serif text-md font-bold uppercase tracking-wide text-[#36454F] mb-6">
            Choose Your Role
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            {roles.map((role) => {
              const Icon = role.icon;
              const active = selectedRole === role.id;

              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`relative rounded-3xl border p-5 text-left transition-all duration-200 ${
                    active
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 bg-white hover:border-green-300"
                  }`}
                >
                  {active && (
                    <div className="absolute right-4 top-4 h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                      <Check size={18} className="text-white" />
                    </div>
                  )}
                  <div className="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center mb-3">
                    <Icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-black">{role.title}</h4>
                  <p className="text-gray-600 text-sm mt-1">{role.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12">
          <h3 className="font-serif text-md font-bold uppercase tracking-wide text-[#36454F] mb-5">
            Mobile Number
          </h3>
          <div className="flex items-center gap-3 mb-5 rounded-3xl border border-gray-300 bg-white px-5 py-3">
            <Phone className="text-gray-500" size={22} />
            <span className="text-md text-gray-700 border-r pr-4">+91</span>
            <input
              type="tel"
              maxLength={10}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="10-digit mobile number"
              className="w-full outline-none text-md"
            />
          </div>
        </div>

        {/* ✅ Fix 3: duplicate "w-8 w-full" tha, w-8 hataya */}
        <button
          onClick={handleEdit}
          disabled={!selectedRole || mobile.length !== 10}
          className={`w-full rounded-3xl py-3 text-md font-semibold ${
            selectedRole && mobile.length === 10
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Go to Home →
        </button>
      </div>
    </motion.div>
  );
}