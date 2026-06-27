import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import emitEventHandler from "@/lib/emitEventHandler";

export async function POST(req: NextRequest) {
  try {
       await connectDB();
    const {userId,items,paymentMethod,totalAmount,address} = await req.json();
    
    if(!items || !userId || !paymentMethod ||  !totalAmount || !address){
         return NextResponse.json(
      { message: "Please send me all the credentials" },
      { status: 400}
    );
    }
    const user  = await User.findById(userId)
    if(!user){
        return NextResponse.json({ message: "User not found!" }, { status: 400 });
  
    }
 
    const newOrder = await Order.create({
        user:userId,
        items,paymentMethod,totalAmount,address
    })

     await emitEventHandler("new-order",newOrder)

        return NextResponse.json(
            newOrder,
            { status: 201 }
        )


    
  } catch (err) {
    console.error("Place order error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}