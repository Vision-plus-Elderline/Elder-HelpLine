import { 
    ArrowLeft, 
    Mail, 
    MessageSquare,
    Clock,
    ShieldAlert,
    AlertCircle,
    Send,
    Scale,
    FileText
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from './Header'
import { Button } from './ui/button'

function GrievanceForm() {    
    const navigate = useNavigate()
    const { user } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [category, setCategory] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            toast.success("Grievance registered successfully. Your ticket number is VP-2026-0892. We will investigate this promptly.")
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
                        Grievance <span className="text-teal-600">Redressal</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        We take your concerns seriously. If you've faced any issues with our services, policies, or conduct, please let us know so we can make it right.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Grievance Form Section */}
                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-red-50 rounded-xl">
                                <ShieldAlert className="h-6 w-6 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Register a Grievance</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Category & Severity */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">Grievance Category</label>
                                    <Select onValueChange={setCategory} required>
                                        <SelectTrigger className="rounded-xl border-slate-200 h-12">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="service">Service Quality</SelectItem>
                                            <SelectItem value="technical">Technical Issue</SelectItem>
                                            <SelectItem value="billing">Billing/Payment</SelectItem>
                                            <SelectItem value="conduct">Employee Conduct</SelectItem>
                                            <SelectItem value="policy">Policy Violation</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">Severity Level</label>
                                    <RadioGroup defaultValue="low" className="flex items-center gap-4 h-12">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="low" id="low" />
                                            <Label htmlFor="low">Low</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="high" id="high" />
                                            <Label htmlFor="high" className="text-red-600 font-medium">High</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>

                            {/* Tracking ID */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Employee / Customer ID (Optional)</label>
                                <Input placeholder="VP-XXXX" className="rounded-xl border-slate-200 focus:border-teal-500 focus:ring-teal-500" />
                            </div>

                            {/* Describe Grievance */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">Detailed Description</label>
                                <Textarea 
                                    placeholder="Please provide as much detail as possible, including dates, locations, and names if relevant..." 
                                    required 
                                    className="min-h-[180px] rounded-2xl border-slate-200 focus:border-teal-500 focus:ring-teal-500 bg-slate-50/50"
                                />
                            </div>

                            {/* Personal Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                                    <Input placeholder="John Doe" required className="rounded-xl border-slate-200 focus:border-teal-500 focus:ring-teal-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">E-mail Address</label>
                                    <Input type="email" placeholder="example@example.com" required className="rounded-xl border-slate-200 focus:border-teal-500 focus:ring-teal-500" />
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg shadow-red-100"
                            >
                                {isSubmitting ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send className="h-5 w-5" />
                                        File Grievance
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Info Section */}
                    <div className="space-y-8">
                        {/* Resolution Process */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-teal-50 rounded-xl">
                                    <Scale className="h-6 w-6 text-teal-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Our Process</h2>
                            </div>
                            <div className="space-y-6">
                                <div className="relative pl-8 border-l-2 border-slate-100 space-y-8">
                                    <div className="relative">
                                        <div className="absolute -left-[41px] top-0 h-4 w-4 rounded-full bg-teal-600 border-4 border-white shadow-sm" />
                                        <h4 className="font-bold text-slate-900 mb-1">Acknowledgement</h4>
                                        <p className="text-sm text-slate-600">Within 24 hours, you'll receive a ticket number and assigned officer.</p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[41px] top-0 h-4 w-4 rounded-full bg-slate-200 border-4 border-white shadow-sm" />
                                        <h4 className="font-bold text-slate-900 mb-1">Investigation</h4>
                                        <p className="text-sm text-slate-600">Our compliance team will investigate the matter thoroughly within 3-5 business days.</p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[41px] top-0 h-4 w-4 rounded-full bg-slate-200 border-4 border-white shadow-sm" />
                                        <h4 className="font-bold text-slate-900 mb-1">Resolution</h4>
                                        <p className="text-sm text-slate-600">Final resolution and formal response will be provided within 7 business days.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Grievance Officer Card */}
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
                            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                <FileText className="h-40 w-40" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-4">Escalation Desk</h3>
                                <p className="text-slate-400 mb-6 leading-relaxed">
                                    If your grievance is not resolved within the promised timeline, you may escalate directly to our Nodal Officer.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/10 rounded-lg">
                                            <Mail className="h-5 w-5 text-teal-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Nodal Officer Email</p>
                                            <a href="mailto:nodal.officer@visionplusindia.in" className="font-bold hover:text-teal-400 transition-colors">
                                                nodal.officer@visionplusindia.in
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/10 rounded-lg">
                                            <AlertCircle className="h-5 w-5 text-teal-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Compliance Helpline</p>
                                            <p className="font-bold">1800-XXX-XXXX (Toll Free)</p>
                                        </div>
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

export default GrievanceForm
