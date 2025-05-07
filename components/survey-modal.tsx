"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const questions = [
  {
    id: 1,
    text: "How do you learn best about shapes?",
    options: [
      "By looking at pictures.",
      "By reading about them.",
      "By hearing someone explain them.",
    ],
  },
  {
    id: 2,
    text: "How do you learn best about angles?",
    options: [
      "By looking at pictures with labels.",
      "By reading the rules.",
      "By hearing examples explained.",
    ],
  },
  {
    id: 3,
    text: "How do you remember area formulas?",
    options: [
      "By looking at charts.",
      "By writing them again and again.",
      "By saying them out loud.",
    ],
  },
  {
    id: 4,
    text: "How do you learn best about perimeter?",
    options: [
      "By looking at shapes on a grid.",
      "By reading the formulas.",
      "By hearing someone solve examples.",
    ],
  },
  {
    id: 5,
    text: "How do you learn best about volume?",
    options: [
      "By looking at 3D shapes.",
      "By reading step-by-step examples.",
      "By hearing the steps explained.",
    ],
  },
  {
    id: 6,
    text: "How do you learn best about surface area?",
    options: [
      "By looking at unfolded shapes.",
      "By reading solved problems.",
      "By hearing real-life examples.",
    ],
  },
  {
    id: 7,
    text: "How do you learn best with a protractor?",
    options: [
      "By watching a demo or video.",
      "By reading the instructions.",
      "By hearing directions.",
    ],
  },
  {
    id: 8,
    text: "How do you review for a test?",
    options: [
      "By using flashcards with pictures.",
      "By rewriting your notes.",
      "By talking with someone.",
    ],
  },
  {
    id: 9,
    text: "How do you learn best about comparing angles?",
    options: [
      "By looking at diagrams side by side.",
      "By reading comparisons.",
      "By hearing an explanation.",
    ],
  },
  {
    id: 10,
    text: "How do you understand perimeter?",
    options: [
      "By looking at grid shapes.",
      "By reading formulas and using them.",
      "By hearing someone solve problems.",
    ],
  },
  {
    id: 11,
    text: "How do you learn best about volume?",
    options: [
      "By looking at 3D models.",
      "By reading examples step by step.",
      "By hearing explanations.",
    ],
  },
  {
    id: 12,
    text: "How do you learn best about surface area?",
    options: [
      "By looking at shapes with surface area worked out.",
      "By reading examples.",
      "By hearing explanations.",
    ],
  },
  {
    id: 13,
    text: "How do you understand angles?",
    options: [
      "By looking at angle pictures.",
      "By reading angle rules.",
      "By hearing explanations.",
    ],
  },
  {
    id: 14,
    text: "How do you solve geometry problems?",
    options: [
      "By looking at diagrams.",
      "By reading solutions.",
      "By talking through the problem.",
    ],
  },
  {
    id: 15,
    text: "How do you learn area and perimeter formulas?",
    options: [
      "By looking at charts with formulas.",
      "By writing the formulas again.",
      "By hearing someone explain them.",
    ],
  },
];

