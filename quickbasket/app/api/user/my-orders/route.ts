import { auth } from "@/auth";
import connectToDB from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try{
        await connectToDB();
        const session = await auth()
        const orders = await Order.find({
            user:session?.user?.id
        }).populate("user").sort({createdAt:-1})
        if(!orders){
            return NextResponse.json({
                message:"Orders not found"
            },{
                status:400
            })
        }
          return NextResponse.json(orders,{
                status:200
            })

    }catch(err){
          return NextResponse.json({
                message:`Get AllOrders Error ${err}`
            },{
                status:500
            })
        
    }
}