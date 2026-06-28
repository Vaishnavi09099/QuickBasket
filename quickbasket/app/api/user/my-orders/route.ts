import { auth } from "@/auth";
import connectToDB from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try{
        await connectToDB();
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({
                message: "Unauthorized"
            }, {
                status: 401
            })
        }

        const orders = await Order.find({
            user: session.user.id
        })
        .populate("user assignedDeliveryBoy")
        .sort({ createdAt: -1 })

        return NextResponse.json(orders, {
            status: 200
        })

    }catch(err){
          return NextResponse.json({
                message:`Get AllOrders Error ${err}`
            },{
                status:500
            })
        
    }
}