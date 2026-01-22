import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { 
    ArrowLeft, 
    Mail, 
    MessageSquare,
    Clock,
    Heart,
    Star,
    Send
} from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import EnhancedFooter from '@/components/EnhaceFooter'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

function FeedbackForm() {    
    const navigate = useNavigate()
    const { user } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [feedbackType, setFeedbackType] = useState("Comments")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            toast.success("Thank you for your feedback! We appreciate your input.")
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header user={user} />
            
            <main className="max-w-7xl mx-auto px-4 py-12 md:py-20">
                {/* Back Button */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-slate-600 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                </div>

                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Share Your <span className="text-teal-600">Feedback</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Your insights help us improve. Whether it's a suggestion, a compliment, or a question, we'd love to hear from you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Feedback Form Section */}
                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-teal-50 rounded-xl">
                                <Star className="h-6 w-6 text-teal-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Feedback Details</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Feedback Type */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">Feedback Type</label>
                                <RadioGroup 
                                    defaultValue="Comments" 
                                    onValueChange={setFeedbackType}
                                    className="flex flex-col sm:flex-row gap-4 sm:gap-8"
                                >
                                    {["Comments", "Suggestions", "Questions"].map((type) => (
                                        <div key={type} className="flex items-center space-x-2 cursor-pointer group">
                                            <RadioGroupItem value={type} id={type} className="text-teal-600 border-slate-300 focus:ring-teal-500" />
                                            <Label htmlFor={type} className="text-slate-600 group-hover:text-teal-600 transition-colors cursor-pointer font-medium">
                                                {type}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            {/* Describe Feedback */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">Describe Your Feedback</label>
                                <Textarea 
                                    placeholder="Tell us what's on your mind..." 
                                    required 
                                    className="min-h-[180px] rounded-2xl border-slate-200 focus:border-teal-500 focus:ring-teal-500 bg-slate-50/50"
                                />
                            </div>

                            {/* Name Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">First Name</label>
                                    <Input placeholder="John" required className="rounded-xl border-slate-200 focus:border-teal-500 focus:ring-teal-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">Last Name</label>
                                    <Input placeholder="Doe" required className="rounded-xl border-slate-200 focus:border-teal-500 focus:ring-teal-500" />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">E-mail</label>
                                <Input type="email" placeholder="example@example.com" required className="rounded-xl border-slate-200 focus:border-teal-500 focus:ring-teal-500" />
                            </div>

                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg shadow-teal-100"
                            >
                                {isSubmitting ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send className="h-5 w-5" />
                                        Submit Feedback
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Info Section */}
                    <div className="space-y-8">
                        {/* Why Feedback Matters */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-50 rounded-xl">
                                    <Heart className="h-6 w-6 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">We Value You</h2>
                            </div>
                            <div className="space-y-6">
                                <p className="text-slate-600 leading-relaxed">
                                    Your feedback is the most critical tool we have for growth. Every comment, suggestion, and question is reviewed by our leadership team to ensure we continue to exceed your expectations.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 h-5 w-5 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                                            <div className="h-2 w-2 rounded-full bg-teal-600" />
                                        </div>
                                        <p className="text-sm text-slate-600 font-medium">Continuous Service Improvement</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 h-5 w-5 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                                            <div className="h-2 w-2 rounded-full bg-teal-600" />
                                        </div>
                                        <p className="text-sm text-slate-600 font-medium">Personalized Support Response</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 h-5 w-5 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                                            <div className="h-2 w-2 rounded-full bg-teal-600" />
                                        </div>
                                        <p className="text-sm text-slate-600 font-medium">Direct Impact on Our Solutions</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-teal-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
                            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                <MessageSquare className="h-40 w-40" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-4">Need Immediate Help?</h3>
                                <p className="text-teal-50/80 mb-6 leading-relaxed">
                                    If you have an urgent issue, please reach out to our 24/7 support line directly.
                                </p>
                                <div className="flex flex-col gap-3">
                                    <a href="mailto:support@visionplusindia.in" className="flex items-center gap-3 text-teal-300 hover:text-white transition-colors font-bold">
                                        <Mail className="h-5 w-5" />
                                        support@visionplusindia.in
                                    </a>
                                    <div className="flex items-center gap-3 text-teal-400 font-bold mt-2">
                                        <div className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
                                        <span>24/7 Active Support</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <EnhancedFooter />
        </div>
    )
}

export default FeedbackForm
