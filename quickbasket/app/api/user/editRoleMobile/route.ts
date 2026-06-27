//ye api hai jo role aur mobile frontend se lekar update krenge

import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import {auth} from "@/auth";
import User from "@/models/user.model"


export async function POST(req:NextRequest){
      console.log("API HIT");
    try{
        await connectToDB();
        const {role,mobile} = await req.json();
        const session = await auth(); //ham auth s session get krenge
        const user = await User.findOneAndUpdate({email:session?.user?.email},{
  role,mobile
        },{new:true})
    
        if(!user){
            return NextResponse.json(
                {message:"User not found"},
                {status:400}

            )
      }
         return NextResponse.json(
            { message: "Updated successfully", user },
            { status: 200 }
        );
    }catch(err){
        return NextResponse.json({
            message:`Edit role and mobile error ${err}`
        },{
            status:500
        })
    }
}
