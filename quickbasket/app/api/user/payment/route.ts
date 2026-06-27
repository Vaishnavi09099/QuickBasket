import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { message: "Stripe secret key is missing on the server" },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_BASE_URL) {
      return NextResponse.json(
        { message: "NEXT_BASE_URL is missing on the server" },
        { status: 500 }
      );
    }

    const stripe  = new Stripe(process.env.STRIPE_SECRET_KEY);

    await connectDB();
    const {userId,items,paymentMethod,totalAmount,address} = await req.json();
    
    const missingFields = [];
    if (!userId) missingFields.push("userId");
    if (!items?.length) missingFields.push("items");
    if (!paymentMethod) missingFields.push("paymentMethod");
    if (!totalAmount) missingFields.push("totalAmount");
    if (!address) missingFields.push("address");

    if(missingFields.length){
         return NextResponse.json(
      { message: "Please send all required fields", missingFields },
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

    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        mode:"payment",
        success_url:`${process.env.NEXT_BASE_URL}/user/order-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:`${process.env.NEXT_BASE_URL}/user/order-cancel`,
        line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'QuickBasket Order Payment',
          },
          unit_amount: Math.round(Number(totalAmount) * 100),
        },
        quantity: 1,
      },
    ],
    metadata:{orderId:newOrder._id.toString()}
    })

    return NextResponse.json(
    {
        url:session.url
    },{
        status:200
    }
    );
  } catch (err) {
    console.error("Place order error:", err);
    return NextResponse.json({ message: `order payment error${err}` }, { status: 500 });
  }
}
