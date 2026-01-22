import React from 'react';
import { Phone, Users, Clock, Star } from 'lucide-react';

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
