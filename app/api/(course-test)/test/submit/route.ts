import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';


interface TestSubmission {
  testId: string;
  studentId: number;
  answers: { questionId: string; selectedOptionId: string }[];
}

export async function POST(request: Request) {
  const { testId, studentId, answers }: TestSubmission = await request.json();

  try {
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: { questions: true },
    });

    let score = 0;
    const answerRecords = await prisma.answer.findMany({
      where: {
        questionId: {
          in: answers.map((ans) => ans.questionId),
        },
      },
    });

    answers.forEach((answer) => {
      const correctAnswer = answerRecords.find(
        (record) => record.questionId === answer.questionId && record.id === answer.selectedOptionId
      );
      if (correctAnswer?.isCorrect) {
        score += 1;
      }
    });

    await prisma.testResult.create({
      data: {
        testId,
        studentId,
        score,
        answers: {
          create: answers.map((answer) => ({
            questionId: answer.questionId,
            text: answer.selectedOptionId,
            isCorrect: answerRecords.some(
              (record) => record.questionId === answer.questionId && record.id === answer.selectedOptionId && record.isCorrect
            ),
          })),
        },
      },
    });

    return NextResponse.json({ message: 'Test submitted successfully', score });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to submit test' }, { status: 500 });
  }
}
