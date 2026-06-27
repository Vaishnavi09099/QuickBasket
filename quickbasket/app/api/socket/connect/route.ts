import connectToDB from "@/lib/db";
import User from "@/models/user.model";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
        const { userId, socketId } = await req.json();
        await connectToDB();
        const user = await User.findByIdAndUpdate(userId,{
            socketId,
            isOnline:true
        },{new:true});

        if(!user){
            return NextResponse.json({
                message:"User not found"
            },{
                status:400
            });
        }
        return NextResponse.json({
            success:true
        },{
            status:200
        });

    }catch(err){
        console.error("/api/socket/connect error:", err);
        return NextResponse.json({
            success:false,
            message: "Internal server error"
        },{
            status:500
        });

    }
}