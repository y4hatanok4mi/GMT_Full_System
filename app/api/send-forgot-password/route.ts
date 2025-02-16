import { NextResponse } from 'next/server';
import { sendEmail } from '@/utils/email';
import { forgotPasswordTemplate } from '@/utils/templates';

export async function POST(req: Request) {
  try {
    const { email, resetLink } = await req.json();

    if (!email || !resetLink) {
      return NextResponse.json({ error: 'Email and reset link are required' }, { status: 400 });
    }

    await sendEmail(email, 'Reset Your Password', forgotPasswordTemplate(resetLink));

    return NextResponse.json({ success: true, message: 'Forgot password email sent' });
  } catch (error) {
    console.error('Error in send-forgot-password route:', error);
    return NextResponse.json({ error: 'Failed to send forgot password email' }, { status: 500 });
  }
}
