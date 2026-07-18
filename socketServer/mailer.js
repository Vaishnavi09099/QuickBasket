import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendMail = async (to, subject, html) => {
    try {
        const result = await resend.emails.send({
            from: "QuickBasket <onboarding@resend.dev>",
            to,
            subject,
            html
        })
        console.log("Email sent:", result)
    } catch (error) {
        console.log("Email send error:", error)
        throw error
    }
}