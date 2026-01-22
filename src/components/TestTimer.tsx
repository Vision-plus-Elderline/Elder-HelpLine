import { useState, useEffect, useCallback } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface TestTimerProps {
  durationMinutes: number;
  onTimeExpired: () => void;
  isPaused?: boolean;
}

export const TestTimer = ({ durationMinutes, onTimeExpired, isPaused = false }: TestTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(durationMinutes * 60);
  const [hasExpired, setHasExpired] = useState(false);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    if (isPaused || hasExpired) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setHasExpired(true);
          onTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, hasExpired, onTimeExpired]);

  const isLowTime = timeRemaining <= 60; // Last minute warning
  const isCriticalTime = timeRemaining <= 30; // Last 30 seconds

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
        isCriticalTime
          ? "bg-destructive/10 text-destructive animate-pulse"
          : isLowTime
          ? "bg-amber-100 text-amber-700"
          : "bg-secondary text-secondary-foreground"
      }`}
    >
      {isLowTime ? (
        <AlertTriangle className="w-4 h-4" />
      ) : (
        <Clock className="w-4 h-4" />
      )}
      <span className="font-mono">{formatTime(timeRemaining)}</span>
    </div>
  );
};
