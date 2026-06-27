import { NextResponse } from "next/server"
import connectToDB from "@/lib/db"
import { auth } from "@/auth"
import DeliveryAssignment from "@/models/deliveryAssignment.model"

export async function GET() {
  try {
    await connectToDB()

    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const assignments = await DeliveryAssignment.find({
      broadcastedTo: session.user.id,
      status: "broadcasted",
    }).populate("order").sort({ createdAt: -1 })

    return NextResponse.json(assignments, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: `get assignments error ${error}` },
      { status: 500 }
    )
  }
}
