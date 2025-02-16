import transporter from "@/lib/transporter";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { to, subject, text, html } = await request.json();

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,                    
      subject,             
      text,                  
      html,                         
    });

    return NextResponse.json({ message: "Email sent successfully", info });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ message: "Error sending email", error }, { status: 500 });
  }
}


