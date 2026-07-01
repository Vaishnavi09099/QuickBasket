'use client'
import LiveMap from '@/components/LiveMap'
import { getSocket } from '@/lib/socket'
import { IUser } from '@/models/user.model'
import { RootState } from '@/redux/store'
import axios from 'axios'
import { ArrowLeft, Loader, Send, Sparkle } from 'lucide-react'

import { useParams, useRouter } from 'next/navigation'
import {AnimatePresence, motion} from "motion/react"
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { IMessage } from '@/models/message.model'
interface IOrder {
    _id?: string
    user: string
    items: [
        {
            grocery: string,
            name: string,
            price: string,
            unit: string,
            image: string
            quantity: number
        }
    ]
    ,
    isPaid: boolean
    totalAmount: number,
    paymentMethod: "cod" | "online"
    address: {
        fullName: string,
        mobile: string,
        city: string,
        state: string,
        pincode: string,
        fullAddress: string,
        latitude: number,
        longitude: number
    }
    assignment?: string
    assignedDeliveryBoy?: IUser
    status: "pending" | "out of delivery" | "delivered",
    createdAt?: Date
    updatedAt?: Date
}
interface ILocation {
  latitude: number,
  longitude: number
}
function TrackOrder({params}:{params:{orderId:string}}) {
const {userData}=useSelector((state:RootState)=>state.user)
const {orderId}=useParams()
const [order,setOrder]=useState<IOrder>()
const router=useRouter()
const [newMessage,setNewMessage]=useState("")
const [messages,setMessages]=useState<IMessage[]>()
const chatBoxRef=useRef<HTMLDivElement>(null)
  const [loading,setLoading]=useState(false)
   const [suggestions, setSuggestions] = useState([])
const [userLocation, setUserLocation] = useState<ILocation>(
    {
      latitude: 0,
      longitude: 0
    }
  )
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0
  })

useEffect(()=>{
const getOrder=async ()=>{
  try {
    const result=await axios.get(`/api/user/get-order/${orderId}`)
    setOrder(result.data)
    setUserLocation({
      latitude:result.data.address.latitude,
      longitude:result.data.address.longitude
    })
    setDeliveryBoyLocation({
      latitude:result.data.assignedDeliveryBoy.location.coordinates[1],
      longitude:result.data.assignedDeliveryBoy.location.coordinates[0]
    })
  } catch (error) {
    console.log(error)
  }
}
getOrder()
},[userData?._id])

useEffect(():any=>{
const socket=getSocket()
socket.on("update-deliveryBoy-location",(data)=>{
  console.log(location)
 setDeliveryBoyLocation({
  latitude: data.location.coordinates?.[1] ?? data.location.latitude,
        longitude: data.location.coordinates?.[0] ?? data.location.longitude,

 })
  }
)
return ()=>socket.off("update-deliveryBoy-location")
},[order])

 useEffect(() => {
    const socket = getSocket()
    socket.emit("join-room", orderId)
     socket.on("send-message",(message)=>{
      if(message.roomId===orderId){
 setMessages((prev)=>[...prev!,message])
      }
    })

    return ()=>{
      socket.off("send-message")
    }
    
    
  }, [])

  const sendMsg = () => {
    const socket = getSocket()

    const message = {
      roomId: orderId,
      text: newMessage,
      senderId: userData?._id,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    }
    socket.emit("send-message", message)
   
    setNewMessage("")
  }
   useEffect(() => {
      const getAllMessages = async () => {
        try {
          const result = await axios.post("/api/chat/messages", { roomId: orderId })
          setMessages(result.data)
        } catch (error) {
          console.log(error)
        }
      }
      getAllMessages()
    }, [])

