import React from 'react'
import { Award, Download, CheckCircle, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Certification = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-teal-200/50">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Award className="h-48 w-48" />
        </div>
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2">Professional Certification</h3>
          <p className="text-teal-100 mb-6 max-w-md">Congratulations! You have successfully completed the training requirements and are now certified.</p>
          <Button className="bg-white text-teal-700 hover:bg-teal-50 rounded-xl px-6 py-2 flex items-center gap-2 transition-all shadow-md">
            <Download className="h-4 w-4" />
            Download Certificate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-1">Status</h4>
            <p className="text-sm text-slate-500">Active & Verified</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-1">Issued Date</h4>
            <p className="text-sm text-slate-500">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Certification
