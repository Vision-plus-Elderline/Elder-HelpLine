import React, { useState } from 'react';
import { ChevronDown, ChevronRight, LogIn, Star, Phone, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ==================== Statistics Section ====================
interface StatisticsSectionProps {
  className?: string;
}

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({ className = '' }) => {
  const stats = [
    { number: "14567", label: "Helpline Number", icon: <Phone className="w-8 h-8" /> },
    { number: "1000+", label: "Trained Professionals", icon: <Users className="w-8 h-8" /> },
    { number: "24/7", label: "Support Available", icon: <Clock className="w-8 h-8" /> },
    { number: "95%", label: "Satisfaction Rate", icon: <Star className="w-8 h-8" /> }
  ];

  return (
    <section className={`py-20 bg-slate-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Impact in Numbers</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Providing dedicated support and resources to senior citizens across the nation through our specialized training programs.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="group bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                {stat.icon}
              </div>
              <div className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">{stat.number}</div>
              <div className="text-slate-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== FAQs Section ====================
interface FAQ {
  question: string;
  answer: string;
}

interface FAQsSectionProps {
  className?: string;
  faqs?: FAQ[];
}

export const FAQsSection: React.FC<FAQsSectionProps> = ({ 
  className = '',
  faqs: customFaqs
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const defaultFaqs: FAQ[] = [
    {
      question: "How long is the assessment?",
      answer: "The assessment contains 20 questions covering all training modules. You can complete it at your own pace."
    },
    {
      question: "What happens if I don't pass?",
      answer: "Each user gets one attempt. If you score below 60%, you can review the training materials and reapply for another attempt after 30 days."
    },
    {
      question: "Is the certification valid for employment?",
      answer: "Yes, this is an official certification recognized by the Department of Social Justice & Empowerment for Elder Line service positions."
    },
    {
      question: "Can I review my answers after submission?",
      answer: "Yes, you'll receive instant results showing your score, correct answers, and areas for improvement."
    },
    {
      question: "What topics are covered in the assessment?",
      answer: "The assessment covers 9 core modules including Elder Care, Health Services, Legal Rights, Pension Schemes, and more."
    }
  ];

  const faqs = customFaqs || defaultFaqs;

  return (
    <section className={`max-w-5xl mx-auto px-6 py-16 ${className}`}>
      <div className="text-center mb-12">
        <h2 className="font-bold text-3xl text-gray-900 mb-4">Frequently Asked Questions</h2>
        <p className="text-lg text-gray-600">Everything you need to know about the assessment</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full cursor-pointer p-6 font-semibold text-gray-900 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <span>{faq.question}</span>
              <ChevronDown 
                className={`text-teal-600 text-xl transition-transform duration-300 flex-shrink-0 ml-4 ${
                  openIndex === idx ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === idx ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="px-6 pb-6 text-gray-600 border-t border-gray-100 pt-4">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ==================== Testimonials Section ====================
interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar?: string;
}

interface TestimonialsSectionProps {
  className?: string;
  testimonials?: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ 
  className = '',
  testimonials: customTestimonials
}) => {
  const defaultTestimonials: Testimonial[] = [
    {
      name: "Priya Sharma",
      role: "Call Officer, Delhi",
      text: "The training prepared me perfectly for real-world scenarios. I feel confident helping senior citizens every day.",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Field Representative, Mumbai",
      text: "Comprehensive and practical. The assessment ensured I understood all protocols before starting my role.",
      rating: 5
    },
    {
      name: "Anita Desai",
      role: "Call Officer, Bangalore",
      text: "Excellent training program! It covers everything from emotional support to legal procedures.",
      rating: 5
    }
  ];

  const testimonials = customTestimonials || defaultTestimonials;

  return (
    <section className={`bg-gray-50 py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl text-gray-900 mb-4">What Our Trainees Say</h2>
          <p className="text-lg text-gray-600">Success stories from certified Elder Line professionals</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              {/* Testimonial Text */}
              <p className="text-gray-600 mb-4 italic leading-relaxed">
                "{testimonial.text}"
              </p>
              
              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== Final CTA Section ====================
interface FinalCTASectionProps {
  className?: string;
  user?: any;
  hasAttempted?: boolean;
  onStartAssessment?: () => void;
  onLogin?: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({ 
  className = '',
  user,
  hasAttempted = false,
  onStartAssessment,
  onLogin
}) => {
  return (
    <div className={`bg-gradient-to-br max-w-8xl mx-auto from-teal-600 via-teal-500 to-emerald-600 py-20 ${className}`}>
      <div className="max-w-4xl mx-auto px-6 text-center text-white">
        <h2 className="font-bold text-4xl mb-6 leading-tight">
          Ready to Begin Your Journey?
        </h2>
        <p className="text-xl mb-8 opacity-90 leading-relaxed">
          Join hundreds of certified professionals making a difference in elder care across India
        </p>
        
        {/* Conditional CTA Buttons */}
        {!hasAttempted && user && (
          <Button
            onClick={onStartAssessment}
            size="lg"
            className="px-10 py-6 bg-white text-teal-600 rounded-xl text-lg font-bold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center gap-3 h-auto"
          >
            Start Your Assessment Now
            <ChevronRight className="w-6 h-6" />
          </Button>
        )}
        
        {!user && (
          <Button
            onClick={onLogin}
            size="lg"
            className="px-10 py-6 bg-white text-teal-600 rounded-xl text-lg font-bold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center gap-3 h-auto"
          >
            Login to Get Started
            <LogIn className="w-6 h-6" />
          </Button>
        )}

        {hasAttempted && (
          <div className="inline-flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/20 text-white border border-white/30 backdrop-blur-sm">
              <span className="text-lg">✅</span>
              <span className="font-medium">Assessment Already Completed</span>
            </div>
            <p className="text-sm opacity-80">
              Thank you for completing your Elder Line training assessment!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== Export All Components ====================
export default {
  StatisticsSection,
  FAQsSection,
  TestimonialsSection,
  FinalCTASection
};