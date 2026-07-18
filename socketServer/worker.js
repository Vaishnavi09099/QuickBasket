import { Worker } from "bullmq"
import Redis from "ioredis"
import { sendMail } from "./mailer.js"

const connection = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
})

const emailWorker = new Worker("email-queue", async (job) => {
    if (job.name === "order-confirmation") {
        const { to, userName, orderId, items, totalAmount, address, paymentMethod } = job.data

        const itemsHtml = items.map(item =>
            `<tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price}</td>
            </tr>`
        ).join("")

        const html = `
            <h2>Hi ${userName}, your order is confirmed! 🎉</h2>
            <p>Order ID: <strong>${orderId}</strong></p>
            <table border="1" cellpadding="8" style="border-collapse: collapse;">
                <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
                ${itemsHtml}
            </table>
            <p><strong>Total: ₹${totalAmount}</strong></p>
            <p>Payment Method: ${paymentMethod.toUpperCase()}</p>
            <p>Delivery Address: ${address.fullAddress}, ${address.city}, ${address.state} - ${address.pincode}</p>
        `

        await sendMail(to, "Your QuickBasket Order is Confirmed!", html)
        console.log(`Order confirmation email sent to ${to}`)
    }

    if (job.name === "order-delivered") {
        const { to, userName, orderId } = job.data
        const html = `
            <h2>Hi ${userName}, your order has been delivered! ✅</h2>
            <p>Order ID: <strong>${orderId}</strong></p>
            <p>Thank you for shopping with QuickBasket!</p>
        `
        await sendMail(to, "Your QuickBasket Order is Delivered!", html)
        console.log(`Delivery email sent to ${to}`)
    }
}, { connection })

emailWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`)
})

emailWorker.on("failed", (job, err) => {
    console.log(`Job ${job?.id} failed:`, err.message)
    console.log("Full error:", err)
})


export default emailWorker