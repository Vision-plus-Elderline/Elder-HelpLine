import React, { useState } from 'react'
import { 
  Presentation, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  FileText,
  GraduationCap,
  ClipboardCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export interface Slide {
  id: number;
  img: string;
  title: string;
}

interface TNIProps {
  moduleTitle?: string;
  slides?: Slide[];
  assessmentPath?: string;
  onNext?: () => void;
  onBack?: () => void;
  hasAttempted?: boolean;
}

const defaultSlides: Slide[] = [
  { id: 1, img: "/images/1.png", title: "Introduction to Training Needs Identification" },
  { id: 2, img: "/images/2.png", title: "Identifying Skill Gaps" },
  { id: 3, img: "/images/3.png", title: "Performance Analysis Techniques" },
  { id: 4, img: "/images/4.png", title: "Data Collection and Interpretation" },
  { id: 5, img: "/images/5.png", title: "Implementing Training Solutions" },
];

function TNI({
  moduleTitle = "TNI",
  slides = defaultSlides,
  assessmentPath = "/engagement/assesement",
  onNext,
  onBack,
  hasAttempted = false
}: TNIProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="space-y-8 bg-[#F7F9FC] rounded-md p-6">
      {/* Module Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold mb-6">
          <ClipboardCheck className="h-4 w-4" />
          <span>Organizational Development</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
          TNI <span className="text-teal-600">Module</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          The Training Needs Identification (TNI) module is designed to help professionals pinpoint specific training requirements. 
          It focuses on skill gap analysis, performance metrics, and strategic planning for professional growth.
        </p>
        <div className="bg-teal-600 rounded-[2.5rem] mt-5 p-3">
          <img src="/img2.jpg" alt="" className="w-full h-[100%] object-contain rounded-[2.5rem] p-3" />
        </div>
      </div>

      {/* PPT Showcase Section */}
      <div className="bg-slate-600 rounded-[2.5rem] overflow-hidden mb-24 text-white relative shadow-2xl">
        <div className="p-2 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
              <Presentation className="h-6 w-6 text-teal-400" />
              <h2 className="text-2xl font-bold">PPT {moduleTitle} Training</h2>
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

      {/* Assessment Button Section */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 pt-4">
        <Button 
          onClick={onBack}
          variant="outline"
          className="border-teal-600 text-teal-600 hover:bg-teal-50 px-10 py-6 text-lg rounded-xl transition-all w-full md:w-auto flex items-center gap-2"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </Button>
        
        {hasAttempted ? (
          <Button 
            onClick={onNext}
            className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-6 text-lg rounded-xl shadow-lg hover:shadow-teal-200 transition-all w-full md:w-auto flex items-center gap-2"
          >
            Next Module
            <ChevronRight className="h-5 w-5" />
          </Button>
        ) : (
          <Button 
            onClick={() => navigate('/engagement/assesement')}
            className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-6 text-lg rounded-xl shadow-lg hover:shadow-teal-200 transition-all w-full md:w-auto flex items-center gap-2"
          >
            Start Assessment
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default TNI
