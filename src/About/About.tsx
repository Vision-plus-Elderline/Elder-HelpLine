import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { 
    ArrowLeft, 
    ShieldCheck, 
    Cpu, 
    Users, 
    Phone, 
    Globe, 
    Briefcase, 
    Heart, 
    Zap,
    History,
    Target
} from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import EnhancedFooter from '@/components/EnhaceFooter'

function About() {
    const navigate = useNavigate()
    const { user } = useAuth()

    const services = [
        {
            icon: <Users className="h-8 w-8 text-teal-600" />,
            title: "Manpower Management",
            desc: "Expertly managed workforce solutions tailored to your business needs."
        },
        {
            icon: <Briefcase className="h-8 w-8 text-teal-600" />,
            title: "Back Office Services",
            desc: "Streamlined administrative and operational support to increase efficiency."
        },
        {
            icon: <ShieldCheck className="h-8 w-8 text-teal-600" />,
            title: "Infrastructure & Security",
            desc: "Robust security solutions and infrastructure management for peace of mind."
        },
        {
            icon: <Globe className="h-8 w-8 text-teal-600" />,
            title: "Digital Services",
            desc: "Cutting-edge digital transformation and technology integration."
        },
        {
            icon: <Phone className="h-8 w-8 text-teal-600" />,
            title: "BPO / Contact Centre",
            desc: "World-class customer experience management and support services."
        },
        {
            icon: <Cpu className="h-8 w-8 text-teal-600" />,
            title: "Technology Services",
            desc: "Automating processes and connecting you with the latest technologies."
        }
    ]

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
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold mb-6">
                        <Zap className="h-4 w-4" />
                        <span>Innovating for over 23 years</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        About <span className="text-teal-600">Vision Plus</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Connecting customers to technology solutions and delivering extraordinary customer experiences through our Digital Integrated Business Services.
                    </p>
                </div>

                {/* Experience Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-6 hover:shadow-md transition-shadow">
                        <div className="p-4 bg-blue-50 rounded-xl">
                            <History className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">23+ Years of Innovation</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Since our inception, we've focused on connecting customers to technology solutions, automating processes, and bridging the gap between businesses and their consumers.
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-6 hover:shadow-md transition-shadow">
                        <div className="p-4 bg-teal-50 rounded-xl">
                            <Target className="h-8 w-8 text-teal-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">15+ Years of CX Focus</h3>
                            <p className="text-slate-600 leading-relaxed">
                                For over a decade and a half, we've specialized in customer experience management, automating business processes to increase efficiency and drive satisfaction.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mantra Section */}
                <div className="bg-teal-900 rounded-[2.5rem] overflow-hidden mb-24 text-white relative">
                    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                        <Heart className="h-64 w-64" />
                    </div>
                    <div className="px-8 py-16 md:p-20 relative z-10">
                        <div className="max-w-3xl">
                            <h2 className="text-3xl md:text-4xl font-bold mb-8">The "Digital Integrated Business Services" Mantra</h2>
                            <p className="text-lg md:text-xl text-teal-50/90 leading-relaxed mb-8">
                                We combine the human element with technology to deliver extraordinary customer experiences. While technology creates new and agile ways of working, our interaction experts remain committed to creating unique connections through empathy and adaptive communication.
                            </p>
                            <div className="flex flex-wrap gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-teal-400" />
                                    <span className="font-medium">Human-Centric Approach</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-teal-400" />
                                    <span className="font-medium">Technology-Driven Efficiency</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-teal-400" />
                                    <span className="font-medium">Passion for Excellence</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services Grid */}
                <div className="mb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Services</h2>
                        <p className="text-slate-600">Comprehensive solutions for modern business challenges</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-teal-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <div className="mb-6">{service.icon}</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Images Section (Keeping original images but styling them) */}
                <div className="grid  grid-cols-1 md:grid-cols-1 gap-8 mb-24">
                    <div className="rounded-2xl overflow-hidden  ">
                                                                        <h2 className="text-3xl md:text-4xl font-bold text-slate-700 mb-7 justify-center flex">Integrated Bussiness Services Portfolio</h2>
                        <img 
                            src="/images/8.png" 
                            alt="Vision Plus Workspace" 
                            className="w-full h-full object-contain "
                        />
                    </div>
                    <div className="rounded-2xl overflow-hidden ">
                                                <h2 className="text-3xl md:text-4xl font-bold text-slate-700 mb-7 justify-center flex">Detailed Portfolio</h2>

                        <img 
                            src="/images/9.png" 
                            alt="Vision Plus Technology" 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    <div className="rounded-2xl overflow-hidden ">
                        
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-700 mb-7 justify-center flex">Our Sector Specific Technology Offerings</h2>
                        <img 
                            src="/images/10.png" 
                            alt="Vision Plus Technology" 
                            className="w-full h-full object-contain group-hover:scale-105 mb-5 transition-transform duration-500"
                        />
                    </div>
                </div>
            </main>

            {/* Simple Footer */}
            {/* <footer className="bg-white border-t border-slate-200 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-slate-500 font-medium">© 2026 Vision Plus. All rights reserved.</p>
                </div>
            </footer> */}
            <EnhancedFooter/>
        </div>
    )
}

export default About