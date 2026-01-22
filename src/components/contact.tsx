import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { 
    ArrowLeft, 
    Mail, 
    Phone, 
    MapPin, 
    Send,
    MessageSquare,
    Building,
    Clock
} from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import EnhancedFooter from '@/components/EnhaceFooter'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

function Contact() {    
    const navigate = useNavigate()
    const { user } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            toast.success("Message sent successfully! We'll get back to you soon.")
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
                        Let's <span className="text-teal-600">Connect</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        We are eager to start a conversation with you. Drop us a note, ask a question or just say hi.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Contact Form Section */}
                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-teal-50 rounded-xl">
                                <MessageSquare className="h-6 w-6 text-teal-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Send us a Message</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">Name</label>
                                    <Input placeholder="Your Name" required className="rounded-xl border-slate-200 focus:border-teal-500 focus:ring-teal-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">Company</label>
                                    <Input placeholder="Company Name" className="rounded-xl border-slate-200 focus:border-teal-500 focus:ring-teal-500" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">Phone</label>
                                    <Input type="tel" placeholder="+91 00000 00000" required className="rounded-xl border-slate-200 focus:border-teal-500 focus:ring-teal-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                                    <Input type="email" placeholder="email@example.com" required className="rounded-xl border-slate-200 focus:border-teal-500 focus:ring-teal-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Message</label>
                                <Textarea 
                                    placeholder="How can we help you?" 
                                    required 
                                    className="min-h-[150px] rounded-xl border-slate-200 focus:border-teal-500 focus:ring-teal-500"
                                />
                            </div>
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg shadow-teal-100"
                            >
                                {isSubmitting ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send className="h-5 w-5" />
                                        Send Message
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Info Section */}
                    <div className="space-y-8">
                        {/* Office Location */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-50 rounded-xl">
                                    <Building className="h-6 w-6 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Our Locations</h2>
                            </div>
                            <div className="space-y-6">
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-teal-600" />
                                        Registered Office (Delhi)
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed mb-4">
                                        C-60, Rajan babu Road, 1st Floor,<br />
                                        Adarsh Nagar, Delhi - 110033
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        <a href="mailto:sales@visionplusindia.in" className="flex items-center gap-3 text-slate-600 hover:text-teal-600 transition-colors">
                                            <Mail className="h-4 w-4" />
                                            sales@visionplusindia.in
                                        </a>
                                        <a href="tel:+911127676088" className="flex items-center gap-3 text-slate-600 hover:text-teal-600 transition-colors">
                                            <Phone className="h-4 w-4" />
                                            +91 11 2767 6088 / 4808
                                        </a>
                                    </div>
                                    <Button variant="link" className="p-0 h-auto mt-4 text-teal-600 font-bold hover:no-underline flex items-center gap-1">
                                        Get Directions <ArrowLeft className="h-4 w-4 rotate-180" />
                                    </Button>
                                </div>
                                <p className="text-sm text-slate-500 italic">
                                    * We have 20+ offices across India and the world.
                                </p>
                            </div>
                        </div>

                        {/* Quick Contact Card */}
                        <div className="bg-teal-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
                            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                <Clock className="h-40 w-40" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-4">Response Time</h3>
                                <p className="text-teal-50/80 mb-6">
                                    Our dedicated sales and support teams typically respond to all enquiries within 24 business hours.
                                </p>
                                <div className="flex items-center gap-3 text-teal-400 font-bold">
                                    <div className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
                                    <span>Support Available 24/7</span>
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

export default Contact
