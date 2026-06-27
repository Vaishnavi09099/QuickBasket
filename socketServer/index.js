import express from "express";
import http from "http"
import dotenv from "dotenv"
import {Server} from "socket.io"
import axios from "axios";

dotenv.config()

const app = express()
app.use(express.json())

const server = http.createServer(app)
const port = process.env.PORT || 5000

const io = new Server(server,{
    cors:{
     
        origin: process.env.NEXT_BASE_URL
    
    }
})


io.on("connection",(socket)=>{
    console.log("User connected",socket.id)
   

    socket.on("identity",async (userId)=>{
        console.log("User identity",userId)
       
        await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/connect`,{userId,socketId:socket.id})
    })

     socket.on("updateLocation",async ({userId,latitude,longitude})=>{
       
    const location={
        type:"Point",
        coordinates:[longitude,latitude]
    }
    await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/updateLocation`,{userId,location})
    
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