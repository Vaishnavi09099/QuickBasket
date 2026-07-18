import express from "express";
import http from "http"
import dotenv from "dotenv"
import {Server} from "socket.io"
import axios from "axios";
import Redis from "ioredis"
import "./worker.js"

dotenv.config()

const app = express()
app.use(express.json())

const server = http.createServer(app)
const redis = new Redis(process.env.REDIS_URL)
const port = process.env.PORT || 5000
const apiBaseUrl = process.env.INTERNAL_API_URL || process.env.NEXT_BASE_URL || "http://localhost:3000"

redis.on("connect", () => console.log("Redis connected"))
redis.on("error", (err) => console.log("Redis error:", err.message))

const io = new Server(server,{
    cors:{
        origin: process.env.CORS_ORIGIN
    }
})


io.on("connection",(socket)=>{
    console.log("User connected",socket.id)
   

    socket.on("identity",async (userId)=>{
        console.log("User identity",userId)
        try {
            await axios.post(`${apiBaseUrl}/api/socket/connect`,{userId,socketId:socket.id})
        } catch (error) {
            console.log("connect error:", error.message)
        }
    })

socket.on("updateLocation", async ({userId, latitude, longitude}) => {
    const location = {
        type: "Point",
        coordinates: [longitude, latitude]
    }

    // ⏱️ Redis timing
    const redisStart = Date.now()
    await redis.set(`location:${userId}`, JSON.stringify(location), "EX", 60)
    const redisTime = Date.now() - redisStart
    console.log(`Redis write took: ${redisTime}ms`)

    io.emit("update-deliveryBoy-location", {userId, location})

    // ⏱️ MongoDB timing
    try {
        const mongoStart = Date.now()
        await axios.post(`${apiBaseUrl}/api/socket/updateLocation`, {userId, location})
        const mongoTime = Date.now() - mongoStart
        console.log(`MongoDB write took: ${mongoTime}ms`)
    } catch (error) {
        console.log("location update error:", error.message)
    }
})



   socket.on("join-room",(roomId)=>{
   console.log("joinded room",roomId)
    socket.join(roomId)
   })

socket.on("send-message", async (message) => {
  console.log(message)
  try {
    const result = await axios.post(`${apiBaseUrl}/api/chat/save`, message)
    console.log("saved:", result.data)
  } catch (error) {
    console.log("save error:", error.message)
  }
  io.to(message.roomId).emit("send-message", message)
})
 

  




    


    socket.on("disconnect",()=>{
        console.log("User disconnected",socket.id)
    })
})



app.post("/notify",(req,res)=>{
    const {event,data,socketId}=req.body
    if(socketId){
        io.to(socketId).emit(event,data)
    }else{
        io.emit(event,data)
    }

    return res.status(200).json({"success":true})
})

//connect ho gaya user fir disconnect hone k bad null

server.listen(port,()=>{
    console.log("Server started at",port)
})