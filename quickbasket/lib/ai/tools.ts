import { tool } from "@langchain/core/tools"
import { z } from "zod"
import connectToDB from "@/lib/db"
import Order from "@/models/order.model"
import Grocery from "@/models/grocery.model"

// Tool 1: User ke orders ka status check karna
export const getOrderStatusTool = (userId: string) => tool(
    async () => {
        await connectToDB()
        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(5)

        if (!orders.length) {
            return "No orders found for this user."
        }

        return orders.map(o => ({
            orderId: o._id.toString().slice(-6),
            status: o.status,
            totalAmount: o.totalAmount,
            paymentMethod: o.paymentMethod,
            isPaid: o.isPaid,
            placedOn: o.createdAt,
            deliveredAt: o.deliveredAt || null
        }))
    },
    {
        name: "get_order_status",
        description: "Get the current user's recent order statuses (pending, out of delivery, delivered), payment info, and order dates.",
        schema: z.object({})
    }
)

// Tool 2: Grocery products search karna
export const searchProductsTool = tool(
    async ({ query }: { query: string }) => {
        await connectToDB()
        const products = await Grocery.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } }
            ]
        }).limit(10)

        if (!products.length) {
            return `No products found matching "${query}".`
        }

        return products.map(p => ({
            name: p.name,
            category: p.category,
            price: p.price,
            unit: p.unit
        }))
    },
    {
        name: "search_products",
        description: "Search available grocery products by name or category. Use this when the user asks about product availability, prices, or wants suggestions.",
        schema: z.object({
            query: z.string().describe("The search term - product name or category")
        })
    }
)

// Tool 3: Cart total calculate karna
export const calculateCartTool = tool(
    async ({ items }: { items: { name: string; quantity: number }[] }) => {
        await connectToDB()

        const results = []
        let total = 0

        for (const item of items) {
            const product = await Grocery.findOne({
                name: { $regex: item.name, $options: "i" }
            })

            if (!product) {
                results.push(`"${item.name}" not found in our catalog.`)
                continue
            }

            const itemTotal = Number(product.price) * item.quantity
            total += itemTotal

            results.push({
                name: product.name,
                unit: product.unit,
                pricePerUnit: product.price,
                quantity: item.quantity,
                itemTotal
            })
        }

        return { items: results, grandTotal: total }
    },
    {
        name: "calculate_cart_total",
        description: "Calculate the total price for a list of products with quantities. Use this when the user asks 'how much would X cost' or wants to estimate a purchase before adding to cart.",
        schema: z.object({
            items: z.array(
                z.object({
                    name: z.string().describe("Product name"),
                    quantity: z.number().describe("Quantity requested")
                })
            )
        })
    }
)