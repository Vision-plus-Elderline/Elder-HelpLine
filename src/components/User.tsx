import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTestAttempts } from '@/hooks/useTestAttempts';
import { AlertCircle, CheckCircle, TrendingUp, Target, Award, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import Header from './Header';
import EnhancedFooter from './EnhaceFooter';

const kpiData = {
  tl: {
    title: "T.L (Team Leader)",
    color: "border-orange-200",
    headerColor: "bg-orange-50",
    finalScore: "3.10",
    rows: [
      { kpi: "SL (Service Level)", weight: "15%", target: "95%", achieved: "95%", score: 3, weighted: "0.45" },
      { kpi: "Aband%", weight: "10%", target: "3%", achieved: "3%", score: 3, weighted: "0.30" },
      { kpi: "AHT (Average Handeling Time)", weight: "10%", target: "300", achieved: "300", score: 3, weighted: "0.30" },
      { kpi: "CQ (Call Quality) Score", weight: "15%", target: "90%", achieved: "90%", score: 3, weighted: "0.45" },
      { kpi: "CSAT / NPS", weight: "10%", target: "50%", achieved: "50%", score: 3, weighted: "0.30" },
      { kpi: "FCR (First Call Resolution)", weight: "10%", target: "60%", achieved: "60%", score: 3, weighted: "0.30" },
      { kpi: "Shrinkage%", weight: "10%", target: "9%", achieved: "9%", score: 3, weighted: "0.30" },
      { kpi: "Attrition%", weight: "10%", target: "4%", achieved: "4%", score: 3, weighted: "0.30" },
      { kpi: "Login Adherence", weight: "5%", target: "95%", achieved: "95%", score: 3, weighted: "0.15" },
      { kpi: "Attendance", weight: "5%", target: "100%", achieved: "100%", score: 5, weighted: "0.25" },
    ]
  },
  agent: {
    title: "Agent",
    color: "border-emerald-200",
    headerColor: "bg-emerald-50",
    finalScore: "3.50",
    rows: [
      { kpi: "ACD Calls", weight: "10%", target: "1900", achieved: "1900", score: 3, weighted: "0.30" },
      { kpi: "AHT (Average Handeling Time)", weight: "10%", target: "300", achieved: "300", score: 3, weighted: "0.30" },
      { kpi: "FCR (First Call Resolution)", weight: "10%", target: "60%", achieved: "60%", score: 3, weighted: "0.30" },
      { kpi: "CQ (Call Quality) Score", weight: "20%", target: "90%", achieved: "90%", score: 3, weighted: "0.60" },
      { kpi: "Login Hours", weight: "10%", target: "208", achieved: "208", score: 3, weighted: "0.30" },
      { kpi: "CSAT / NPS", weight: "10%", target: "50%", achieved: "50%", score: 3, weighted: "0.30" },
      { kpi: "Login Adherence", weight: "5%", target: "95%", achieved: "95%", score: 3, weighted: "0.15" },
      { kpi: "Calls attended in first ring", weight: "10%", target: "100%", achieved: "100%", score: 5, weighted: "0.50" },
      { kpi: "Attendance", weight: "10%", target: "100%", achieved: "100%", score: 5, weighted: "0.50" },
      { kpi: "Discipline", weight: "5%", target: "100%", achieved: "96%", score: 3, weighted: "0.15" },
    ]
  },
  frl: {
    title: "FRL (Field Response Leader)",
    color: "border-blue-200",
    headerColor: "bg-blue-50",
    finalScore: "3.50",
    rows: [
      { kpi: "Response TAT", weight: "15%", target: "95%", achieved: "95%", score: 3, weighted: "0.45" },
      { kpi: "Resolution TAT", weight: "15%", target: "95%", achieved: "95%", score: 3, weighted: "0.45" },
      { kpi: "Follow Ups", weight: "10%", target: "95%", achieved: "95%", score: 3, weighted: "0.30" },
      { kpi: "Evidence Collection", weight: "15%", target: "100%", achieved: "100%", score: 5, weighted: "0.75" },
      { kpi: "CSAT / NPS", weight: "15%", target: "50%", achieved: "50%", score: 3, weighted: "0.45" },
      { kpi: "Shrinkage%", weight: "10%", target: "9%", achieved: "9%", score: 3, weighted: "0.30" },
      { kpi: "Attrition%", weight: "10%", target: "4%", achieved: "4%", score: 3, weighted: "0.30" },
      { kpi: "Self Attendance", weight: "10%", target: "100%", achieved: "100%", score: 5, weighted: "0.50" },
    ]
  },
  fro: {
    title: "FRO (Field Response Officer)",
    color: "border-indigo-200",
    headerColor: "bg-indigo-50",
    finalScore: "3.70",
    rows: [
      { kpi: "Response TAT", weight: "20%", target: "95%", achieved: "95%", score: 3, weighted: "0.60" },
      { kpi: "Resolution TAT", weight: "20%", target: "95%", achieved: "95%", score: 3, weighted: "0.60" },
      { kpi: "Follow Ups", weight: "10%", target: "95%", achieved: "95%", score: 3, weighted: "0.30" },
      { kpi: "Evidence Collection", weight: "15%", target: "100%", achieved: "100%", score: 5, weighted: "0.75" },
      { kpi: "CSAT / NPS", weight: "15%", target: "50%", achieved: "50%", score: 3, weighted: "0.45" },
      { kpi: "Attendance", weight: "20%", target: "100%", achieved: "100%", score: 5, weighted: "1.00" },
    ]
  }
};

const scoreLegend = [
  { score: 5, label: "Outstanding", color: "text-emerald-600 bg-emerald-50" },
  { score: 4, label: "Exceeds", color: "text-blue-600 bg-blue-50" },
  { score: 3, label: "Meet", color: "text-orange-600 bg-orange-50" },
  { score: 2, label: "Needs Improvement", color: "text-amber-600 bg-amber-50" },
  { score: 1, label: "Unsatisfactory", color: "text-red-600 bg-red-50" },
];

function KPITable({ data }: { data: typeof kpiData.tl }) {
  return (
    <div className={`overflow-hidden rounded-xl border ${data.color} bg-white shadow-sm`}>
      <div className={`px-4 py-3 border-b ${data.color} ${data.headerColor} flex justify-between items-center`}>
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Target className="h-4 w-4 text-slate-500" />
          {data.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Final Score</span>
          <span className="px-2.5 py-1 bg-white border rounded-lg text-sm font-bold text-slate-900 shadow-sm">
            {data.finalScore}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <th className="px-4 py-2 font-semibold">KPIs</th>
              <th className="px-3 py-2 font-semibold text-center">Weight</th>
              <th className="px-3 py-2 font-semibold text-center">Target</th>
              <th className="px-3 py-2 font-semibold text-center">Achieved</th>
              <th className="px-3 py-2 font-semibold text-center">Score</th>
              <th className="px-4 py-2 font-semibold text-right">Weighted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-2.5 font-medium text-slate-700">{row.kpi}</td>
                <td className="px-3 py-2.5 text-center text-slate-500">{row.weight}</td>
                <td className="px-3 py-2.5 text-center text-slate-500">{row.target}</td>
                <td className="px-3 py-2.5 text-center font-medium text-slate-700">{row.achieved}</td>
                <td className="px-3 py-2.5 text-center">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold ${
                    row.score >= 4 ? 'bg-emerald-100 text-emerald-700' : 
                    row.score === 3 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {row.score}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right font-bold text-slate-900">{row.weighted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function UserPage() {
  
  const { user: authUser, loading: authLoading } = useAuth();
  const { hasAttempted, loading: attemptsLoading } = useTestAttempts();

  if (authLoading || attemptsLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
        Please log in to view this page.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* <Header user={authUser} /> */}
      {/* Header/Hero Section */}
      <div className="bg-[#0f172a] pt-12 pb-24 px-4 rounded-xl">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Award className="h-3 w-3" />
            Performance Dashboard
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Performance <span className="text-teal-400">KPI & KRA</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Review your key performance indicators and key result areas across different organizational roles.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16 space-y-8">
        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg ${
              hasAttempted ? 'bg-emerald-100 text-emerald-600 shadow-emerald-100' : 'bg-amber-100 text-amber-600 shadow-amber-100'
            }`}>
              {hasAttempted ? <CheckCircle className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {hasAttempted ? 'Assessment Completed' : 'Assessment Pending'}
              </h2>
              <p className="text-slate-500">
                {hasAttempted 
                  ? 'Your latest results are being processed by the administration.' 
                  : 'Please complete your scheduled assessment to update your profile.'}
              </p>
            </div>
          </div>
          {/* <Button 
            className="bg-[#0f172a] hover:bg-slate-800 text-white px-8 h-12 rounded-xl"
            onClick={() => window.location.href = '/'}
          >
            Back to Home
          </Button> */}
        </div>

        {/* Score Legend & Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-full space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wider">
                <BarChart3 className="h-4 w-4 text-teal-600" />
                Scoring Legend
              </h3>
              <div className="space-y-3">
                {scoreLegend.map((item) => (
                  <div key={item.score} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${item.color}`}>
                      Score: {item.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg shadow-teal-200">
              <TrendingUp className="h-8 w-8 mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">Performance Tracking</h3>
              <p className="text-teal-50 text-sm leading-relaxed opacity-90">
                Your weighted scores are calculated based on targets achieved and KPI weightage. Aim for a consistent score of 3+ to meet organizational standards.
              </p>
            </div>
              {/* KPI Tables Grid */}
          {/* <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-6">
              <KPITable data={kpiData.tl} />
              <KPITable data={kpiData.agent} />
              <KPITable data={kpiData.frl} />
              <KPITable data={kpiData.fro} />
            </div>
          </div> */}
          </div>

        
        </div>
         {/* KPI Tables Grid */}
        <div className="lg:col-span-4 ">
            <div className="grid grid-cols-2 gap-6">
              <KPITable data={kpiData.tl} />
              <KPITable data={kpiData.agent} />
              <KPITable data={kpiData.frl} />
              <KPITable data={kpiData.fro} />
            </div>
          </div>
             

      </div>
         {/* <EnhancedFooter/> */}
    </div>
  );
}
