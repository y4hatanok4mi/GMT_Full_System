// pages/api/course/[courseId]/instructor.js

import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { courseId } = req.query;
  
  console.log("Received request for courseId:", courseId);
  
  try {
    // Fetch the course by ID
    const course = await prisma.course.findUnique({
      where: {
        id: courseId as string,
      },
    });

    if (!course) {
      console.log("Course not found for courseId:", courseId);
      return res.status(404).json({ error: "Course not found" });
    }

    console.log("Course found:", course);

    const instructorId = parseInt(course.instructorId, 10);
    console.log("Fetching instructor with ID:", instructorId);

    const instructor = await prisma.user.findUnique({
      where: {
        id: instructorId,
      },
    });

    if (!instructor) {
      console.log("Instructor not found for instructorId:", instructorId);
      return res.status(404).json({ error: "Instructor not found" });
    }

    console.log("Instructor found:", instructor);

    res.status(200).json(instructor);
  } catch (error) {
    console.error("Error fetching course or instructor:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
