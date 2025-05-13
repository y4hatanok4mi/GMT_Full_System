"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LessonTopBar } from "@/components/layout/lesson-topbar";
import Image from "next/image";

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

interface ExercisePageProps {
  params: {
    moduleId: string;
    lessonId: string;
  };
}

const ExercisePage = ({ params }: ExercisePageProps) => {
  const { moduleId, lessonId } = params;
  const [questions, setQuestions] = useState<any[]>([]);
  const [lessonName, setLessonName] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [notification, setNotification] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<
    "success" | "error" | null
  >(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<
    "correct" | "incorrect" | null
  >(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isRetakeAllowed, setIsRetakeAllowed] = useState<boolean>(false); // Track if retake is allowed
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch questions for the lesson
        const { data: questionData } = await axios.get(
          `/api/modules/${moduleId}/lessons/${lessonId}/getquestions`
        );
        const randomizedQuestions = shuffleArray(questionData?.questions || []);

        // Shuffle options for each question
        const shuffledQuestionsWithOptions = randomizedQuestions.map(
          (question: any) => ({
            ...question,
            options: shuffleArray(question.options),
          })
        );

        setQuestions(shuffledQuestionsWithOptions);

        // Fetch lesson name
        const { data: lessonData } = await axios.get(
          `/api/modules/${moduleId}/lessons/${lessonId}/getlesson`
        );
        setLessonName(lessonData?.lesson?.title || "Lesson Name Not Found");

        // Fetch user points (if needed)
        const { data: pointsData } = await axios.get(`/api/user/points`);
        setUserPoints(pointsData.points || 0);

        // Check if a retake is allowed (based on previous exercise result)
        const { data: existingResult } = await axios.get(
          `/api/modules/${moduleId}/lessons/${lessonId}/exercise-result`
        );
        if (existingResult) {
          const passingScoreThreshold =
            (existingResult.totalQuestions * 60) / 100; // 60% passing score
          if (existingResult.score < passingScoreThreshold) {
            setIsRetakeAllowed(true); // Allow retake only if score is below passing threshold
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [lessonId, moduleId]);

  const handleAnswerSelection = (selectedOptionId: string) => {
    if (!isChecked) {
      setSelectedAnswer(selectedOptionId);
    }
  };

  const checkAnswer = async () => {
    if (!selectedAnswer) {
      alert("Please select an answer first!");
      return;
    }

    try {
      const currentQuestion = questions[currentQuestionIndex];
      const { data: userData } = await axios.get("/api/get-current-user");

      const userId = userData?.id;
      if (!userId) {
        console.error("User not authenticated");
        return;
      }

      // Submit the selected answer and get the result
      const response = await axios.post(
        `/api/modules/${moduleId}/lessons/${lessonId}/questions/${currentQuestion.id}/submit-answer`,
        {
          studentId: userId,
          questionId: currentQuestion.id,
          selectedOptionId: selectedAnswer,
        }
      );

      const { isCorrect } = response.data;
      setAnswerStatus(isCorrect ? "correct" : "incorrect");
      setNotificationType(isCorrect ? "success" : "error");
      setNotification(isCorrect ? "Well done!" : "Nice try!");

      setIsChecked(true);
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("An error occurred while submitting the answer.");
    }
  };

  const goToNextQuestion = () => {
    setNotification(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setAnswerStatus(null);
      setIsChecked(false);
    }
  };

  const completeQuestions = async () => {
    try {
      // Fetch the exercise result (user's score)
      const { data: existingResult } = await axios.get(
        `/api/modules/${moduleId}/lessons/${lessonId}/exercise-result`
      );
      if (!existingResult) {
        alert("Exercise result not found.");
        return;
      }

      const { score } = existingResult;

      // Fetch the total number of questions for the exercise
      const { data: questionData } = await axios.get(
        `/api/modules/${moduleId}/lessons/${lessonId}/get-questions-count`
      );
      if (!questionData || !questionData.count) {
        alert("Questions not found.");
        return;
      }

      const totalQuestions = questionData.count;

      // Calculate the passing threshold as 60% of the total number of questions
      const passingScoreThreshold = (totalQuestions * 60) / 100;

      // Check if the student's score meets or exceeds the passing threshold
      if (score >= passingScoreThreshold) {
        await axios.post(
          `/api/modules/${moduleId}/lessons/${lessonId}/exercise-result`,
          {
            score: score,
          }
        );
        router.push(
          `/student/modules/${moduleId}/lessons/${lessonId}/complete`
        );
      } else {
        router.replace(
          `/student/modules/${moduleId}/lessons/${lessonId}/retake`
        );
      }
    } catch (error) {
      console.error("Error completing lesson:", error);
      alert("An error occurred while completing the lesson.");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center pt-24 dark:bg-slate-900 dark:text-white">
      <LessonTopBar params={params} lessonName={lessonName} />

      <div className="flex flex-col justify-center items-center p-4 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 pt-20 sm:pt-6 py-4">
        <div className="text-sm text-gray-500 mb-2">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-center h-auto mb-4">
          {questions[currentQuestionIndex]?.question ||
            "No question available."}
        </h2>

        {questions[currentQuestionIndex]?.image && (
          <div className="mt-4">
            <Image
              width={300}
              height={200}
              src={questions[currentQuestionIndex]?.image}
              alt="Question Image"
              className="max-w-full h-auto rounded-md"
            />
          </div>
        )}

        <div className="flex flex-col gap-2 w-full md:w-3/4 lg:w-1/2 space-y-2">
          {questions[currentQuestionIndex]?.type === "MULTIPLE_CHOICE" ? (
            questions[currentQuestionIndex]?.options?.map(
              (option: { text: string; id: string }, index: number) => (
                <button
                  key={index}
                  className={`w-full p-2 md:p-4 border rounded-md transition-all
        ${
          selectedAnswer === option.id
            ? "bg-blue-500 text-white"
            : "bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
        }`}
                  onClick={() => handleAnswerSelection(option.id)}
                  disabled={isChecked}
                >
                  {option.text}
                </button>
              )
            )
          ) : questions[currentQuestionIndex]?.type === "FILL_IN_THE_BLANK" ? (
            <input
              type="text"
              placeholder="Type your answer here..."
              value={selectedAnswer || ""}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-slate-700 dark:text-white text-gray-900"
              disabled={isChecked}
            />
          ) : (
            <div className="text-center text-red-500">
              Unsupported question type.
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center p-4 bg-slate-200 shadow-lg fixed bottom-0 left-0 right-0 z-10 dark:bg-slate-800">
        <div className="flex flex-col md:flex-col space-x-4 items-center">
          {notification && (
            <div
              className={`w-full text-lg text-center py-2 rounded-md 
              ${
                notificationType === "success"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {notification}
            </div>
          )}
          {!isChecked ? (
            <Button
              onClick={checkAnswer}
              className="w-40 md:w-60"
              disabled={!selectedAnswer}
            >
              Submit
            </Button>
          ) : currentQuestionIndex === questions.length - 1 ? (
            <Button onClick={completeQuestions} className="w-40 md:w-60">
              Complete
            </Button>
          ) : (
            <Button onClick={goToNextQuestion} className="w-40 md:w-60">
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExercisePage;
