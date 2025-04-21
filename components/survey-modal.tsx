"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const questions = [
    { id: 1, text: "I understand polygons better when...", options: ["I see pictures of the shapes.", "I read examples with explanations."] },
    { id: 2, text: "I learn about angles better when...", options: ["I look at drawings with labels.", "I write notes about angles."] },
    { id: 3, text: "To learn how to find area, I like...", options: ["Watching a video that shows the steps.", "Reading the steps with examples."] },
    { id: 4, text: "I remember inside and outside angles better when...", options: ["I see pictures that compare them.", "I write down what they mean."] },
    { id: 5, text: "I understand volume better when...", options: ["I see a 3D shape or picture.", "I read how to solve it with examples."] },
  
    { id: 6, text: "To learn the types of polygons, I prefer...", options: ["Reading a chart with pictures.", "Listening to my teacher explain them."] },
    { id: 7, text: "I remember area and perimeter formulas better when...", options: ["I write them again and again.", "I say them out loud."] },
    { id: 8, text: "If I explain how to find angle sums, I like to...", options: ["Write the steps.", "Draw and label the angles."] },
    { id: 9, text: "I understand surface area better when...", options: ["I read sample problems.", "I hear someone explain it."] },
    { id: 10, text: "To learn how to use a protractor, I would rather...", options: ["Read how to use it and try it myself.", "Watch someone show how it works."] },
  
    { id: 11, text: "To learn about triangles, I prefer...", options: ["Listening to someone explain them.", "Reading about each kind of triangle."] },
    { id: 12, text: "To compare shapes by area, I like...", options: ["Listening to when to use each formula.", "Looking at a chart of formulas."] },
    { id: 13, text: "To review angles for a test, I like...", options: ["Hearing someone talk about angles.", "Writing notes and reading them."] },
    { id: 14, text: "To understand surface area better, I like...", options: ["Listening to real-life examples.", "Reading with pictures and labels."] },
    { id: 15, text: "To learn the Pythagorean Theorem, I like...", options: ["Listening to a teacher explain it.", "Reading the proofs and examples."] },
  ];

export default function SurveyModal({ isOpen, onClose, userId }: { isOpen: boolean; onClose: () => void; userId: string }) {
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
            if (answer.includes("diagram") || answer.includes("chart") || answer.includes("slides")) counts["Visual"]++;
            if (answer.includes("write") || answer.includes("notes") || answer.includes("read")) counts["Read & Write"]++;
            if (answer.includes("listen") || answer.includes("talk") || answer.includes("hear")) counts["Auditory"]++;
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
                                This survey will help us understand your preferred way of learning Geometry.
                                Please answer each question honestly to receive a customized experience.
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
                            <p className="text-lg font-medium text-center mt-4">{questions[currentQuestion].text}</p>
                            <div className="flex flex-col gap-4 mt-6">
                                {questions[currentQuestion].options.map((option) => (
                                    <Button key={option} onClick={() => handleAnswer(option)} className="w-full" disabled={loading}>
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
