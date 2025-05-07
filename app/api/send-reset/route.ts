import { NextResponse } from "next/server";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/mail/email";
import { generatePasswordResetToken } from "@/lib/tokens";

export async function POST(req: Request) {
  const { email } = await req.json();
  console.log("Received email:", email);

  const user = await getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "No account with that email." }, { status: 404 });
  }

  const token = await generatePasswordResetToken(email);
  const resetURL = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${token.token}`;

  try {
    await sendPasswordResetEmail(email, resetURL);
    return NextResponse.json({ message: "Reset email sent!" });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return NextResponse.json({ error: "Failed to send reset email." }, { status: 500 });
  }
}
