import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LandingPage } from "@/components/LandingPage";
import { TestInterface } from "@/components/TestInterface";
import { getRandomQuestions, Question } from "@/data/questions";
import { useAuth } from "@/hooks/useAuth";
import { useTestAttempts } from "@/hooks/useTestAttempts";

const QUESTIONS_PER_TEST = 20;

const Index = () => {
  const [isTestActive, setIsTestActive] = useState(false);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [testStartTime, setTestStartTime] = useState<Date | null>(null);
  
  const { user, loading: authLoading } = useAuth();
  const { hasAttempted, loading: attemptsLoading, saveAttempt } = useTestAttempts();
  const navigate = useNavigate();

  const handleStartTest = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const randomQuestions = getRandomQuestions(QUESTIONS_PER_TEST);
    setTestQuestions(randomQuestions);
    setTestStartTime(new Date());
    setIsTestActive(true);
  };



  const handleSubmitTest = async (
    score: number,
    totalQuestions: number,
    answers: Record<number, string>
  ): Promise<{ error: Error | null; qualified: boolean; percentage: number }> => {
    if (testStartTime) {
      const result = await saveAttempt(score, totalQuestions, answers, testStartTime);
      return { 
        error: result.error || null, 
        qualified: result.qualified ?? false, 
        percentage: result.percentage ?? 0 
      };
    }
    return { error: new Error('Test start time not set'), qualified: false, percentage: 0 };
  };

  if (isTestActive && testQuestions.length > 0) {
    return (
      <TestInterface 
        questions={testQuestions} 

        onSubmit={handleSubmitTest}
        hasAttempted={hasAttempted}
      />
    );
  }

  return (
    <LandingPage 
      onStartTest={handleStartTest}
      totalQuestions={QUESTIONS_PER_TEST}
      user={user}
      hasAttempted={hasAttempted}
      loading={authLoading || attemptsLoading}
    />
  );
};

export default Index;
