"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const questions = [
  {
    id: 1,
    text: "When learning about polygons, I prefer...",
    options: [
      "Seeing diagrams or shape images.",          // Visual
      "Reading explanations and descriptions.",    // Read & Write
      "Listening to someone describe them."        // Auditory
    ],
  },
  {
    id: 2,
    text: "To understand angles, I like to...",
    options: [
      "Look at labeled angle diagrams.",           // Visual
      "Read about angle rules.",                   // Read & Write
      "Hear an explanation with examples."         // Auditory
    ],
  },
  {
    id: 3,
    text: "To remember area formulas, I prefer...",
    options: [
      "Using visual formula charts.",              // Visual
      "Writing the formulas repeatedly.",          // Read & Write
      "Reciting them aloud."                       // Auditory
    ],
  },
  {
    id: 4,
    text: "To learn about the types of triangles, I prefer...",
    options: [
      "Studying triangle images.",                 // Visual
      "Reading the triangle definitions.",         // Read & Write
      "Listening to a teacher explain them."       // Auditory
    ],
  },
  {
    id: 5,
    text: "To understand volume, I like...",
    options: [
      "Viewing 3D shapes or models.",              // Visual
      "Reading step-by-step examples.",            // Read & Write
      "Hearing the steps explained."               // Auditory
    ],
  },
  {
    id: 6,
    text: "To learn about surface area, I prefer...",
    options: [
      "Looking at unfolded shape diagrams.",       // Visual
      "Reading solved problems.",                  // Read & Write
      "Listening to real-life examples."           // Auditory
    ],
  },
  {
    id: 7,
    text: "When using a protractor, I learn best by...",
    options: [
      "Watching a demo or video.",                 // Visual
      "Reading the instructions.",                 // Read & Write
      "Listening to directions."                   // Auditory
    ],
  },
  {
    id: 8,
    text: "When reviewing for a test, I prefer to...",
    options: [
      "Use flashcards with pictures.",             // Visual
      "Read and rewrite notes.",                   // Read & Write
      "Discuss topics with someone."               // Auditory
    ],
  },
  {
    id: 9,
    text: "To compare angles, I like to...",
    options: [
      "View a side-by-side diagram.",              // Visual
      "Read comparison summaries.",                // Read & Write
      "Listen to a comparison explanation."        // Auditory
    ],
  },
  {
    id: 10,
    text: "To understand perimeter, I prefer...",
    options: [
      "Looking at grid-based shapes.",             // Visual
      "Reading formulas and applying them.",       // Read & Write
      "Listening to someone solve examples."       // Auditory
    ],
  },
  {
    id: 11,
    text: "To understand the coordinate plane, I like...",
    options: [
      "Viewing a plotted graph.",                  // Visual
      "Reading about axes and points.",            // Read & Write
      "Hearing how to plot points."                // Auditory
    ],
  },
  {
    id: 12,
    text: "When learning transformations, I prefer...",
    options: [
      "Watching animations or slides.",            // Visual
      "Reading the steps and definitions.",        // Read & Write
      "Hearing how each transformation works."     // Auditory
    ],
  },
  {
    id: 13,
    text: "To understand symmetry, I like to...",
    options: [
      "View symmetrical images.",                  // Visual
      "Read about lines of symmetry.",             // Read & Write
      "Listen to someone explain examples."        // Auditory
    ],
  },
  {
    id: 14,
    text: "To solve geometry problems, I prefer...",
    options: [
      "Using diagrams to understand the problem.", // Visual
      "Reading detailed problem solutions.",       // Read & Write
      "Talking through the problem aloud."         // Auditory
    ],
  },
  {
    id: 15,
    text: "To learn the Pythagorean Theorem, I prefer...",
    options: [
      "Seeing triangle diagrams with formulas.",   // Visual
      "Reading the proof and examples.",           // Read & Write
      "Listening to a teacher explain the steps."  // Auditory
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

    // Count occurrences of each learning style
    const counts: Record<string, number> = { Visual: 0, "Read & Write": 0, Auditory: 0 };
    answers.forEach((answer) => {
      if (answer.includes("diagram") || answer.includes("chart") || answer.includes("image") || answer.includes("3D") || answer.includes("video") || answer.includes("animation") || answer.includes("graph")) counts["Visual"]++;
      if (answer.includes("write") || answer.includes("notes") || answer.includes("read") || answer.includes("instructions") || answer.includes("proof") || answer.includes("steps")) counts["Read & Write"]++;
      if (answer.includes("listen") || answer.includes("hear") || answer.includes("talk") || answer.includes("explain") || answer.includes("recite")) counts["Auditory"]++;
    });

    // Sort styles by highest score
    const sortedStyles = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const primaryStyle = sortedStyles[0]?.[0] || "Visual";
    const secondaryStyle = sortedStyles[1]?.[0] || "Read & Write";
    const tertiaryStyle = sortedStyles[2]?.[0] || "Auditory";

    try {
      await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, primaryStyle, secondaryStyle, tertiaryStyle }),
      });

      setIsCompleted(true);
      console.log("Survey completed!");
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogOverlay className="fixed inset-0 bg-black/40 backdrop-blur-md pointer-events-none" />
      <DialogContent className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {!hasStarted ? (
            // 🔥 INTRODUCTION SCREEN
            <div className="text-center">
              <h2 className="text-2xl font-bold">Learning Style Survey</h2>
              <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
                This survey will help us understand your preferred way of learning Geometry. Please answer each question honestly to receive a customized experience.
              </p>
              <Button onClick={handleStartSurvey} className="mt-6 px-6 py-3 text-lg">
                Start Survey
              </Button>
            </div>
          ) : isCompleted ? (
            // 🔥 SURVEY COMPLETED SCREEN
            <div className="text-center">
              <h2 className="text-2xl font-bold">Survey Completed!</h2>
              <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
                Thank you for completing the survey. Your learning style preferences have been saved!
              </p>
              <Button className="mt-6 px-6 py-3 text-lg" onClick={onClose}>
                Proceed
              </Button>
            </div>
          ) : (
            // 🔥 SURVEY SCREEN
            <div className="text-center">
              <h2 className="text-2xl font-bold">Learning Style Survey</h2>
              <Progress value={(currentQuestion / questions.length) * 100} className="mt-4" />
              <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">{questions[currentQuestion].text}</p>

              <div className="mt-6">
                {questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    className="block w-full mb-2"
                    onClick={() => handleAnswer(option)}
                    disabled={loading}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
