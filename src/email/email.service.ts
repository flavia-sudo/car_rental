import nodemailer from 'nodemailer';
import 'dotenv/config';
import customer from '../customers/customer.router';

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
    });
};

export const sendWelcomeEmail = async (
    customerEmail: string,
    customerName: string
);
        