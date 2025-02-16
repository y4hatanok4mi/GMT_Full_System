import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await auth();
    const userId = user?.user.id;
    const { moduleId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the latest certificate number
    const latestCertificate = await prisma.certificate.findFirst({
      orderBy: { certificateNumber: "desc" },
    });

    const newCertificateNumber = latestCertificate
      ? latestCertificate.certificateNumber + 1
      : 1;

    // Check if user already has a certificate for this module
    const existingCertificate = await prisma.certificate.findUnique({
      where: { userId_moduleId: { userId: Number(userId), moduleId } },
    });

    if (existingCertificate) {
      return NextResponse.json({ certificateNumber: existingCertificate.certificateNumber });
    }

    // Issue a new certificate
    const newCertificate = await prisma.certificate.create({
      data: {
        userId: Number(userId),
        moduleId,
        certificateNumber: newCertificateNumber,
      },
    });

    return NextResponse.json({ certificateNumber: newCertificate.certificateNumber });
  } catch (error) {
    console.error("Error issuing certificate:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
