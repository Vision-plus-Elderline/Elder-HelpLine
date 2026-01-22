import { Award, CheckCircle, ChevronRight } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import { useAuth } from '@/hooks/useAuth';
import { useTestAttempts } from '@/hooks/useTestAttempts';
import { useNavigate } from 'react-router-dom';
import Autoplay from 'embla-carousel-autoplay';
import NewsCarousel from './news';

interface HeroProps {
  onStartTest: () => void;
  onShowDetailsForm: () => void;
 
  totalQuestions: number;
  user: any | null;
  hasAttempted: boolean;
  loading: boolean;
}
function Hero({ onStartTest, onShowDetailsForm,  totalQuestions, user, hasAttempted, loading }: HeroProps) {
  const navigate = useNavigate();
  const { signOut, isAdmin } = useAuth();
  const { attempts } = useTestAttempts();
  

  const handleLogout = async () => {
    await signOut();
  };


  // console.log(user?.user_metadata?.full_name);
  return (
    <div>
      
      <div className="text-center max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
          <Award className="w-4 h-4" />
          Official Training Assessment
        </div>

        <h1 className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-slide-up">
          Elder Line{" "}
          <span className="text-gradient">Training</span>{" "}
          Module Wise Assessments for

        </h1>
        <span className="text-gradient font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-slide-up"> CO & FRO</span>{" "}

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Test your knowledge about Elder Line services, protocols, and procedures.
          Complete this assessment to demonstrate your understanding of senior citizen support services.
        </p>

        {/* User Status */}
        {user && (
          <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.15s" }}>
            <p className="text-sm text-muted-foreground mb-2">
              Welcome, <span className="text-foreground font-medium">{user?.user_metadata?.full_name || user?.email}</span>
            </p>

            {hasAttempted && !isAdmin && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">
                  Test Completed
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          {loading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          ) : (hasAttempted && !isAdmin) ? (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                You have already completed your assessment attempt.
              </p>
              <Button variant="outline" disabled>
                Assessment Completed
              </Button>
            </div>
          ) : (!isAdmin) ? (
            // <Button
            //   onClick={onShowDetailsForm}
            //   className="gap-2 w-full sm:w-auto"
            // >
            //   Start Assessment
            //   <ChevronRight className="w-5 h-5" />
            // </Button>
            <Button
              onClick={() => user ? navigate('/engagement') : navigate('/auth')}
              className="gap-2 w-full sm:w-auto"
            >
              Start Engagement
              <ChevronRight className="w-5 h-5" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Hero