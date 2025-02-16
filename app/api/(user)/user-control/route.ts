import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";  // Import your Prisma client

// GET Request to fetch all users
export async function GET() {
  try {
    // Fetch all users from the database using Prisma
    const users = await prisma.user.findMany();

    // Return the users as JSON response
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.error();
  }
}

// PUT Request to update a user
export async function PUT(request: Request) {
  try {
    const { id, name, email, gender, school, id_no, role } = await request.json();

    // Validate if all required fields are provided
    if (!id || !name || !email || !gender || !school || !id_no || !role) {
      return NextResponse.json(
        { error: "Missing required fields!" },
        { status: 400 }
      );
    }

    // Update the user in the database using Prisma
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, gender, school, id_no, role },
    });

    return NextResponse.json({ message: "User updated successfully!", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user!" }, { status: 500 });
  }
}

// DELETE Request to delete a user
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    // Validate if id is provided
    if (!id) {
      return NextResponse.json({ error: "User ID is required!" }, { status: 400 });
    }

    // Delete the user from the database using Prisma
    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted successfully!", deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user!" }, { status: 500 });
  }
}
