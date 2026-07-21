import { NextRequest, NextResponse } from "next/server"
import { createQuickBasketAgent, agentSystemPrompt } from "@/lib/ai/agent"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"

export async function POST(req: NextRequest) {
    try {
        const { message, userId } = await req.json()

        if (!userId) {
            return NextResponse.json(
                { message: "Please login to use the assistant" },
                { status: 401 }
            )
        }

        if (!message) {
            return NextResponse.json(
                { message: "Message is required" },
                { status: 400 }
            )
        }

        const agent = createQuickBasketAgent(userId)

        const result = await agent.invoke({
            messages: [
                new SystemMessage(agentSystemPrompt),   // 👈 system prompt yaha add hua
                new HumanMessage(message)
            ]
        })

        const lastMessage = result.messages[result.messages.length - 1]

        return NextResponse.json(
            { reply: lastMessage.content },
            { status: 200 }
        )

    } catch (error) {
        console.error("AI assistant error:", error)
        return NextResponse.json(
            { message: "Something went wrong, please try again" },
            { status: 500 }
        )
    }
}