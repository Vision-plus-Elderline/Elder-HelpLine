import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { 
    ArrowLeft, 
    MapPin, 
    Users, 
    Globe2, 
    Building2, 
    Briefcase, 
    Maximize2,
    CheckCircle2,
    Navigation,
    Languages
} from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import EnhancedFooter from '@/components/EnhaceFooter'

function Presence() {
    const navigate = useNavigate()
    const { user } = useAuth()

    const stats = [
        {
            icon: <Building2 className="h-8 w-8 text-teal-600" />,
            label: "Delivery Facilities",
            value: "20",
            desc: "State-of-the-art centers across India"
        },
        {
            icon: <MapPin className="h-8 w-8 text-teal-600" />,
            label: "Field Coverage",
            value: "400+",
            desc: "Cities covered by our field teams"
        },
        {
            icon: <Languages className="h-8 w-8 text-teal-600" />,
            label: "Languages",
            value: "16",
            desc: "Servicing diverse linguistic needs"
        },
        {
            icon: <Users className="h-8 w-8 text-teal-600" />,
            label: "Employees",
            value: "5,000+",
            desc: "Dedicated professionals nationwide"
        },
        {
            icon: <Briefcase className="h-8 w-8 text-teal-600" />,
            label: "Clients",
            value: "30+",
            desc: "Trusted by industry leaders"
        },
        {
            icon: <Maximize2 className="h-8 w-8 text-teal-600" />,
            label: "Office Space",
            value: "75,000+",
            desc: "Sq. ft. across Tier 1, 2 & 3 cities"
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
                <div className="text-center mb-16 md:mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold mb-6">
                        <Navigation className="h-4 w-4" />
                        <span>Pan-India Reach</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Our <span className="text-teal-600">Presence</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Strategically located to serve you better. We combine extensive geographic reach with deep local expertise across the Indian subcontinent.
                    </p>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-teal-50 rounded-xl">
                                    {stat.icon}
                                </div>
                                <div>
                                    <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                                    <p className="text-sm font-semibold text-teal-600 uppercase tracking-wider">{stat.label}</p>
                                </div>
                            </div>
                            <p className="text-slate-600">{stat.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Map and Description Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
                    <div className="order-2 lg:order-1">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Expansive Delivery Network</h2>
                        <div className="space-y-6">
                            <p className="text-lg text-slate-600 leading-relaxed">
                                We have a robust presence across India, with <strong>20 delivery facilities</strong> and comprehensive field coverage spanning over <strong>400 cities</strong>. Our network is designed to provide seamless service delivery regardless of location.
                            </p>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                With more than <strong>75,000 sq. ft.</strong> of premium office space, we operate across various Indian <strong>Tier-1, Tier-2, and Tier-3 cities</strong>, ensuring we tap into the best talent pools and maintain proximity to our clients.
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    "Tier-1 City Excellence",
                                    "Tier-2 Talent Hubs",
                                    "Tier-3 Deep Reach",
                                    "Multilingual Support (16+)",
                                    "24/7 Operations",
                                    "Scalable Infrastructure"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-700">
                                        <CheckCircle2 className="h-5 w-5 text-teal-500" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2 bg-white p-4 rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden group">
                        <img 
                            src="/images/map.jpeg" 
                            alt="Vision Plus India Presence Map" 
                            className="w-full h-auto object-cover rounded-[2rem] group-hover:scale-[1.02] transition-transform duration-700"
                        />
                    </div>
                </div>

                {/* Portfolio Images Section */}
                {/* <div className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Strategic Offerings</h2>
                        <p className="text-slate-600">Detailed insights into our infrastructure and service portfolio</p>
                    </div>
                    <div className="space-y-16">
                        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                            <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">Integrated Business Services Portfolio</h3>
                            <img 
                                src="/images/8.png" 
                                alt="IBS Portfolio" 
                                className="w-full h-auto object-contain rounded-xl"
                            />
                        </div>
                        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                            <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">Detailed Portfolio Analysis</h3>
                            <img 
                                src="/images/9.png" 
                                alt="Detailed Portfolio" 
                                className="w-full h-auto object-contain rounded-xl"
                            />
                        </div>
                        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                            <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">Sector Specific Technology Offerings</h3>
                            <img 
                                src="/images/10.png" 
                                alt="Technology Offerings" 
                                className="w-full h-auto object-contain rounded-xl"
                            />
                        </div>
                    </div>
                </div> */}
            </main>

            <EnhancedFooter />
        </div>
    )
}

export default Presence