export default function SurveyModal({
  isOpen,
  onClose,
  userId,
}: {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [primary, setPrimary] = useState("");
  const [secondary, setSecondary] = useState("");
  const [tertiary, setTertiary] = useState("");

  const handleStartSurvey = () => {
    setHasStarted(true);
  };

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => [...prev, answer]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      submitSurvey();
    }
  };

  const submitSurvey = async () => {
    setLoading(true);

    const counts: Record<string, number> = {
      Visual: 0,
      "Read & Write": 0,
      Auditory: 0,
    };

    answers.forEach((answer) => {
      const lower = answer.toLowerCase();
      if (
        lower.includes("diagram") ||
        lower.includes("chart") ||
        lower.includes("image") ||
        lower.includes("3d") ||
        lower.includes("video") ||
        lower.includes("animation") ||
        lower.includes("graph")
      ) {
        counts["Visual"]++;
      }
      if (
        lower.includes("write") ||
        lower.includes("notes") ||
        lower.includes("read") ||
        lower.includes("instructions") ||
        lower.includes("proof") ||
        lower.includes("steps")
      ) {
        counts["Read & Write"]++;
      }
      if (
        lower.includes("listen") ||
        lower.includes("hear") ||
        lower.includes("talk") ||
        lower.includes("explain") ||
        lower.includes("recite")
      ) {
        counts["Auditory"]++;
      }
    });

    const sortedStyles = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const primaryStyle = sortedStyles[0]?.[0] || "Visual";
    const secondaryStyle = sortedStyles[1]?.[0] || "Read & Write";
    const tertiaryStyle = sortedStyles[2]?.[0] || "Auditory";

    setPrimary(primaryStyle);
    setSecondary(secondaryStyle);
    setTertiary(tertiaryStyle);

    try {
      await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          primaryStyle,
          secondaryStyle,
          tertiaryStyle,
        }),
      });

      setIsCompleted(true);
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogTitle />
      <DialogOverlay className="fixed inset-0 bg-black/40 backdrop-blur-md pointer-events-none" />
      <DialogContent className="w-full max-w-3xl sm:mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-xl p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {!hasStarted ? (
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold">
                Learning Style Survey
              </h2>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-700 dark:text-gray-300">
                This survey will help us understand your preferred way of
                learning Geometry. Please answer each question honestly to
                receive a customized experience.
              </p>
              <Button
                onClick={handleStartSurvey}
                className="mt-6 px-6 py-3 text-base sm:text-lg"
              >
                Start Survey
              </Button>
            </div>
          ) : isCompleted ? (
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold">
                Survey Completed!
              </h2>
              <p className="mt-3 text-base sm:text-lg text-gray-700 dark:text-gray-300">
                Awesome! Based on your responses,
                your preferred learning styles are:
              </p>
              <ul className="mt-4 space-y-4 text-base sm:text-lg text-gray-800 dark:text-gray-200 text-left max-w-xl mx-auto">
                <li>
                  <strong>Primary:</strong> {primary}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {primary === "Visual"
                      ? "You learn best by seeing pictures, diagrams, videos, and other visual things."
                      : primary === "Read & Write"
                      ? "You learn best by reading explanations and writing notes or answers."
                      : "You learn best by listening to teachers or talking about what you're learning."}
                  </p>
                </li>
                <li>
                  <strong>Secondary:</strong> {secondary}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {secondary === "Visual"
                      ? "You also understand things better when you look at images or watch videos."
                      : secondary === "Read & Write"
                      ? "You also like learning by reading or writing things down."
                      : "You also learn by hearing someone explain or by talking through lessons."}
                  </p>
                </li>
                <li>
                  <strong>Tertiary:</strong> {tertiary}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tertiary === "Visual"
                      ? "Seeing things like drawings or charts can still help you learn better."
                      : tertiary === "Read & Write"
                      ? "Reading and writing still help you, even if it's not your top style."
                      : "Hearing things explained can still help you understand topics more."}
                  </p>
                </li>
              </ul>

              <Button
                className="mt-6 px-6 py-3 text-base sm:text-lg"
                onClick={onClose}
              >
                Proceed
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold">
                Learning Style Survey
              </h2>
              <Progress
                value={(currentQuestion / questions.length) * 100}
                className="mt-4"
              />
              <p className="mt-4 text-base sm:text-lg text-gray-700 dark:text-gray-300">
                {questions[currentQuestion].text}
              </p>

              <div className="mt-6 space-y-2">
                {loading ? (
                  <div className="flex justify-center items-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  </div>
                ) : (
                  questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      className="block w-full text-sm sm:text-base"
                      onClick={() => handleAnswer(option)}
                      disabled={loading}
                    >
                      {option}
                    </Button>
                  ))
                )}
              </div>
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
