"use client"
import React, { useState, useRef, useEffect } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { X, Send, Loader } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface Message {
  role: "user" | "assistant"
  content: string
}

function QuickBasketAI() {
  const { userData } = useSelector((state: RootState) => state.user)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm QuickBasket AI 👋 Ask me about your orders, or find products!" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, open])

  const sendMessage = async () => {
    if (!input.trim()) return
    if (!userData?._id) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Please login to use the assistant." }])
      return
    }

    const userMessage = input.trim()
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setInput("")
    setLoading(true)

    try {
      const res = await axios.post("/api/ai-assistant/chat", {
        message: userMessage,
        userId: userData._id
      })
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }])
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong, please try again." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating animated bot button */}
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-white shadow-2xl flex items-center justify-center"
      >
        {/* Pulsing glow ring */}
        <motion.span
          className="absolute inset-0 rounded-full bg-green-500"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative z-10 w-14 h-14 rounded-full bg-green-50 flex items-center justify-center overflow-hidden">
          {open ? (
            <X size={26} className="text-green-700" />
          ) : (
            <Image
              src="/ai-bot-icon.png"   // 👈 apni image yaha public folder mein daal ke path daal de
              alt="QuickBasket AI"
              width={56}
              height={56}
              className="object-contain"
            />
          )}
        </div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-sm h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-green-600 text-white px-4 py-3 flex items-center gap-2">
              <Image
                src="/ai-bot-icon.png"   // 👈 same image yaha bhi
                alt="QuickBasket AI"
                width={26}
                height={26}
                className="object-contain rounded-full bg-white p-0.5"
              />
              <h3 className="font-semibold">QuickBasket AI</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                      m.role === "user"
                        ? "bg-green-600 text-white rounded-br-sm"
                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-2">
                    <Loader size={16} className="animate-spin text-green-600" />
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-100 flex items-center gap-2 bg-white">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about your order..."
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white flex items-center justify-center transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default QuickBasketAI