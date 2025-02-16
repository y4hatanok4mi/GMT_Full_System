import { NextResponse } from 'next/server';
import { sendEmail } from '@/utils/email';
import { emailVerificationTemplate } from '@/utils/templates';

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required!' }, { status: 400 });
    }

    await sendEmail(email, 'Verify Your Email', emailVerificationTemplate(code));

    return NextResponse.json({ success: true, message: 'Verification email sent!' });
  } catch (error) {
    console.error('Error in send-verification-code route:', error);
    return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
  }
}