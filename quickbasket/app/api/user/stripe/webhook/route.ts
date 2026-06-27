import connectToDB from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";


export async function POST(req:NextRequest){
    if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json(
            { message: "Stripe secret key is missing on the server" },
            { status: 500 }
        );
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json(
            { message: "Stripe webhook secret is missing on the server" },
            { status: 500 }
        );
    }

    const sig = req.headers.get("stripe-signature");

    if (!sig) {
        return NextResponse.json(
            { message: "Stripe signature header is missing" },
            { status: 400 }
        );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const rawBody = await req.text();
    let event: Stripe.Event;

    try{
        event = stripe.webhooks.constructEvent(
            rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    }catch(err){
        console.log("Signature verification failed",err);
        return NextResponse.json(
            { message: "Stripe signature verification failed" },
            { status: 400 }
        );
    }

    if(event.type==="checkout.session.completed"){
        const session = event.data.object;
        const orderId = session.metadata?.orderId;

        if (!orderId) {
            return NextResponse.json(
                { message: "Order id is missing from Stripe session metadata" },
                { status: 400 }
            );
        }

        await connectToDB();
        await Order.findByIdAndUpdate(orderId,{
            isPaid:true,
            paymentMethod:"online"
        });
    }

    return NextResponse.json({
        received:true
    },{
        status:200
    })

}
