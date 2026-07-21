import nodemailer from "nodemailer";

// Create transporter with Gmail SMTP configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Use Gmail App Password for 2FA accounts
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter error:", error);
  } else {
    console.log("Email transporter ready");
  }
});

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  cc?: string;
  bcc?: string;
}

/**
 * Send email using nodemailer
 */
export const sendMail = async (options: SendMailOptions): Promise<boolean> => {
  try {
    const { to, subject, html, text, cc, bcc } = options;

    const mailOptions = {
      from: `"QuickBasket" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || "", // Fallback plain text version
      cc: cc || undefined,
      bcc: bcc || undefined,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
};

/**
 * Send welcome email to new user
 */
export const sendWelcomeEmail = async (email: string, name: string): Promise<boolean> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Welcome to QuickBasket!</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p style="color: #333; font-size: 16px; margin-top: 0;">Hi ${name},</p>
        
        <p style="color: #555; font-size: 14px; line-height: 1.6;">
          Welcome to QuickBasket! We're thrilled to have you on board. Your account has been successfully created.
        </p>
        
        <div style="background-color: #f0f0f0; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; color: #333; font-weight: bold;">Account Email:</p>
          <p style="margin: 5px 0 0 0; color: #555;">${email}</p>
        </div>
        
        <p style="color: #555; font-size: 14px; line-height: 1.6;">
          You can now log in to your account and start exploring our grocery delivery services. 
          If you have any questions, feel free to reach out to our support team.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Go to Login
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
          © 2024 QuickBasket. All rights reserved.
        </p>
      </div>
    </div>
  `;

  return sendMail({
    to: email,
    subject: "Welcome to QuickBasket - Account Created Successfully",
    html,
    text: `Welcome to QuickBasket! Your account has been created successfully. Email: ${email}`,
  });
};

/**
 * Send OTP verification email
 */
export const sendOTPEmail = async (email: string, otp: string, name: string): Promise<boolean> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Verify Your Email</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p style="color: #333; font-size: 16px; margin-top: 0;">Hi ${name},</p>
        
        <p style="color: #555; font-size: 14px; line-height: 1.6;">
          Please use the following OTP to verify your email address. This code will expire in 10 minutes.
        </p>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 5px; color: white; font-family: monospace;">
            ${otp}
          </div>
        </div>
        
        <p style="color: #d32f2f; font-size: 13px; background-color: #ffebee; padding: 10px; border-radius: 4px; border-left: 4px solid #d32f2f;">
          <strong>Security Note:</strong> Never share this OTP with anyone. Our team will never ask for this code.
        </p>
        
        <p style="color: #555; font-size: 14px; line-height: 1.6; margin-top: 20px;">
          If you didn't request this verification, please ignore this email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
          © 2024 QuickBasket. All rights reserved.
        </p>
      </div>
    </div>
  `;

  return sendMail({
    to: email,
    subject: `QuickBasket - Your Verification Code is ${otp}`,
    html,
    text: `Your OTP is: ${otp}. This code will expire in 10 minutes.`,
  });
};

/**
 * Send order confirmation email
 */
export const sendOrderConfirmationEmail = async (
  email: string,
  name: string,
  orderId: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number,
  deliveryAddress: string
): Promise<boolean> => {
  const itemsHtml = items
    .map(
      (item) =>
        `<tr>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: center;">x${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`
    )
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Order Confirmed!</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p style="color: #333; font-size: 16px; margin-top: 0;">Hi ${name},</p>
        
        <p style="color: #555; font-size: 14px; line-height: 1.6;">
          Your order has been confirmed and will be delivered shortly.
        </p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0; color: #333;"><strong>Order ID:</strong> ${orderId}</p>
          <p style="margin: 0 0 8px 0; color: #333;"><strong>Delivery Address:</strong> ${deliveryAddress}</p>
          <p style="margin: 0; color: #333;"><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <h2 style="color: #333; font-size: 16px; margin-top: 25px;">Order Items:</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <thead>
            <tr style="background-color: #f5f5f5; border-bottom: 2px solid #667eea;">
              <th style="padding: 12px; text-align: left; color: #333;">Item</th>
              <th style="padding: 12px; text-align: center; color: #333;">Qty</th>
              <th style="padding: 12px; text-align: right; color: #333;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; text-align: right; color: #333; font-size: 18px; font-weight: bold;">
            Total: ₹${total.toFixed(2)}
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/user/orders/${orderId}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Track Order
          </a>
        </div>
        
        <p style="color: #555; font-size: 14px; line-height: 1.6; margin-top: 20px;">
          Thank you for ordering from QuickBasket. If you have any questions, please contact our support team.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
          © 2024 QuickBasket. All rights reserved.
        </p>
      </div>
    </div>
  `;

  return sendMail({
    to: email,
    subject: `Order Confirmation - Order #${orderId}`,
    html,
    text: `Your order #${orderId} has been confirmed. Total: ₹${total.toFixed(2)}`,
  });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetLink: string
): Promise<boolean> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Reset Your Password</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p style="color: #333; font-size: 16px; margin-top: 0;">Hi ${name},</p>
        
        <p style="color: #555; font-size: 14px; line-height: 1.6;">
          We received a request to reset your password. Click the button below to create a new password.
        </p>
        
        <p style="color: #d32f2f; font-size: 13px; background-color: #ffebee; padding: 10px; border-radius: 4px; border-left: 4px solid #d32f2f;">
          <strong>Note:</strong> This link will expire in 1 hour for security reasons.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p style="color: #555; font-size: 14px; line-height: 1.6;">
          If you didn't request this password reset, please ignore this email or contact our support team if you have concerns.
        </p>
        
        <p style="color: #555; font-size: 13px; line-height: 1.6; margin-top: 20px;">
          <strong>For security:</strong> Never share your password with anyone. Our team will never ask for your password.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
          © 2024 QuickBasket. All rights reserved.
        </p>
      </div>
    </div>
  `;

  return sendMail({
    to: email,
    subject: "Reset Your QuickBasket Password",
    html,
    text: `Click here to reset your password: ${resetLink}`,
  });
};

/**
 * Send delivery notification email
 */
export const sendDeliveryNotificationEmail = async (
  email: string,
  name: string,
  orderId: string,
  deliveryBoyName: string,
  deliveryBoyPhone: string,
  estimatedTime: string
): Promise<boolean> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Your Order is on the Way!</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p style="color: #333; font-size: 16px; margin-top: 0;">Hi ${name},</p>
        
        <p style="color: #555; font-size: 14px; line-height: 1.6;">
          Your order is out for delivery! Here are the details:
        </p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0; color: #333;"><strong>Order ID:</strong> ${orderId}</p>
          <p style="margin: 0 0 8px 0; color: #333;"><strong>Delivery Boy:</strong> ${deliveryBoyName}</p>
          <p style="margin: 0 0 8px 0; color: #333;"><strong>Contact:</strong> ${deliveryBoyPhone}</p>
          <p style="margin: 0; color: #333;"><strong>Estimated Delivery:</strong> ${estimatedTime}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/user/orders/${orderId}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Track Live Location
          </a>
        </div>
        
        <p style="color: #555; font-size: 14px; line-height: 1.6;">
          Be ready to receive your order. If you have any issues, contact us immediately.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
          © 2024 QuickBasket. All rights reserved.
        </p>
      </div>
    </div>
  `;

  return sendMail({
    to: email,
    subject: `Your Order #${orderId} is Out for Delivery`,
    html,
    text: `Your order #${orderId} is on the way. Delivery boy: ${deliveryBoyName}. Estimated time: ${estimatedTime}`,
  });
};
