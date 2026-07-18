import connectToDB from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import redis from "@/lib/redis";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDB()
        const { orderId } = await req.json()
        const order = await Order.findById(orderId).populate("user")
        if (!order) {
            return NextResponse.json(
                { message: "order not found" },
                { status: 400 }
            )
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString()

        // MongoDB ki jagah ab Redis mein save, 10 minute expiry ke saath
        await redis.set(`delivery-otp:${orderId}`, otp, "EX", 600)

        await sendMail(
            order.user.email,
            "Your Delivery OTP",
            `<h2>Your Delivery OTP is <strong>${otp}</strong></h2>`
        )
        return NextResponse.json(
            { message: "otp sent successfully" },
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json(
            { message: `send otp error ${error}` },
            { status: 500 }
        )
    }
}