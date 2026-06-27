import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await User.findOne({ role: "admin" }); // find() ki jagah findOne() — faster hai
    return NextResponse.json(
      { adminExists: !!user },  // true ya false automatically
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: `check for admin error ${err}` },
      { status: 500 }
    );
  }
}