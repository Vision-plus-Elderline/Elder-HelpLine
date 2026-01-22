import React from 'react'
import Header from '../Header'
import { useAuth } from '@/hooks/useAuth';
import EnhancedFooter from '../EnhaceFooter';
import FoundationTraining from './components/FoundationTraining';

import { User, Mail, BadgeCheck, Sparkles, BookOpen, Clock, ChevronRight, ClipboardCheck, FileQuestion } from 'lucide-react';
import Refresher from './components/[Refresh]/Refresher';
import TNI from './components/TNI/TNI';
import { TestInterface } from '../TestInterface';
import { UserDetailsForm } from '../UserDetailsForm';
import { Certification } from './components/Certification';
import { Award, BarChart3, ShieldCheck } from 'lucide-react';
import { questions as testQuestions } from '@/data/questions-updated';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { UserPage } from '../User';

function Engagement() {
  const { user } = useAuth();
  const [activeModule, setActiveModule] = React.useState<'foundation' | 'refresher' | 'tni' | 'assessment' | 'certification' | 'prt' | 'performance'>('foundation');
  const [isDetailsSubmitted, setIsDetailsSubmitted] = React.useState(false);
  const [hasAttempted, setHasAttempted] = React.useState(false);
  const [testResult, setTestResult] = React.useState<{ score: number; total: number; qualified: boolean; percentage: number } | null>(null);
  const [showRegistration, setShowRegistration] = React.useState(false);
  const [progress, setProgress] = React.useState({
    foundation: 0,
    refresher: 0,
    tni: 0,
    assessment: 0,
    certification: 0,
    prt: 0,
    performance: 0
  });

  const userDetails = user?.user_metadata || {};
  const name = userDetails.full_name || user?.email;
  const empId = userDetails.emp_id || 'N/A';
  const { toast } = useToast();
const navigate = useNavigate();
  const handleTestSubmit = async (score: number, totalQuestions: number, answers: Record<number, string>) => {
    try {
      const percentage = (score / totalQuestions) * 100;
      const qualified = percentage >= 80;

      const { error } = await supabase
        .from('test_attempts')
        .insert([
          {
            user_id: user?.id,
            score,
            total_questions: totalQuestions,
            percentage,
            qualified,
            answers,
            completed_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      setProgress(prev => ({ ...prev, assessment: 100 }));
      return { error: null, qualified, percentage };
    } catch (error: any) {
      console.error('Error submitting test:', error);
      return { error, qualified: false, percentage: 0 };
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (activeModule === 'foundation') setActiveModule('refresher');
    else if (activeModule === 'refresher') setActiveModule('tni');
    else if (activeModule === 'tni') setActiveModule('assessment');
  };

  const handleBack = () => {
    if (activeModule === 'refresher') setActiveModule('foundation');
    else if (activeModule === 'tni') setActiveModule('refresher');
    else if (activeModule === 'assessment') setActiveModule('tni');
  };

  // Handle scroll to update progress and auto-switch modules
  React.useEffect(() => {
    const handleScroll = () => {
      if (activeModule === 'assessment') return; // Don't auto-switch from assessment
     
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      
      const scrolled = Math.min(
        Math.round((scrollPosition / (fullHeight - windowHeight)) * 100),
        100
      );

      setProgress(prev => ({
        ...prev,
        [activeModule]: Math.max(prev[activeModule], scrolled)
      }));

      if (scrolled >= 98) {
        if (activeModule === 'foundation') {
          setTimeout(() => {
            setActiveModule('refresher');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 500);
        } else if (activeModule === 'refresher') {
          setTimeout(() => {
            setActiveModule('tni');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 500);
        } else if (activeModule === 'tni') {
          setTimeout(() => {
            setActiveModule('assessment');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 500);
        } else if (activeModule === 'certification') {
          setTimeout(() => {
            setActiveModule('prt');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 500);
        } else if (activeModule === 'prt') {
          setTimeout(() => {
            setActiveModule('performance');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 500);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeModule]);

  // Scroll to top when module changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeModule]);

  // Check initial status and previous attempts
  React.useEffect(() => {
    const checkStatus = async () => {
      if (!user?.id) return;

      // Check details
      const { data: detailsData } = await supabase
        .from('user_details')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (detailsData) {
        setIsDetailsSubmitted(true);
      }

      // Check previous attempts
      const { data: attemptData } = await supabase
        .from('test_attempts')
        .select('score, total_questions, qualified, percentage')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (attemptData) {
        setHasAttempted(true);
        setTestResult({
          score: attemptData.score,
          total: attemptData.total_questions,
          qualified: attemptData.qualified,
          percentage: attemptData.percentage
        });
        setProgress(prev => ({ ...prev, assessment: 100 }));
      }
    };
    checkStatus();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header user={user} />

      {/* Decorative Hero Section */}
      <div className="relative bg-teal-800 pt-16 pb-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-teal-500 blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-blue-500 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in">
              <Sparkles className="h-3 w-3" />
              Professional Certification Path
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Employee <span className="text-teal-400">Engagement</span> Activity
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
              Welcome to your specialized training portal. Track your progress, review modules, and complete your engagements.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-8xl mx-auto px-16 -mt-16 pb-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Sidebar: User Profile Card */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sticky top-8">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-teal-200">
                  <User className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{name}</h2>
                <div className="flex items-center gap-1.5 text-teal-600 font-semibold text-sm mt-1">
                  <BadgeCheck className="h-4 w-4" />
                  Verified Professional
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
                    <span className="text-sm font-medium text-slate-700 truncate max-w-[180px]">{user?.email}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employee ID</span>
                    <span className="text-sm font-medium text-slate-700">{empId}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-teal-600" />
                  Available Modules
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveModule('foundation')}
                    className={`w-full text-left group transition-all ${activeModule === 'foundation' ? 'scale-[1.02]' : ''}`}
                  >
                    <div className={`p-4 rounded-2xl border transition-all ${activeModule === 'foundation'
                      ? 'bg-teal-50 border-teal-200 shadow-sm'
                      : 'bg-white border-slate-100 hover:border-teal-100 hover:bg-slate-50'
                      }`}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          {activeModule === 'foundation' && <BookOpen className="h-3.5 w-3.5 text-teal-600" />}
                          <span className={`text-xs font-bold uppercase tracking-wider ${activeModule === 'foundation' ? 'text-teal-700' : 'text-slate-400'
                            }`}>Foundation Training</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-transform ${activeModule === 'foundation' ? 'text-teal-600 rotate-90' : 'text-slate-300 group-hover:translate-x-1'
                          }`} />
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-500 transition-all duration-300 rounded-full" 
                          style={{ width: `${progress.foundation}%` }}
                        />
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveModule('refresher')}
                    className={`w-full text-left group transition-all ${activeModule === 'refresher' ? 'scale-[1.02]' : ''}`}
                  >
                    <div className={`p-4 rounded-2xl border transition-all ${activeModule === 'refresher'
                      ? 'bg-teal-50 border-teal-200 shadow-sm'
                      : 'bg-white border-slate-100 hover:border-teal-100 hover:bg-slate-50'
                      }`}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          {activeModule === 'refresher' && <Clock className="h-3.5 w-3.5 text-teal-600" />}
                          <span className={`text-xs font-bold uppercase tracking-wider ${activeModule === 'refresher' ? 'text-teal-700' : 'text-slate-400'
                            }`}>Refresher Module</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-transform ${activeModule === 'refresher' ? 'text-teal-600 rotate-90' : 'text-slate-300 group-hover:translate-x-1'
                          }`} />
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-500 transition-all duration-300 rounded-full" 
                          style={{ width: `${progress.refresher}%` }}
                        />
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveModule('tni')}
                    className={`w-full text-left group transition-all ${activeModule === 'tni' ? 'scale-[1.02]' : ''}`}
                  >
                    <div className={`p-4 rounded-2xl border transition-all ${activeModule === 'tni'
                      ? 'bg-teal-50 border-teal-200 shadow-sm'
                      : 'bg-white border-slate-100 hover:border-teal-100 hover:bg-slate-50'
                      }`}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          {activeModule === 'tni' && <ClipboardCheck className="h-3.5 w-3.5 text-teal-600" />}
                          <span className={`text-xs font-bold uppercase tracking-wider ${activeModule === 'tni' ? 'text-teal-700' : 'text-slate-400'
                            }`}>TNI Module</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-transform ${activeModule === 'tni' ? 'text-teal-600 rotate-90' : 'text-slate-300 group-hover:translate-x-1'
                          }`} />
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-500 transition-all duration-300 rounded-full" 
                          style={{ width: `${progress.tni}%` }}
                        />
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveModule('assessment')}
                    className={`w-full text-left group transition-all ${activeModule === 'assessment' ? 'scale-[1.02]' : ''}`}
                  >
                    <div className={`p-4 rounded-2xl border transition-all ${activeModule === 'assessment'
                      ? 'bg-teal-50 border-teal-200 shadow-sm'
                      : 'bg-white border-slate-100 hover:border-teal-100 hover:bg-slate-50'
                      }`}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2" 
                      
                         onClick={() => navigate('/engagement/assesement')}
                        >
                          {/* {activeModule === 'assessment' && <FileQuestion className="h-3.5 w-3.5 text-teal-600" />} */}
                          <span className={`text-xs font-bold uppercase tracking-wider ${activeModule === 'assessment' ? 'text-teal-700' : 'text-slate-400'
                            }`}>Module Assessment</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-transform ${activeModule === 'assessment' ? 'text-teal-600 rotate-90' : 'text-slate-300 group-hover:translate-x-1'
                          }`} />
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-500 transition-all duration-300 rounded-full" 
                          style={{ width: `${progress.assessment}%` }}
                        />
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveModule('certification')}
                    className={`w-full text-left group transition-all ${activeModule === 'certification' ? 'scale-[1.02]' : ''}`}
                  >
                    <div className={`p-4 rounded-2xl border transition-all ${activeModule === 'certification'
                      ? 'bg-teal-50 border-teal-200 shadow-sm'
                      : 'bg-white border-slate-100 hover:border-teal-100 hover:bg-slate-50'
                      }`}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Award className={`h-3.5 w-3.5 ${activeModule === 'certification' ? 'text-teal-600' : 'text-slate-400'}`} />
                          <span className={`text-xs font-bold uppercase tracking-wider ${activeModule === 'certification' ? 'text-teal-700' : 'text-slate-400'
                            }`}>Certification</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-transform ${activeModule === 'certification' ? 'text-teal-600 rotate-90' : 'text-slate-300 group-hover:translate-x-1'
                           }`} />
                       </div>
                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-500 transition-all duration-300 rounded-full" 
                          style={{ width: `${progress.certification}%` }}
                        />
                      </div>
                     </div>
                   </button>
 
                   <button
                     onClick={() => setActiveModule('prt')}
                     className={`w-full text-left group transition-all ${activeModule === 'prt' ? 'scale-[1.02]' : ''}`}
                   >
                     <div className={`p-4 rounded-2xl border transition-all ${activeModule === 'prt'
                       ? 'bg-teal-50 border-teal-200 shadow-sm'
                       : 'bg-white border-slate-100 hover:border-teal-100 hover:bg-slate-50'
                       }`}>
                       <div className="flex justify-between items-center mb-2">
                         <div className="flex items-center gap-2">
                           <ShieldCheck className={`h-3.5 w-3.5 ${activeModule === 'prt' ? 'text-teal-600' : 'text-slate-400'}`} />
                           <span className={`text-xs font-bold uppercase tracking-wider ${activeModule === 'prt' ? 'text-teal-700' : 'text-slate-400'
                             }`}>PRT</span>
                         </div>
                         <ChevronRight className={`h-4 w-4 transition-transform ${activeModule === 'prt' ? 'text-teal-600 rotate-90' : 'text-slate-300 group-hover:translate-x-1'
                           }`} />
                       </div>
                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-500 transition-all duration-300 rounded-full" 
                          style={{ width: `${progress.prt}%` }}
                        />
                      </div>
                     </div>
                   </button>
 
                   <button
                     onClick={() => setActiveModule('performance')}
                     className={`w-full text-left group transition-all ${activeModule === 'performance' ? 'scale-[1.02]' : ''}`}
                   >
                     <div className={`p-4 rounded-2xl border transition-all ${activeModule === 'performance'
                       ? 'bg-teal-50 border-teal-200 shadow-sm'
                       : 'bg-white border-slate-100 hover:border-teal-100 hover:bg-slate-50'
                       }`}>
                       <div className="flex justify-between items-center mb-2">
                         <div className="flex items-center gap-2">
                           <BarChart3 className={`h-3.5 w-3.5 ${activeModule === 'performance' ? 'text-teal-600' : 'text-slate-400'}`} />
                           <span className={`text-xs font-bold uppercase tracking-wider ${activeModule === 'performance' ? 'text-teal-700' : 'text-slate-400'
                             }`}>Performance</span>
                         </div>
                         <ChevronRight className={`h-4 w-4 transition-transform ${activeModule === 'performance' ? 'text-teal-600 rotate-90' : 'text-slate-300 group-hover:translate-x-1'
                           }`} />
                       </div>
                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-500 transition-all duration-300 rounded-full" 
                          style={{ width: `${progress.performance}%` }}
                        />
                      </div>
                     </div>
                   </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content: Training Modules */}
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
                <div className="h-12 w-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
                  {activeModule === 'tni' ? <ClipboardCheck className="h-6 w-6" /> : <BookOpen className="h-6 w-6" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {activeModule === 'foundation' ? 'Foundation Coursework' : 
                     activeModule === 'refresher' ? 'Refresher Coursework' : 
                     activeModule === 'tni' ? 'TNI Coursework' :
                     activeModule === 'certification' ? 'Certification' :
                     activeModule === 'prt' ? 'PRT' :
                     activeModule === 'performance' ? 'Performance' :
                     'Final Assessment'}
                  </h2>
                  <p className="text-slate-500">
                    {activeModule === 'foundation'
                      ? 'Complete the foundational modules below to earn your certification.'
                      : activeModule === 'refresher'
                      ? 'Review the refresher materials to stay up to date with the latest standards.'
                      : activeModule === 'tni'
                      ? 'Identify and analyze training needs for professional development.'
                      : activeModule === 'certification'
                      ? 'View and download your earned certifications.'
                      : activeModule === 'prt'
                      ? 'Performance Review Tracking and metrics.'
                      : activeModule === 'performance'
                      ? 'Your performance analytics and growth tracking.'
                      : 'Demonstrate your knowledge and earn your engagement.'}
                  </p>
                </div>
              </div>

              {activeModule === 'foundation' ? (
                <FoundationTraining onNext={handleNext} />
              ) : activeModule === 'refresher' ? (
                  <Refresher onNext={handleNext} onBack={handleBack} />
                ) : activeModule === 'tni' ? (
                    <TNI onNext={handleNext} onBack={handleBack} hasAttempted={hasAttempted} />
                  ) : activeModule === 'certification' ? (
                    <Certification />
                  ) : activeModule === 'prt' ? (
                    <div className="py-20 text-center text-slate-500">PRT Module Content Coming Soon</div>
                  ) : activeModule === 'performance' ? (
                    <UserPage/>
                    // <div className="py-20 text-center text-slate-500">Performance Module Content Coming Soon</div>
                  ) : (
                    <div className="relative">
                      {hasAttempted && testResult ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl shadow-sm border border-slate-100">
                          <div className={`p-6 rounded-full mb-6 ${testResult.qualified ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            <BadgeCheck className="h-12 w-12" />
                          </div>
                          <h2 className="text-3xl font-bold text-slate-900 mb-2">Test Already Completed</h2>
                          <p className="text-slate-500 mb-8">
                            You have already submitted your assessment for this module.
                          </p>
{/* 
this the qualified or not  */}
                          {/* <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-10">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                              <div className="text-2xl font-bold text-slate-900">{testResult.percentage.toFixed(1)}%</div>
                              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Final Score</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                              <div className={`text-sm font-bold uppercase tracking-wider ${testResult.qualified ? 'text-green-600' : 'text-red-600'}`}>
                                {testResult.qualified ? 'Qualified' : 'Not Qualified'}
                              </div>
                              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</div>
                            </div>
                          </div> */}

                          <Button 
                            onClick={() => setActiveModule('certification')}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-6 text-lg rounded-2xl shadow-lg transition-all"
                          >
                            View Certifications 
                          </Button>
                        </div>
                      ) : isDetailsSubmitted ? (
                         <TestInterface 
                           questions={testQuestions} 
                           onSubmit={handleTestSubmit} 
                           hasAttempted={false} 
                           isEmbedded={true}
                         />
                       ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl shadow-sm border border-slate-100">
                          <div className="bg-teal-50 p-6 rounded-full mb-6">
                            <FileQuestion className="h-12 w-12 text-teal-600" />
                          </div>
                          <h2 className="text-3xl font-bold text-slate-900 mb-4">Final Assessment</h2>
                          <p className="text-slate-600 mb-10 max-w-md mx-auto">
                            Ready to certify your knowledge? Click below to complete your registration and begin the final assessment.
                          </p>
                          <Button 
                            onClick={() => navigate('/engagement/assesement')}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-7 text-lg rounded-2xl shadow-lg hover:shadow-teal-200 transition-all flex items-center gap-3 group"
                          >
                            <span>Start Assessment</span>
                            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </Button>
                          
                          {showRegistration && (
                            <UserDetailsForm 
                              onSubmit={() => {
                                setIsDetailsSubmitted(true);
                                setShowRegistration(false);
                              }} 
                              onCancel={() => setShowRegistration(false)} 
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )}
               
            </div>
          
          </div>
        </div>
      </main>

      <EnhancedFooter />
      
    </div>
  )
}

export default Engagement