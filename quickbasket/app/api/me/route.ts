import { auth } from "@/auth"

import { NextRequest,NextResponse } from "next/server"
import User from "@/models/user.model";



export async function GET(req:NextRequest){
    try{
        const session = await auth()
        if(!session || !session.user){
            return NextResponse.json({
                message:"User is not authenticated",
                status:400
            })

        }
        const user = await User.findOne({email:session.user.email}).select("-password");
        if(!user){
            return NextResponse.json({
                message:"User not found",
                status:400
            })
        }
        return NextResponse.json({
            user,status:200
        })


    }catch(err){
         return NextResponse.json({
                message:`Get me error : ${err}`,
                status:500
            })
    }

}