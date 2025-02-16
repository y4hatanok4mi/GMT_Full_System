import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Define the type for the formatted data
interface FormattedData {
  date: string;
  students: number;
  teachers: number;
}

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    // Group users by date and role
    const usersByDateAndRole = await prisma.user.groupBy({
      by: ['createdAt', 'role'], // Group by date and role
      _count: {
        _all: true, // Get total count for each group
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Format the result into an easier-to-handle structure
    const formattedData: FormattedData[] = usersByDateAndRole.reduce((acc, entry) => {
      const date = entry.createdAt.toISOString().split('T')[0]; // Format the date part
      const role = entry.role;

      // Find or create the entry for the given date
      let dateEntry = acc.find(item => item.date === date);
      if (!dateEntry) {
        dateEntry = { date, students: 0, teachers: 0 }; // Initialize the structure
        acc.push(dateEntry);
      }

      // Update the count for the corresponding role
      if (role === 'student') {
        dateEntry.students += entry._count._all;
      } else if (role === 'teacher') {
        dateEntry.teachers += entry._count._all;
      }

      return acc;
    }, [] as FormattedData[]); // Cast the accumulator to the correct type

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch data!' }, { status: 500 });
  }
}