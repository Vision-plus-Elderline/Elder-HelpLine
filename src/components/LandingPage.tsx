import { Phone, Clock, Shield, Award, ChevronRight, Users, Heart, LogIn, LogOut, Settings, CheckCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTestAttempts } from "@/hooks/useTestAttempts";
import { User } from "@supabase/supabase-js";
import { UserDetailsForm } from "./UserDetailsForm";
import  { useState } from 'react';

import EnhancedFooter from "./EnhaceFooter";

import Hero from "./Hero";

import Header from "./Header";
import Carasoul from "./CarasoulHero";
import { FAQsSection, StatisticsSection, TestimonialsSection } from "./comp";


interface LandingPageProps {
  onStartTest: () => void;
  totalQuestions: number;
  user: User | null;
  hasAttempted: boolean;
  loading: boolean;
}

export const LandingPage = (
  { onStartTest, totalQuestions, user, hasAttempted, loading }: LandingPageProps) => {
  const [showUserDetailsForm, setShowUserDetailsForm] = useState(false);
  const navigate = useNavigate();
  const { signOut, isAdmin } = useAuth();
  const { attempts } = useTestAttempts();

  const lastAttempt = attempts[0];

  const handleLogout = async () => {
    await signOut();
  };

  // console.log(user?.user_metadata?.full_name);
  return (
    <div className="w-full bg-gradient-hero">
      <Header user={user} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-8xl mx-auto px-4 py-8">
          <Carasoul />

          {/* Hero Content */}
          <Hero
            onStartTest={onStartTest}
            onShowDetailsForm={() => setShowUserDetailsForm(true)}
            totalQuestions={totalQuestions}
            user={user}
            hasAttempted={hasAttempted}
            loading={loading}
          />
        </div>
      </section>





      {showUserDetailsForm && (
        <UserDetailsForm
          onSubmit={(details) => {
            // console.log('User details submitted:', details);

            setShowUserDetailsForm(false);
            onStartTest(); // Proceed to start the test after form submission
          }}
          onCancel={() => setShowUserDetailsForm(false)}
        />
      )}

      {/* Info Cards */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground mb-2">
              {totalQuestions} Questions
            </h3>
            <p className="text-muted-foreground text-sm">
              Comprehensive assessment covering all aspects of Elder Line services and protocols.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground mb-2">
              60% Pass Rate
            </h3>
            <p className="text-muted-foreground text-sm">
              Score at least 60% to qualify. Review your results instantly after completion.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground mb-2">
              One Attempt Only
            </h3>
            <p className="text-muted-foreground text-sm">
              Each user can take the test only once. Make sure you're prepared before starting.
            </p>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
          <h2 className="font-display font-bold text-2xl text-foreground mb-6 text-center">
            Assessment Topics
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Introduction & Vision",
              "Role of Call Officers",
              "Health Services",
              "Elder Care",
              "Legal Rights",
              "Pension Schemes",
              "Field Intervention",
              "Emotional Support",
              "Nutrition Guidelines"
            ].map((topic, idx) => (
              <div
                key={topic}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                  {idx + 1}
                </div>
                <span className="text-foreground font-medium">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stattiscs */}
      <StatisticsSection />
      <TestimonialsSection />
      
      <FAQsSection />
      
      <EnhancedFooter />
    </div>
  );
};
