import nodemailer from "nodemailer"
dns.setDefaultResultOrder("ipv4first") 


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});

export const sendMail = async (to, subject, html) => {
    await transporter.sendMail({
        from: `"QuickBasket" <${process.env.EMAIL}>`,
        to,
        subject,
        html
    })
}
