import React, { useState } from 'react'
import { 
  BookOpen, 
  Presentation, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  GraduationCap,
  Target,
  Users,
  Lightbulb
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navigate, useNavigate } from 'react-router-dom';

interface FoundationProps {
  onNext?: () => void;
}

function FoundationTraining({ onNext }: FoundationProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Simulated PPT slides using existing images
  const slides = [
    { id: 1, img: "/images/1.png", title: "Introduction to Health & Wellness" },
    { id: 2, img: "/images/2.png", title: "Core Principles of Elder Care" },
    { id: 3, img: "/images/3.png", title: "Nutrition and Physical Activity" },
    { id: 4, img: "/images/4.png", title: "Mental Health Support" },
    { id: 5, img: "/images/5.png", title: "Protocol and Procedures" },
  ];
const navigate = useNavigate();
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const objectives = [
    {
      icon: <Target className="h-6 w-6 text-teal-600" />,
      title: "Core Understanding",
      desc: "Solid understanding of the basic principles of health and wellness."
    },
    {
      icon: <Users className="h-6 w-6 text-teal-600" />,
      title: "Interactive Learning",
      desc: "Engage in interactive sessions and real-life health challenges."
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-teal-600" />,
      title: "Practical Skills",
      desc: "Receive practical guidance to make positive changes in lives."
    }
  ];

  return (
    <div className="py-12">
      {/* Module Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold mb-6">
          <GraduationCap className="h-4 w-4" />
          <span>Professional Training Module</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Foundation <span className="text-teal-600">Training</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          The Foundation Training module is designed to provide a solid understanding of the basic principles of health and wellness. 
          It covers topics such as physical activity, nutrition, and mental health, with a focus on promoting overall well-being.
        </p>
        <div className="bg-teal-600 rounded-[2.5rem] mt-5 p-3">
        <img src="/img2.jpg" alt="" className="w-full h-[100%] object-contain rounded-[2.5rem] p-3" />
        {/* <h2 className="text-2xl font-bold text-white mt-4">Vision</h2> */}
        </div>
      </div>

      {/* PPT Showcase Section */}
      <div className="bg-slate-600 rounded-[2.5rem] overflow-hidden mb-24 text-white relative shadow-2xl">
        <div className="p-2 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
              <Presentation className="h-6 w-6 text-teal-400" />
              <h2 className="text-2xl font-bold">PPT Foundation Training</h2>
            </div>
            <div className="flex items-center gap-4 bg-white/10 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-teal-100">Slide {currentSlide + 1} of {slides.length}</span>
              <div className="h-4 w-[1px] bg-white/20" />
              <button onClick={() => {}} className="text-teal-400 hover:text-teal-300 transition-colors">
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative group aspect-video bg-black/40 rounded-xl overflow-hidden border border-white/10">
            <img 
              src={slides[currentSlide].img} 
              alt={slides[currentSlide].title}
              className="w-full h-full object-fill"
            />
            
            {/* Navigation Arrows */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-teal-600"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-teal-600"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <h3 className="text-xl font-semibold text-teal-400">{slides[currentSlide].title}</h3>
          </div>
        </div>
      </div>

      {/* Objectives Grid */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Module Objectives</h2>
          <div className="h-1 w-20 bg-teal-600 mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {objectives.map((obj, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-teal-200 hover:shadow-lg transition-all duration-300">
              <div className="mb-6 p-3 bg-teal-50 rounded-xl inline-block">{obj.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{obj.title}</h3>
              <p className="text-slate-600 leading-relaxed">{obj.desc}</p>
            </div>
          ))}
        </div>
      </div>

     
      

      {/* Call to Action */}
      <div className="bg-teal-50 rounded-2xl p-8 md:p-12 text-center border border-teal-100">
        <BookOpen className="h-12 w-12 text-teal-600 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to test your knowledge?</h2>
        <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
          After completing the refresher training, you can proceed to the module assessment to demonstrate your understanding.
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            onClick={onNext}
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-teal-200 transition-all flex items-center gap-2"
          >
            Next Module
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}


export default FoundationTraining