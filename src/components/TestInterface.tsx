import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ProgressBar } from "./ProgressBar";
import { QuestionCard } from "./QuestionCard";
import { ResultCard } from "./ResultCard";
import { TestTimer } from "./TestTimer";
import { useToast } from "@/hooks/use-toast";
import { calculateScore, Question } from "@/data/questions-updated";

const TEST_DURATION_MINUTES = 20; // 20 minutes for 20 questions

interface TestInterfaceProps {
  questions: Question[];
  onSubmit: (score: number, totalQuestions: number, answers: Record<number, string>) => Promise<{
    error: Error | null;
    qualified: boolean;
    percentage: number;
  }>;
  hasAttempted: boolean;
  isEmbedded?: boolean;
}

export const TestInterface = ({ questions, onSubmit, hasAttempted, isEmbedded = false }: TestInterfaceProps) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    total: number;
    percentage: number;
    qualified: boolean;
  } | null>(null);
  const { toast } = useToast();

  const currentQuestion = questions[currentIndex];
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === questions.length - 1;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  // Warn before leaving during test
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSubmitted && answeredCount > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSubmitted, answeredCount]);

  // Handle test submission and exit
  useEffect(() => {
    if (isSubmitted && result) {
      navigate('/engagement');
    }
  }, [isSubmitted, result, navigate]);

  const handleSelectAnswer = (option: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: option
    }));
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (!answers[currentQuestion.id]) {
      toast({
        title: "Please select an answer",
        description: "You must select an option before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (!isLastQuestion) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleSubmit = useCallback(async (isAutoSubmit = false) => {
    if (isSubmitting || isSubmitted) return;

    if (!isAutoSubmit && !allAnswered) {
      toast({
        title: "Incomplete Test",
        description: `Please answer all questions. ${questions.length - answeredCount} question(s) remaining.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    if (isAutoSubmit) {
      toast({
        title: "Time's Up!",
        description: "Your test has been automatically submitted.",
        variant: "destructive",
      });
    }
    
    const testResult = calculateScore(answers, questions);
    
    // Save to database
    const { error, qualified, percentage } = await onSubmit(
      testResult.score,
      testResult.total,
      answers
    );

    if (error) {
      toast({
        title: "Error saving result",
        description: error.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    setResult({
      ...testResult,
      qualified,
      percentage
    });
    setIsSubmitted(true);
    setIsSubmitting(false);
  }, [isSubmitting, isSubmitted, allAnswered, questions, answeredCount, answers, onSubmit, toast]);

  const handleTimeExpired = useCallback(() => {
    handleSubmit(true);
  }, [handleSubmit]);

  if (isSubmitted && result) {
    return null; // Or a loading spinner, as the redirect will happen shortly
  }

  return (
    <div className={`${isEmbedded ? 'w-full' : 'min-h-screen bg-gradient-hero'}`}>
      {/* Header */}
      {!isEmbedded && (
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">EL</span>
                </div>
                <div>
                  <h1 className="font-display font-bold text-foreground">Elder Line Assessment</h1>
                  <p className="text-xs text-muted-foreground">Training Evaluation</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <TestTimer 
                  durationMinutes={TEST_DURATION_MINUTES} 
                  onTimeExpired={handleTimeExpired}
                  isPaused={isSubmitted}
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {answeredCount}/{questions.length}
                  </span>
                  {allAnswered && (
                    <CheckCircle className="w-5 h-5 text-success" />
                  )}
                </div>
              </div>
            </div>
            <ProgressBar current={currentIndex + 1} total={questions.length} />
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`${isEmbedded ? 'w-full py-4' : 'max-w-4xl mx-auto px-4 py-8'}`}>
        {isEmbedded && (
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                <span className="font-bold">{currentIndex + 1}</span>
              </div>
              <div className="text-sm text-slate-500 font-medium">
                Question {currentIndex + 1} of {questions.length}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <TestTimer 
                durationMinutes={TEST_DURATION_MINUTES} 
                onTimeExpired={handleTimeExpired}
                isPaused={isSubmitted}
              />
              <div className="w-32">
                <ProgressBar current={currentIndex + 1} total={questions.length} />
              </div>
            </div>
          </div>
        )}
        <div className={`${isEmbedded ? '' : 'bg-card rounded-2xl shadow-lg border border-border p-6 md:p-8'}`}>

          <QuestionCard
            question={currentQuestion}
            selectedAnswer={answers[currentQuestion.id] || null}
            onSelectAnswer={handleSelectAnswer}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {/* Question dots */}
            <div className="hidden md:flex items-center gap-1">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (answers[questions[idx].id] || idx <= currentIndex) {
                      setCurrentIndex(idx);
                    }
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentIndex
                      ? "bg-primary w-6"
                      : answers[questions[idx].id]
                      ? "bg-success"
                      : "bg-border"
                  }`}
                />
              ))}
            </div>
          </div>

          {isLastQuestion ? (
            <Button
              variant="destructive"
              size="lg"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Submit Test
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="default"
              size="lg"
              onClick={handleNext}
              className="gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Unanswered warning */}
        {isLastQuestion && !allAnswered && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span>
              {questions.length - answeredCount} question(s) not answered yet
            </span>
          </div>
        )}
      </main>
    </div>
  );
};
