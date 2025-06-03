import nodemailer from 'nodemailer';
import 'dotenv/config';

const createTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Email credentials not found in environment variables");
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
    });
};

export const sendVerificationEmail = async (
    customerEmail: string,
    customerName: string,
    verificationCode: string
) => {
    const transporter = createTransporter();
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: customerEmail,
        subject: "Verify Your Email - Car Rental",
        html:`
        <h3>Hello ${customerName},</h3>
        <p>Your verification code is:</p>
        <h2>${verificationCode}</h2>
        <p>Enter this code to verify your account.</p>
        `
    });
};

export const sendWelcomeEmail = async (to: string, name: string) => {
    const transporter = createTransporter();
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "Welcome to Car Rental",
        html: `
        <h3>Hello ${name},</h3>
        <p>Welcome to our car rental service! We are excited to have you on board.</p>
        <p>Feel free to explore our services and let us know if you have any questions.</p>
        <p>Best regards,</p>
        <p>The Car Rental Team</p>
        `
    });
}
        