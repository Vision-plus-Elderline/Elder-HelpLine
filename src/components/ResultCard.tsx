import { CheckCircle, XCircle, Trophy, Home, BarChart3, Target, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface KPIMetric {
  label: string;
  weightage: string;
  target: string;
  achieved: string;
  score: number;
  weightedScore: string;
}

const PERFORMANCE_DATA: KPIMetric[] = [
  { label: "SL (Service Level)", weightage: "15%", target: "95%", achieved: "95%", score: 3, weightedScore: "0.45" },
  { label: "Aband%", weightage: "10%", target: "3%", achieved: "3%", score: 3, weightedScore: "0.30" },
  { label: "AHT (Average Handling Time)", weightage: "10%", target: "300", achieved: "300", score: 3, weightedScore: "0.30" },
  { label: "CQ (Call Quality) Score", weightage: "15%", target: "90%", achieved: "90%", score: 3, weightedScore: "0.45" },
  { label: "CSAT / NPS", weightage: "10%", target: "50%", achieved: "50%", score: 3, weightedScore: "0.30" },
  { label: "FCR (First Call Resolution)", weightage: "10%", target: "60%", achieved: "60%", score: 3, weightedScore: "0.30" },
  { label: "Shrinkage%", weightage: "10%", target: "9%", achieved: "9%", score: 3, weightedScore: "0.30" },
  { label: "Attrition%", weightage: "10%", target: "4%", achieved: "4%", score: 3, weightedScore: "0.30" },
  { label: "Login Adherence", weightage: "5%", target: "95%", achieved: "95%", score: 3, weightedScore: "0.15" },
  { label: "Attendance", weightage: "5%", target: "100%", achieved: "100%", score: 5, weightedScore: "0.25" },
];

interface ResultCardProps {
  score: number;
  total: number;
  percentage: number;
  qualified: boolean;
  onBackToHome: () => void;
  canRetry: boolean;
}

export const ResultCard = ({ 
  score, 
  total, 
  percentage, 
  qualified, 
  onBackToHome,
  canRetry
}: ResultCardProps) => {
  return (
    <div className="animate-scale-in text-center">
      {/* Result Icon */}
      <div className={cn(
        "w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center",
        qualified ? "bg-success/10" : "bg-destructive/10"
      )}>
        {qualified ? (
          <Trophy className="w-12 h-12 text-success" />
        ) : (
          <XCircle className="w-12 h-12 text-destructive" />
        )}
      </div>

      {/* Status */}
      <h1 className={cn(
        "text-3xl md:text-4xl font-display font-bold mb-2",
        qualified ? "text-success" : "text-destructive"
      )}>
        {qualified ? "Congratulations!" : "Keep Learning!"}
      </h1>
      
      <p className="text-muted-foreground text-lg mb-8">
        {qualified 
          ? "You have successfully qualified the assessment." 
          : "You need 60% to qualify. Contact your supervisor for next steps."}
      </p>

      {/* Status Badge */}
      <div className={cn(
        "inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold mb-8",
        qualified 
          ? "bg-success/20 text-success border-2 border-success" 
          : "bg-destructive/20 text-destructive border-2 border-destructive"
      )}>
        {qualified ? (
          <>
            <CheckCircle className="w-6 h-6" />
            QUALIFIED
          </>
        ) : (
          <>
            <XCircle className="w-6 h-6" />
            NOT QUALIFIED
          </>
        )}
      </div>

      {/* Score Display */}
      <div className="bg-card rounded-2xl p-8 shadow-lg border border-border mb-8 max-w-sm mx-auto">
        <div className="text-6xl font-display font-bold text-foreground mb-2">
          {percentage}%
        </div>
        <div className="text-muted-foreground">
          {score} out of {total} correct
        </div>

        {/* Progress ring visual */}
        <div className="mt-6 relative w-32 h-32 mx-auto">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-secondary"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
              className={cn(
                "transition-all duration-1000",
                qualified ? "text-success" : "text-destructive"
              )}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {qualified ? (
              <CheckCircle className="w-10 h-10 text-success" />
            ) : (
              <span className="text-2xl font-bold text-muted-foreground">60%</span>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {qualified ? "Passed" : "Passing score: 60%"}
        </p>
      </div>

      {/* Notice */}
      <div className="bg-muted/50 rounded-lg p-4 mb-8 max-w-md mx-auto">
        <p className="text-sm text-muted-foreground">
          Your result has been saved. Each user is allowed only one attempt at this assessment.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          variant="default" 
          size="lg" 
          onClick={onBackToHome}
          className="gap-2"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};
