// /api/auth/register
import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const { name, email, password } = await req.json();
        const existUser = await User.findOne({ email });
        if (existUser) {
            return NextResponse.json({ error: "Email already registered" }, { status: 409 });
        }

       

        if (password.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashed });
        await user.save();

        return NextResponse.json({ message: "User created successfully", user: { id: user._id, name: user.name, email: user.email } }, { status: 201 });
    } catch (err) {
        console.error("/api/auth/register error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

//name , email , password  frontend se lekar ani hai
//email check
//password 6 character 
//hashing password
//user created
