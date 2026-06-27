import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Grocery from "@/models/grocery.model";
import cloudinary from "@/lib/cloudinary";
import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";



export async function POST(req: NextRequest) {
  try {
    await connectDB();
    //backend me hame auth() function se session milta hai
    const session = await auth()
    if(session?.user?.role!=="admin"){
        return NextResponse.json({
            message:"You are not admin!"
        },{
            status:400
        })
    }

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const category = formData.get("category") as string;
    const unit = formData.get("unit") as string;
    
    const file = formData.get("image") as Blob | null;
    let imageUrl
    if(file){
        imageUrl = await uploadOnCloudinary(file)


        if (!imageUrl) {
  return NextResponse.json(
    { message: "Image upload failed" },
    { status: 500 }
  );
}
    }
// Save in DB
    const grocery = await Grocery.create({
      name,
      price,
      category,
      unit,
      image: imageUrl,
    });

      return NextResponse.json(
        { grocery },
        { status: 201 }
      )

  } catch (error) {
    console.log("Full error:", JSON.stringify(error, null, 2));  
    return NextResponse.json(
      { message: `add grocery error ${error}` },
      { status: 500 }
    );
  }
}