import { NextRequest, NextResponse } from 'next/server';
import { createContactMessage, getContactMessages } from '@/lib/db';
import nodemailer from 'nodemailer';

// Email configuration - using environment variables
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'miqkniq@gmail.com';

export async function GET() {
    try {
        const messages = await getContactMessages();
        return NextResponse.json(messages);
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        return NextResponse.json(
            { error: 'Failed to fetch messages' },
            { status: 500 }
        );
    }
}


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.name || !body.email || !body.subject || !body.message) {
            return NextResponse.json(
                { error: 'Missing required fields: name, email, subject, message' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Check if SMTP is configured
        if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
            console.error('SMTP not configured - SMTP_EMAIL and SMTP_PASSWORD environment variables are required');
            return NextResponse.json(
                { error: 'Email service is not configured. Please contact directly via email.' },
                { status: 503 }
            );
        }

        // Create transporter - using Gmail SMTP
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD, // App-specific password
            },
        });

        // Verify SMTP connection
        try {
            await transporter.verify();
        } catch (verifyError) {
            console.error('SMTP verification failed:', verifyError);
            return NextResponse.json(
                { error: 'Email service is temporarily unavailable. Please try again later.' },
                { status: 503 }
            );
        }

        // Save message to database first
        const messageId = await createContactMessage({
            name: body.name,
            email: body.email,
            subject: body.subject,
            message: body.message,
        });

        // Email content
        const mailOptions = {
            from: `"Portfolio Contact Form" <${process.env.SMTP_EMAIL}>`,
            to: RECIPIENT_EMAIL,
            replyTo: body.email,
            subject: `[Portfolio Contact] ${body.subject}`,
            html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px;"><strong>From:</strong> ${body.name}</p>
              <p style="margin: 0 0 10px;"><strong>Email:</strong> <a href="mailto:${body.email}">${body.email}</a></p>
              <p style="margin: 0;"><strong>Subject:</strong> ${body.subject}</p>
            </div>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #333;">Message:</h3>
              <div style="background-color: #fff; border: 1px solid #e9ecef; padding: 20px; border-radius: 8px; white-space: pre-wrap;">
                ${body.message}
              </div>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e9ecef; margin: 30px 0;" />
            
            <p style="color: #6c757d; font-size: 12px;">
              This message was sent from your portfolio contact form.<br/>
              Message ID: ${messageId}
            </p>
          </div>
        `,
            text: `
New Contact Form Submission

From: ${body.name}
Email: ${body.email}
Subject: ${body.subject}

Message:
${body.message}

---
Message ID: ${messageId}
        `,
        };

        // Send email - this MUST succeed
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', info.messageId);
        } catch (emailError) {
            console.error('Failed to send email:', emailError);
            // Return error to the user - email delivery failed
            return NextResponse.json(
                { error: 'Failed to send your message. Please try again or contact directly via email.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, messageId },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error processing contact form:', error);
        return NextResponse.json(
            { error: 'Failed to send message. Please try again.' },
            { status: 500 }
        );
    }
}
