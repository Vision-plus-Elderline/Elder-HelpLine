import React, { useState } from 'react'
import Header from '@/components/Header'
import EnhancedFooter from '@/components/EnhaceFooter'
import { UserDetailsForm } from '@/components/UserDetailsForm'
import { TestInterface } from '@/components/TestInterface'
import { getRandomQuestions, Question } from '@/data/questions'
import { useAuth } from '@/hooks/useAuth'
import { useTestAttempts } from '@/hooks/useTestAttempts'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Loader2 } from 'lucide-react'

const QUESTIONS_PER_TEST = 20;

function Assesement() {
  const [isTestActive, setIsTestActive] = useState(false);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [testStartTime, setTestStartTime] = useState<Date | null>(null);
  
  const { user, loading: authLoading, isAdmin } = useAuth();
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header user={user} />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto">
          {authLoading || attemptsLoading ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-xl border border-slate-100">
              <Loader2 className="h-12 w-12 text-teal-500 animate-spin mb-4" />
              <p className="text-slate-600 font-medium">Preparing your assessment...</p>
            </div>
          ) : (hasAttempted && !isAdmin) ? (
            <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-lg mx-auto">
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-teal-500" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Assessment Completed</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                You have already completed your assessment attempt. Thank you for your participation.
              </p>
              <button 
                onClick={() => navigate('/engagement')}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
              >
                Return to Engagement Dashboard
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="bg-slate-900 p-8 text-white text-center">
                <h1 className="text-2xl font-bold mb-2">Professional Details</h1>
                <p className="text-slate-400">Please confirm your information to begin the assessment</p>
              </div>
              <div className="p-8">
                <UserDetailsForm
                  onSubmit={(details) => {
                    handleStartTest();
                  }}
                  onCancel={() => navigate('/engagement')}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <EnhancedFooter />
    </div>
  )
}

export default Assesement