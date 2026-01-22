import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface TestAttempt {
  id: string;
  user_id: string;
  score: number;
  total_questions: number;
  percentage: number;
  qualified: boolean;
  answers: Record<number, string> | null;
  started_at: string;
  completed_at: string;
}

export const useTestAttempts = () => {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAttempts();
    } else {
      setAttempts([]);
      setHasAttempted(false);
      setLoading(false);
    }
  }, [user]);

  const fetchAttempts = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('test_attempts')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (!error && data) {
      setAttempts(data as TestAttempt[]);
      setHasAttempted(data.length > 0);
    }
    setLoading(false);
  };

  const saveAttempt = async (
    score: number,
    totalQuestions: number,
    answers: Record<number, string>,
    startedAt: Date
  ) => {
    if (!user) {
      console.log("saveAttempt: User not authenticated.");
      return { error: new Error('Not authenticated') };
    }

    console.log("saveAttempt: User authenticated, user_id:", user.id);

    const percentage = Math.round((score / totalQuestions) * 100);
    const qualified = percentage >= 60;

    const { error } = await supabase
      .from('test_attempts')
      .insert({
        user_id: user.id,
        score,
        total_questions: totalQuestions,
        percentage,
        qualified,
        answers,
        started_at: startedAt.toISOString(),
        completed_at: new Date().toISOString()
      });

    if (error) {
      console.error("saveAttempt: Error inserting test attempt:", error);
    } else {
      console.log("saveAttempt: Test attempt inserted successfully.");
      await fetchAttempts();
    }

    return { error, qualified, percentage };
  };

  return { attempts, loading, hasAttempted, saveAttempt, refetch: fetchAttempts };
};
