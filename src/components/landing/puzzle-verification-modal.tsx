'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import Image from "next/image";
import { useState, useEffect } from "react";

interface PuzzleVerificationModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const puzzles = [
  { 
    id: 1, 
    image: "https://placehold.co/300x200/E0E7FF/4F46E5?text=Puzzle+1",
    question: "Which of these is a cat?",
    options: ["Dog", "Cat", "Bird"],
    answer: "Cat",
    aiHint: "cat animal",
  },
  { 
    id: 2, 
    image: "https://placehold.co/300x200/B19CD9/FFFFFF?text=Puzzle+2",
    question: "What is 2+2?",
    options: ["3", "4", "5"],
    answer: "4",
    aiHint: "mathematics calculation",
  },
];

export function PuzzleVerificationModal({ isOpen, setIsOpen }: PuzzleVerificationModalProps) {
  const [currentPuzzle, setCurrentPuzzle] = useState(puzzles[0]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Select a random puzzle
      setCurrentPuzzle(puzzles[Math.floor(Math.random() * puzzles.length)]);
      setSelectedOption(null);
      setFeedback(null);
      setIsCorrect(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (selectedOption === currentPuzzle.answer) {
      setFeedback("Correct! Verification successful.");
      setIsCorrect(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 1500);
    } else {
      setFeedback("Incorrect. Please try again.");
      setIsCorrect(false);
      // Potentially allow retry or show another puzzle
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center font-headline">
            <Lightbulb className="h-6 w-6 mr-2 text-primary" />
            Smart Verification
          </DialogTitle>
          <DialogDescription>
            Please solve this quick puzzle to verify your activity.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="w-full h-40 relative rounded-md overflow-hidden">
            <Image 
              src={currentPuzzle.image} 
              alt="Puzzle image" 
              layout="fill"
              objectFit="cover"
              data-ai-hint={currentPuzzle.aiHint}
            />
          </div>
          <p className="text-sm font-medium">{currentPuzzle.question}</p>
          <div className="space-y-2">
            {currentPuzzle.options.map((option) => (
              <Button
                key={option}
                variant={selectedOption === option ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setSelectedOption(option)}
                disabled={feedback !== null}
              >
                {option}
              </Button>
            ))}
          </div>
          {feedback && (
            <div className={`flex items-center p-2 rounded-md text-sm ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {isCorrect ? <CheckCircle className="h-5 w-5 mr-2" /> : <XCircle className="h-5 w-5 mr-2" />}
              {feedback}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!selectedOption || feedback !== null} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
