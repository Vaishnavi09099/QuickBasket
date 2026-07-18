import connectToDB from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import redis from "@/lib/redis";
import { emailQueue } from "@/lib/queue";
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

        // 👇 .populate("user") add kiya taaki email/name mil sake
        const order = await Order.findById(orderId).populate("user")
        if (!order) {
            return NextResponse.json(
                { message: "order not found" },
                { status: 400 }
            )
        }

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

        if (order.paymentMethod === "cod") {
            order.isPaid = true
        }

        await order.save()

        await redis.del(`delivery-otp:${orderId}`)

        // 📧 Delivery confirmation email queue mein daal do
        await emailQueue.add("order-delivered", {
            to: order.user.email,
            userName: order.user.name,
            orderId: order._id.toString()
        })

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