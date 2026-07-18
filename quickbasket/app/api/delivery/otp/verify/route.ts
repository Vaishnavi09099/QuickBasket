import connectToDB from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import redis from "@/lib/redis";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDB()
        const { orderId, otp } = await req.json()
        if (!orderId || !otp) {
            return NextResponse.json(
                { message: "orderId or OTP not found" },
                { status: 400 }
            )
        }

        const order = await Order.findById(orderId)
        if (!order) {
            return NextResponse.json(
                { message: "order not found" },
                { status: 400 }
            )
        }

        // Redis se saved OTP nikal
        const savedOtp = await redis.get(`delivery-otp:${orderId}`)

        if (!savedOtp) {
            return NextResponse.json(
                { message: "OTP expired, please request a new one" },
                { status: 400 }
            )
        }

        if (savedOtp !== otp) {
            return NextResponse.json(
                { message: "Incorrect OTP" },
                { status: 400 }
            )
        }

        order.status = "delivered"
        order.deliveryOtpVerification = true
        order.deliveredAt = new Date()
        // COD order delivered hote hi paid maan lo
if (order.paymentMethod === "cod") {
    order.isPaid = true
}


        await order.save()

        // Verify ho gaya, ab Redis se OTP hata do
        await redis.del(`delivery-otp:${orderId}`)

        await emitEventHandler("order-status-update", { orderId: order._id, status: order.status })
        await DeliveryAssignment.updateOne(
            { order: orderId },
            { $set: { assignedTo: null, status: "completed" } }
        )
        return NextResponse.json(
            { message: "Delivery successfully completed" },
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json(
            { message: `verify otp error ${error}` },
            { status: 500 }
        )
    }
}