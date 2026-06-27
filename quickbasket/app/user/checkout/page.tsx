"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, MapPin, CreditCard, Truck,
  User, Phone, Home, Building, Navigation,
  Search, Lock,
  LocateFixed,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import useGetMe from "@/hooks/useGetMe";
import axios from "axios";
const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

type CheckoutUser = {
  _id?: string;
  name?: string;
  username?: string;
  mobile?: string;
  phone?: string;
  user?: {
    name?: string;
    mobile?: string;
  };
};

const CheckoutPage = () => {
  const {cartData,subTotal,deliveryFee,finalTotal} = useSelector((state:RootState)=>state.cart)
  const router = useRouter();
  useGetMe();

  const { userData, loading } = useSelector((state: RootState) => state.user);
  const [searchLoading,setSearchLoading] = useState(false)

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [searchQuery, setSearchQuery] = useState("");
  const [position, setPosition] = useState<[number, number] | null>(null);

  const [address, setAddress] = useState({
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });

  const checkoutUser = userData as CheckoutUser | null;
  const userId = checkoutUser?._id;
  const userFullName =
    checkoutUser?.name ?? checkoutUser?.user?.name ?? checkoutUser?.username ?? "";
  const userMobile =
    checkoutUser?.mobile ?? checkoutUser?.user?.mobile ?? checkoutUser?.phone ?? "";

const handleSearchQuery = async () => {
  setSearchLoading(true)
  const { OpenStreetMapProvider } = await import("leaflet-geosearch");
  const provider = new OpenStreetMapProvider();
  const result = await provider.search({ query: searchQuery });
  if (result && result.length > 0) {
      setSearchLoading(false)
    setPosition([result[0].y, result[0].x]);
  }
};



  // Hook 1 — Geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => console.log("Location error:", err),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    }
  }, []);

  // Hook 2 — Reverse geocoding
  useEffect(() => {
    const fetchAddress = async () => {
      if (!position) return;
      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`
        );
        const addr = res.data.address;
        setAddress((prev) => ({
          ...prev,
          city: addr.city || addr.town || addr.village || addr.municipality || "",
          state: addr.state || "",
          pincode: addr.postcode || "",
       
        }));
        console.log(addr)
      } catch (err) {
        console.log("Reverse geocode error:", err);
      }
    };
    fetchAddress();
  }, [position]);

  // Map rendering is handled in a client-only `MapComponent`

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6EC] flex items-center justify-center">
        <p className="text-green-700 font-semibold text-lg animate-pulse">
          Loading...
        </p>
      </div>
    );
  }


  const handleCurrentLocation = ()=>{
     if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => console.log("Location error:", err),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
  }
}


const handleCod = async ()=>{
  try{
    if(!position) {
      alert("Please select your delivery location.");
      return;
    }

    if(!userId) {
      alert("Please login to place your order.");
      return;
    }

    const res = await axios.post("/api/user/order", {
      userId,
      items: cartData.map((item) => ({
        grocery: item._id,
        name: item.name,
        price: item.price,
        unit: item.unit,
        image: item.image,
        quantity: item.quantity,
      })),
      address: {
        fullName: userFullName,
        mobile: userMobile,
        fullAddress: address.fullAddress,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        latitude: position[0],
        longitude: position[1],
      },
      totalAmount: finalTotal,
      paymentMethod: "cod",
    });

    if(res.status === 201){
     
      router.push("/user/order-success");
    }
  }catch(err){
    console.log(err);
    alert("Failed to place order.");
  }
}


const handleOnlinePayment = async ()=>{
  try{
      if(!position) {
      alert("Please select your delivery location.");
      return;
    }
    if(!userId) {
      alert("Please login to place your order.");
      return;
    }

     const res = await axios.post("/api/user/payment", {
      userId,
      items: cartData.map((item) => ({
        grocery: item._id,
        name: item.name,
        price: item.price,
        unit: item.unit,
        image: item.image,
        quantity: item.quantity,
      })),
      address: {
        fullName: userFullName,
        mobile: userMobile,
        fullAddress: address.fullAddress,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        latitude: position[0],
        longitude: position[1],
      },
      totalAmount: finalTotal,
      paymentMethod,
    });

    window.location.href = res.data.url

  }catch(er){
    console.log(`Online payment error${er}`)
  }
}
  return (
    <div className="min-h-screen bg-[#F8F6EC] py-10">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div
          onClick={() => router.push("/user/cart")}
          className="flex items-center gap-4 mb-8 cursor-pointer"
        >
          <button className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="uppercase text-xs tracking-widest text-gray-500">
              Almost There
            </p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-4xl font-extrabold text-green-950"
            >
              Checkout
            </motion.h1>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-5">
                <MapPin size={20} className="text-green-600 font-bold" />
                <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
              </div>

              <div className="flex items-center gap-3 border border-gray-100 rounded-xl px-4 py-3 mb-3 bg-gray-50">
                <User size={16} className="text-green-600 shrink-0" />
                <input
                  type="text"
                  value={userFullName}
                  readOnly
                  placeholder="Full Name"
                  className="bg-transparent w-full text-sm text-gray-800 outline-none cursor-not-allowed"
                />
              </div>

              <div className="flex items-center gap-3 border border-gray-100 rounded-xl px-4 py-3 mb-3 bg-gray-50">
                <Phone size={16} className="text-green-600 shrink-0" />
                <input
                  type="text"
                  value={userMobile}
                  readOnly
                  placeholder="Mobile Number"
                  className="bg-transparent w-full text-sm text-gray-800 outline-none cursor-not-allowed"
                />
              </div>

              <div className="flex items-center gap-3 border border-gray-100 rounded-xl px-4 py-3 mb-3 bg-gray-50">
                <Home size={16} className="text-green-600 shrink-0" />
                <input
                  type="text"
                  value={address.fullAddress}
                  placeholder="Full Address"
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, fullAddress: e.target.value }))
                  }
                  className="bg-transparent w-full text-sm text-gray-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="flex items-center gap-2 border border-gray-100 rounded-xl px-3 py-2.5 bg-gray-50">
                  <Building size={14} className="text-green-600 shrink-0" />
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) =>
                      setAddress((prev) => ({ ...prev, city: e.target.value }))
                    }
                    className="bg-transparent w-full text-xs text-gray-800 outline-none"
                    placeholder="City"
                  />
                </div>
                <div className="flex items-center gap-2 border border-gray-100 rounded-xl px-3 py-2.5 bg-gray-50">
                  <Navigation size={14} className="text-green-600 shrink-0" />
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) =>
                      setAddress((prev) => ({ ...prev, state: e.target.value }))
                    }
                    className="bg-transparent w-full text-xs text-gray-800 outline-none"
                    placeholder="State"
                  />
                </div>
                <div className="flex items-center gap-2 border border-gray-100 rounded-xl px-3 py-2.5 bg-gray-50">
                  <Search size={14} className="text-green-600 shrink-0" />
                  <input
                    type="text"
                    value={address.pincode}
                    onChange={(e) =>
                      setAddress((prev) => ({ ...prev, pincode: e.target.value }))
                    }
                    className="bg-transparent w-full text-xs text-gray-800 outline-none"
                    placeholder="Pincode"
                  />
                </div>
              </div>

            <div className="flex gap-2">
  <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50">
    <Search size={16} className="text-gray-400 shrink-0" />
    <input
      type="text"
      placeholder="Search city or area..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSearchQuery()}
      className="bg-transparent w-full text-sm text-gray-600 outline-none"
    />
  </div>
  <button
    onClick={handleSearchQuery}
    disabled={searchLoading}
    className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
  >
    {searchLoading ? (
      <Loader2 size={16} className="animate-spin" />
    ) : (
      <>
        <Search size={16} />
        Search
      </>
    )}
  </button>
</div>

            </div>

            {/* Map div — Leaflet yahan mount hoga */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl relative h-64">
              {!position && (
                <div className="h-full w-full flex items-center justify-center bg-gray-50">
                  <p className="text-sm text-gray-400 animate-pulse">
                    Fetching your location...
                  </p>
                </div>
              )}
              <MapComponent position={position} onDragEnd={setPosition} />
              <motion.button onClick={handleCurrentLocation} whileTap={{scale:0.93}} className='absolute bottom-4 right-4 bg-green-600 text-white rounded-full p-3 hover:bg-green-700 transition-all flex items-center justify-center z-500'>
                <LocateFixed size={22}/>
              </motion.button>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div  initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }} className="space-y-4 ">
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={20} className="text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
              </div>

              <div
                onClick={() => setPaymentMethod("online")}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer mb-3 transition-all ${
                  paymentMethod === "online"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-100 bg-gray-50 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <CreditCard size={18} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Pay Online (Stripe)</p>
                    <p className="text-xs text-gray-500">Cards · UPI · Wallets</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === "online" ? "border-green-600" : "border-gray-300"
                }`}>
                  {paymentMethod === "online" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
                  )}
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod("cod")}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-100 bg-gray-50 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                    <Truck size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">Pay when it arrives at your door</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === "cod" ? "border-green-600" : "border-gray-300"
                }`}>
                  {paymentMethod === "cod" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
                  )}
                </div>
              </div>

          

              <div className="border-t border-gray-100 mt-5 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subTotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-medium">
                    {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-1">
                  <span>Final Total</span>
                  <span className="text-green-600">₹{finalTotal}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={()=>{
                  if(paymentMethod=="cod"){
                    handleCod()
                  }else{
                   handleOnlinePayment()
                  }
                }}
                className="w-full mt-5 bg-green-600 text-white py-3 rounded-2xl font-bold text-base flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
              >
                <Lock size={18} />
               {paymentMethod == "cod" ? "Place Order" : "Pay & Place Order"}
              </motion.button>
              
            </div>

           
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
