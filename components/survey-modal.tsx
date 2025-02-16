"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const questions = [

    { id: 1, text: "When learning about polygons, I understand better when...", options: ["I see different shapes and diagrams.", "I read a detailed explanation with examples."] },
    { id: 2, text: "To understand angles, I prefer...", options: ["Looking at labeled diagrams of angles.", "Writing down the definitions and properties of angles."] },
    { id: 3, text: "When solving for the area of a shape, I learn best by...", options: ["Watching an animation that shows how the formula works.", "Reading step-by-step instructions with examples."] },
    { id: 4, text: "To remember the difference between interior and exterior angles, I prefer...", options: ["Seeing a side-by-side diagram comparing them.", "Taking notes on their definitions and uses."] },
    { id: 5, text: "When calculating volume, I understand better when...", options: ["Seeing a 3D model or diagram of the shape.", "Reading a structured explanation with example problems."] },

    { id: 6, text: "If I need to understand how different polygons are classified, I would rather...", options: ["Read a chart comparing different polygons.", "Listen to a teacher explaining them."] },
    { id: 7, text: "When working with area and perimeter, I remember formulas best when...", options: ["Writing them repeatedly in my notes.", "Saying them out loud to memorize."] },
    { id: 8, text: "If I were asked to explain how to find the sum of interior angles, I would prefer to...", options: ["Write a step-by-step explanation.", "Draw a diagram and label the angles."] },
    { id: 9, text: "When solving problems about surface area, I understand best when...", options: ["Reading example problems and solutions.", "Hearing a breakdown of the calculations."] },
    { id: 10, text: "If I need to learn how to measure angles with a protractor, I would rather...", options: ["Read written instructions and practice with a worksheet.", "Watch a demonstration video."] },

    { id: 11, text: "To learn the properties of triangles, I would rather...", options: ["Listen to a teacher explain the differences.", "Read about each type of triangle in a textbook."] },
    { id: 12, text: "To compare the areas of different shapes, I prefer...", options: ["Listening to an explanation on when to use each formula.", "Looking at a table comparing their formulas."] },
    { id: 13, text: "When reviewing for a test on angles, I learn better by...", options: ["Hearing someone explain different types of angles.", "Writing and reviewing notes on angles."] },
    { id: 14, text: "When studying surface area, I understand more when...", options: ["Listening to a real-world example of how surface area is used.", "Reading a detailed guide with labeled images."] },
    { id: 15, text: "If I need to understand the Pythagorean Theorem, I learn better by...", options: ["Hearing a step-by-step explanation from a teacher.", "Reading different proof methods and examples."] },
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
            if (answer.includes("listen") || answer.includes("talk") || answer.includes("hear")) counts["Audio"]++;
        });

        // Sort styles by highest score
        const sortedStyles = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        const primaryStyle = sortedStyles[0]?.[0] || "Visual";
        const secondaryStyle = sortedStyles[1]?.[0] || "Read & Write";

        try {
            await fetch("/api/user/preferences", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, primaryStyle, secondaryStyle }),
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