useEffect(()=>{
    chatBoxRef.current?.scrollTo({
      top:chatBoxRef.current.scrollHeight,
      behavior:"smooth"
    })
  },[messages])

  const getSuggestion=async ()=>{
    setLoading(true)
    try {
  
      const lastMessage=messages?.filter(m=>m.senderId.toString()!==userData?._id)?.at(-1)
      const result=await axios.post("/api/chat/ai-suggestions",{message:lastMessage?.text,role:"user"})
    setSuggestions(result.data)
    setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  
return (
    <div className='w-full min-h-screen bg-linear-to-b from-green-50 to-white'>
      <div className='max-w-2xl mx-auto pb-24'>

        {/* Header */}
        <div className='sticky top-0 bg-white/80 backdrop-blur-xl px-4 py-3 border-b border-gray-100 shadow-sm flex items-center gap-3 z-50'>
          <button
            className='p-2 bg-green-100 hover:bg-green-200 rounded-full transition-colors'
            onClick={() => router.back()}
          >
            <ArrowLeft className="text-green-700" size={20} />
          </button>
          <div>
            <h2 className='text-lg font-bold text-gray-900'>Track Order</h2>
            <p className='text-xs text-gray-500'>
              Order #{order?._id?.toString().slice(-6)}{" "}
              <span className='inline-flex items-center gap-1 ml-1 text-green-700 font-semibold capitalize'>
                <span className='w-1.5 h-1.5 rounded-full bg-green-500' />
                {order?.status}
              </span>
            </p>
          </div>
        </div>

        <div className='px-4 mt-6 space-y-5'>

          {/* Map */}
          <div className='rounded-2xl overflow-hidden border border-gray-100 shadow-sm'>
            <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />
          </div>

          {/* Chat card */}
          <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-[430px] flex flex-col'>

            <div className='flex justify-between items-center mb-3'>
              <span className='font-semibold text-gray-700 text-sm'>Quick Replies</span>
              <motion.button
                disabled={loading}
                whileTap={{ scale: 0.9 }}
                className="px-3 py-1.5 text-xs flex items-center gap-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full border border-purple-200 transition-colors disabled:opacity-60"
                onClick={getSuggestion}
              >
                <Sparkle size={13} />
                {loading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : "AI suggest"}
              </motion.button>
            </div>

            {suggestions.length > 0 && (
              <div className='flex gap-2 flex-wrap mb-3'>
                {suggestions.map((s, i) => (
                  <motion.div
                    key={i}
                    whileTap={{ scale: 0.92 }}
                    className="px-3 py-1.5 text-xs bg-green-50 hover:bg-green-100 border border-green-200 cursor-pointer text-green-700 rounded-full transition-colors"
                    onClick={() => setNewMessage(s)}
                  >
                    {s}
                  </motion.div>
                ))}
              </div>
            )}

            <div className='flex-1 overflow-y-auto px-1 py-2 space-y-3' ref={chatBoxRef}>
              {messages?.length === 0 && (
                <div className='h-full flex items-center justify-center text-gray-400 text-sm'>
                  No messages yet — say hi 👋
                </div>
              )}
              <AnimatePresence>
                {messages?.map((msg) => (
                  <motion.div
                    key={msg._id?.toString()}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.senderId.toString() === userData?._id ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`px-4 py-2 max-w-[75%] rounded-2xl shadow-sm
                      ${msg.senderId.toString() === userData?._id
                        ? "bg-green-600 text-white rounded-br-md"
                        : "bg-gray-100 text-gray-800 rounded-bl-md"
                      }`}>
                      <p className='text-sm'>{msg.text}</p>
                      <p className='text-[10px] opacity-70 mt-1 text-right'>{msg.time}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className='flex gap-2 mt-3 border-t border-gray-100 pt-3'>
              <input
                type="text"
                placeholder='Type a message...'
                className='flex-1 bg-gray-100 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-sm'
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && newMessage.trim()) sendMsg() }}
              />
              <button
                className='bg-green-600 hover:bg-green-700 disabled:opacity-50 p-3 rounded-xl text-white transition-colors'
                onClick={sendMsg}
                disabled={!newMessage.trim()}
              >
                <Send size={18} />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default TrackOrder
