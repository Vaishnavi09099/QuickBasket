import connectToDB from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
   try{
    await connectToDB();
  const orders = await Order.find({})
  .populate("user")
  .sort({ createdAt: -1 });

     return NextResponse.json(
       orders
    ,{
        status:200
    })

   }catch(err){
    return NextResponse.json({
        message:`get orders error ${err}`
    },{
        status:500
    })
   }
}