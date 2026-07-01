import { getSocket } from '@/lib/socket'
import { IMessage } from '@/models/message.model'
import axios from 'axios'
import { Loader, Loader2, Send, Sparkle } from 'lucide-react'

import { AnimatePresence } from 'motion/react'
import React, { useEffect, useRef, useState } from 'react'
import { motion } from "motion/react"
type props = {
  orderId: string,
  deliveryBoyId: string
}

function DeliveryChat({ orderId, deliveryBoyId }: props) {
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<IMessage[]>()
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const [loading,setLoading]=useState(false)
  const [suggestions, setSuggestions] = useState([])
  useEffect(() => {
    const socket = getSocket()
    socket.emit("join-room", orderId)
    socket.on("send-message", (message) => {
      if (message.roomId === orderId) {
        setMessages((prev) => [...prev!, message])
      }

    })

    return () => {
      socket.off("send-message")
    }

  }, [])

  const sendMsg = () => {
    const socket = getSocket()

    const message = {
      roomId: orderId,
      text: newMessage,
      senderId: deliveryBoyId,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    }
    socket.emit("send-message", message)

    setNewMessage("")
  }

  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth"
    })
  }, [messages])

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

const getSuggestion=async ()=>{
  setLoading(true)
  try {

    const lastMessage=messages?.filter(m=>m.senderId.toString()!==deliveryBoyId)?.at(-1)
    const result=await axios.post("/api/chat/ai-suggestions",{message:lastMessage?.text,role:"delivery_boy"})
  setSuggestions(result.data)
  setLoading(false)
  } catch (error) {
    console.log(error)
    setLoading(false)
  }
}


 return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-[430px] flex flex-col'>

      <div className='flex justify-between items-center mb-3'>
        <span className='font-semibold text-gray-700 text-sm'>Quick Replies</span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          disabled={loading}
          onClick={getSuggestion}
          className="px-3 py-1.5 text-xs flex items-center gap-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full border border-purple-200 transition-colors disabled:opacity-60"
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
              className={`flex ${msg.senderId.toString() === deliveryBoyId ? "justify-end" : "justify-start"}`}
            >
              <div className={`px-4 py-2 max-w-[75%] rounded-2xl shadow-sm
                  ${msg.senderId.toString() === deliveryBoyId
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
          onKeyDown={(e) => { if (e.key === "Enter") sendMsg() }}
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
  )
}

export default DeliveryChat
