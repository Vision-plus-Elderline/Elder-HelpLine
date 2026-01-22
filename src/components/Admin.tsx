import { useState, useEffect, useMemo, useCallback, lazy, Suspense, memo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, CheckCircle, XCircle, BarChart3, Download, PieChart as PieChartIcon, GraduationCap, ChevronDown, ChevronUp, Lightbulb, LineChart as LineChartIcon, Activity, Eye, Search, ClipboardCheck, ChevronLeft, ChevronRight, RotateCcw, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { questions, modules } from '@/data/questions';
import ErrorBoundary from './ErrorBoundary';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  ScatterChart,
  Scatter
} from 'recharts';
import Header from './Header';

/**
 * @interface UserProfile
 * Represents the user's basic profile information stored in Supabase.
 */
interface UserProfile {
  email: string;
  full_name: string;
  emp_id?: string | null;
}

/**
 * @interface UserDetails
 * Represents extended user information including contact and professional details.
 */
interface UserDetails {
  first_name: string;
  last_name: string;
  phone_number: string;
  gender: string;
  state: string;
  city: string;
  process_allocated?: string | null;
  designation?: string | null;
  father_name?: string | null;
  address?: string | null;
  qualification?: string | null;
  date_of_birth?: string | null;
}

/**
 * @interface TestAttemptWithProfile
 * Combined object containing test results, profile, and user details.
 */
interface TestAttemptWithProfile {
  id: string;
  user_id: string;
  score: number;
  total_questions: number;
  percentage: number;
  qualified: boolean;
  completed_at: string;
  answers: Record<number, string> | null;
  profiles: UserProfile;
  userDetails?: UserDetails | null;
}

/**
 * @interface AdminStats
 * Aggregate statistics for the admin dashboard.
 */
interface AdminStats {
  total: number;
  qualified: number;
  notQualified: number;
  averageScore: number;
}

/**
 * @interface QuestionAnalysis
 * Detailed performance metrics for an individual question.
 */
interface QuestionAnalysis {
  id: number;
  question: string;
  correct: number;
  wrong: number;
  total: number;
  options: Record<string, number>;
  compliance: number;
  wrong_percentage: number;
  difficulty?: number;
}

/**
 * @interface TopicAnalysis
 * Aggregated performance metrics for a specific training module/topic.
 */
interface TopicAnalysis {
  id: string;
  name: string;
  compliance: number;
  total: number;
}

/**
 * @interface CategoryAnalysis
 * Aggregated performance metrics for a specific category.
 */
interface CategoryAnalysis {
  name: string;
  value: number;
  count: number;
}

/**
 * @interface Suggestion
 * Training recommendation based on performance analysis.
 */
interface Suggestion {
  text: string;
  topic: string;
  status: 'good' | 'warning' | 'urgent';
}

/**
 * StatCard component displays a single metric with an icon and label.
 * Memoized to prevent unnecessary re-renders when other parts of the dashboard change.
 */
const StatCard = memo(({ label, value, icon: Icon, colorClass, bgImage }: {
  label: string;
  value: string | number;
  icon: any;
  colorClass: string;
  bgImage?: string;
}) => (
  <Card
    className={`border backdrop-blur-md hover:scale-[1.02] transition relative overflow-hidden ${colorClass}`}
    style={bgImage ? {
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    } : {}}
    role="region"
    aria-label={`${label} statistic`}
  >
    <div className="absolute inset-0 bg-black/10 pointer-events-none" />
    <div className="relative z-10">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm text-white font-medium">
          {label}
        </CardTitle>
        <Icon className="h-5 w-5 text-white" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-white">
          {value}
        </p>
      </CardContent>
    </div>
  </Card>
));

StatCard.displayName = 'StatCard';

/**
 * ChartsSection component wraps all the analysis charts.
 * This is intended to be used within a Suspense boundary if lazy loaded.
 */
const ChartsSection = memo(({
  chartType,
  setChartType,
  questionAnalysisData,
  topicAnalysisData,
  categoryAnalysisData,
  qualifiedDistribution,
  suggestions,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage
}: {
  chartType: 'bar' | 'pie' | 'line';
  setChartType: (type: 'bar' | 'pie' | 'line') => void;
  questionAnalysisData: QuestionAnalysis[];
  topicAnalysisData: TopicAnalysis[];
  categoryAnalysisData: CategoryAnalysis[];
  qualifiedDistribution: any[];
  suggestions: Suggestion[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (count: number) => void;
}) => {
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return questionAnalysisData.slice(startIndex, startIndex + itemsPerPage);
  }, [questionAnalysisData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(questionAnalysisData.length / itemsPerPage);

  return (
  <div className="space-y-8 animate-in fade-in duration-500" role="region" aria-label="Performance Analysis Charts">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h2 className="text-2xl font-bold text-gray-900">Question Performance Analysis</h2>
      <div className="flex items-center gap-4">
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200" role="tablist" aria-label="Chart type selection">
          <Button
            variant={chartType === 'bar' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setChartType('bar')}
            className="h-8 px-3 text-xs"
            role="tab"
            aria-selected={chartType === 'bar'}
          >
            <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
            Bar
          </Button>
          <Button
            variant={chartType === 'line' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setChartType('line')}
            className="h-8 px-3 text-xs"
            role="tab"
            aria-selected={chartType === 'line'}
          >
            <LineChartIcon className="w-3.5 h-3.5 mr-1.5" />
            Line
          </Button>
          <Button
            variant={chartType === 'pie' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setChartType('pie')}
            className="h-8 px-3 text-xs"
            role="tab"
            aria-selected={chartType === 'pie'}
          >
            <Activity className="w-3.5 h-3.5 mr-1.5" />
            Area
          </Button>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-teal-500 rounded-sm"></div> Correct %</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-400 rounded-sm"></div> Wrong %</span>
        </div>
      </div>
    </div>

    {/* Strategic Training Suggestions */}
    <Card className="border-none shadow-xl bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden border-l-4 border-l-amber-500">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
          <Lightbulb className="w-5 h-5" aria-hidden="true" />
          Strategic Training Focus Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white/60 p-3 rounded-lg border border-amber-100 shadow-sm">
                <div className={`mt-1 rounded-full p-1 ${suggestion.status === 'urgent' ? 'bg-red-500' : 'bg-amber-500'}`}>
                  {suggestion.status === 'urgent' ? <XCircle className="w-3 h-3 text-white" /> : <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-0.5">{suggestion.topic}</span>
                  <p className="text-sm text-amber-900 font-medium leading-relaxed">{suggestion.text}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-amber-600/60">
              <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-20" />
              <p className="text-sm font-medium">No strategic suggestions available yet.</p>
              <p className="text-xs">Suggestions will appear once assessment data is collected.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>

    <Card className="border-none shadow-xl bg-white overflow-hidden">
      <CardHeader className="bg-gray-50/50 border-b border-gray-100">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-teal-600" aria-hidden="true" />
          Compliance Charts and Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[400px] w-full">
          {questionAnalysisData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={questionAnalysisData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }} stackOffset="sign">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="id"
                    label={{ value: 'Question ID', position: 'insideBottom', offset: -40 }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    label={{ value: 'Percentage %', angle: -90, position: 'insideLeft' }}
                    domain={[-100, 100]}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-4 shadow-2xl rounded-xl border border-gray-100 max-w-sm">
                            <p className="font-bold text-gray-900 mb-2 underline decoration-teal-500 decoration-2">Question {data.id}</p>
                            <p className="text-sm text-gray-600 mb-3 leading-relaxed italic">"{data.question}"</p>
                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50">
                              <div className="text-center p-2 bg-teal-50 rounded-lg">
                                <p className="text-[10px] text-teal-600 uppercase font-bold">Correct</p>
                                <p className="text-lg font-bold text-teal-700">{data.correct}</p>
                              </div>
                              <div className="text-center p-2 bg-red-50 rounded-lg">
                                <p className="text-[10px] text-red-600 uppercase font-bold">Wrong</p>
                                <p className="text-lg font-bold text-red-700">{data.wrong}</p>
                              </div>
                            </div>
                            <div className="mt-3 flex gap-2">
                              <div className="flex-1 text-center p-2 bg-gray-50 rounded-lg">
                                <p className="text-[10px] text-gray-500 uppercase font-bold">Compliance</p>
                                <p className="text-md font-black text-teal-600">{data.compliance}%</p>
                              </div>
                              <div className="flex-1 text-center p-2 bg-gray-50 rounded-lg">
                                <p className="text-[10px] text-gray-500 uppercase font-bold">Error Rate</p>
                                <p className="text-md font-black text-red-600">{Math.abs(data.wrong_percentage)}%</p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="compliance" stackId="a" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="wrong_percentage" stackId="a" fill="#f87171" radius={[0, 0, 4, 4]} />
                </BarChart>
              ) : chartType === 'line' ? (
                <LineChart data={questionAnalysisData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="id" />
                  <YAxis domain={[-100, 100]} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Line type="monotone" dataKey="compliance" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4 }} name="Compliance %" />
                  <Line type="monotone" dataKey="wrong_percentage" stroke="#f87171" strokeWidth={3} dot={{ r: 4 }} name="Error %" />
                </LineChart>
              ) : (
                <AreaChart data={questionAnalysisData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="id" />
                  <YAxis domain={[-100, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="compliance" stackId="1" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.6} name="Compliance %" />
                  <Area type="monotone" dataKey="wrong_percentage" stackId="1" stroke="#f87171" fill="#f87171" fillOpacity={0.6} name="Error %" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <BarChart3 className="w-12 h-12 mb-4 opacity-10" />
              <p className="text-sm font-medium">No performance data available yet.</p>
              <p className="text-xs">Charts will populate once users complete assessments.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="border-none shadow-xl bg-white overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" aria-hidden="true" />
            Module Performance Radar
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={topicAnalysisData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Compliance %"
                  dataKey="compliance"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-xl bg-white overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
          <CardTitle className="text-lg flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-pink-600" aria-hidden="true" />
            Category Success Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryAnalysisData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryAnalysisData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}% Compliance`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-xl bg-white overflow-hidden lg:col-span-2">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" aria-hidden="true" />
            Overall Qualification Ratio
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={qualifiedDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={10}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {qualifiedDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Detailed Question Table */}
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100" role="region" aria-label="Detailed Question Analysis Table">
      <Table>
        <TableHeader className="bg-gray-800">
          <TableRow className="hover:bg-gray-800">
            <TableHead className="text-gray-100 border border-gray-700 w-20">ID</TableHead>
            <TableHead className="text-gray-100 border border-gray-700">Question Details</TableHead>
            <TableHead className="text-gray-100 border border-gray-700 text-center w-32">Response</TableHead>
            <TableHead className="text-gray-100 border border-gray-700 text-center w-32">Options Distribution</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((q) => (
            <TableRow key={q.id} className="hover:bg-gray-50 transition-colors">
              <TableCell className="font-mono text-gray-400 font-bold border-b border-gray-100">#{q.id}</TableCell>
              <TableCell className="border-b border-gray-100">
                <div className="space-y-1">
                  <p className="font-medium text-gray-900 leading-relaxed">{q.question}</p>
                  <div className="flex gap-4 ">
                    <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Correct: {questions.find(ques => ques.id === q.id)?.correct_option}</span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Total Attempts: {q.total}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="border-b border-gray-100">
                <div className="flex flex-col items-center gap-1">
                  <div className="text-lg font-bold text-gray-900">{q.compliance}%</div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={q.compliance} aria-valuemin={0} aria-valuemax={100}>
                    <div
                      className={`h-full rounded-full ${q.compliance >= 60 ? 'bg-teal-500' : 'bg-orange-500'}`}
                      style={{ width: `${q.compliance}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">
                    {q.correct} Correct / {q.wrong} Wrong
                  </div>
                </div>
              </TableCell>
              <TableCell className="border-b border-gray-100">
                <div className="grid grid-cols-2 gap-1 min-w-[120px]">
                  {Object.entries(q.options).map(([opt, count]) => (
                    <div key={opt} className={`flex items-center gap-1.5 px-2 py-1 rounded border ${questions.find(ques => ques.id === q.id)?.correct_option === opt ? 'bg-teal-100 border-teal-200' : 'bg-gray-50 border-gray-100'}`}>
                      <div className={questions.find(ques => ques.id === q.id)?.correct_option === opt ? 'text-teal-700' : 'text-gray-400'}>
                        <span className={`text-[10px] font-black ${questions.find(ques => ques.id === q.id)?.correct_option === opt ? 'text-teal-700' : 'text-gray-400'}`}>{opt}:</span>
                        <span className="text-xs font-bold text-gray-700 ml-1">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    {/* Pagination Controls for Question Analysis */}
    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
      <div className="text-sm text-gray-500">
        Showing <span className="font-semibold text-gray-900">{Math.min(questionAnalysisData.length, (currentPage - 1) * itemsPerPage + 1)}</span> to <span className="font-semibold text-gray-900">{Math.min(questionAnalysisData.length, currentPage * itemsPerPage)}</span> of <span className="font-semibold text-gray-900">{questionAnalysisData.length}</span> questions
      </div>
      <div className="flex items-center gap-2">
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="text-sm border-gray-200 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white"
        >
          {[5, 10, 20, 50].map(size => (
            <option key={size} value={size}>{size} per page</option>
          ))}
        </select>
        <div className="flex items-center gap-1 ml-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1 px-2">
            <span className="text-sm font-medium text-gray-900">{currentPage}</span>
            <span className="text-sm text-gray-400">/</span>
            <span className="text-sm text-gray-500">{totalPages}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
);
});

ChartsSection.displayName = 'ChartsSection';

/**
 * CandidateResultsTable component displays a table of all test attempts.
 * Memoized to prevent re-renders when switching tabs or when chart data updates.
 */
const CandidateResultsTable = memo(({
  attempts,
  loadingData,
  openDialog,
  setOpenDialog,
  selectedAttempt,
  setSelectedAttempt,
  buildAnswerRows,
  downloadPdfForAttempt,
  filterStatus,
  setFilterStatus,
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  totalPages,
  itemsPerPage,
  setItemsPerPage,
  totalResults,
  onResetAttempt
}: {
  attempts: TestAttemptWithProfile[];
  loadingData: boolean;
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  selectedAttempt: TestAttemptWithProfile | null;
  setSelectedAttempt: (attempt: TestAttemptWithProfile | null) => void;
  buildAnswerRows: (attempt: TestAttemptWithProfile) => any[];
  downloadPdfForAttempt: (attempt: TestAttemptWithProfile) => void;
  filterStatus: 'all' | 'qualified' | 'not_qualified';
  setFilterStatus: (status: 'all' | 'qualified' | 'not_qualified') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  itemsPerPage: number;
  setItemsPerPage: (count: number) => void;
  totalResults: number;
  onResetAttempt: (attemptId: string) => void;
}) => {
  const topScrollRef = useRef<HTMLDivElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Sync horizontal scroll between top scrollbar and table container
  useEffect(() => {
    const topScroll = topScrollRef.current;
    const tableContainer = tableContainerRef.current;

    if (!topScroll || !tableContainer) return;

    // Create a function to update the top scroll content width to match the table
    const updateTopScrollWidth = () => {
      const table = tableContainer.querySelector('table');
      const topScrollContent = topScroll.querySelector('div');
      if (table && topScrollContent) {
        topScrollContent.style.width = `${table.offsetWidth}px`;
      }
    };

    // Initial update
    updateTopScrollWidth();

    // Update width when table size changes
    const resizeObserver = new ResizeObserver(() => {
      updateTopScrollWidth();
    });

    const table = tableContainer.querySelector('table');
    if (table) {
      resizeObserver.observe(table);
    }

    const handleTopScroll = () => {
      if (Math.abs(tableContainer.scrollLeft - topScroll.scrollLeft) > 1) {
        tableContainer.scrollLeft = topScroll.scrollLeft;
      }
    };

    const handleTableScroll = () => {
      if (Math.abs(topScroll.scrollLeft - tableContainer.scrollLeft) > 1) {
        topScroll.scrollLeft = tableContainer.scrollLeft;
      }
    };

    topScroll.addEventListener('scroll', handleTopScroll, { passive: true });
    tableContainer.addEventListener('scroll', handleTableScroll, { passive: true });

    return () => {
      topScroll.removeEventListener('scroll', handleTopScroll);
      tableContainer.removeEventListener('scroll', handleTableScroll);
      resizeObserver.disconnect();
    };
  }, [loadingData, attempts]);

  return (
    <Card className="bg-white border border-gray-200 shadow-xl w-full overflow-hidden" role="region" aria-label="Candidate Test Results">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Candidate Assessment Results
          </CardTitle>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-gray-200"
              />
            </div>
            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilterStatus('all')}
                className="h-8 px-3 text-xs"
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'qualified' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilterStatus('qualified')}
                className="h-8 px-3 text-xs"
              >
                Qualified
              </Button>
              <Button
                variant={filterStatus === 'not_qualified' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilterStatus('not_qualified')}
                className="h-8 px-3 text-xs"
              >
                Failed
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loadingData ? (
          <div className="py-20 text-center text-gray-600" aria-busy="true">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
            Loading test data...
          </div>
        ) : (
          <div className="relative">
            {/* Top Horizontal Scrollbar */}
            <div 
              ref={topScrollRef}
              className="overflow-x-auto h-2 w-full bg-gray-50 border-b border-gray-100 scrollbar-hide"
              style={{ scrollbarWidth: 'thin' }}
            >
              <div style={{ height: '1px' }} />
            </div>

            <div 
              ref={tableContainerRef}
              className="overflow-x-auto"
            >
              <Table className="min-w-[2000px]">
                <TableHeader>
                  <TableRow className="bg-gray-900 hover:bg-gray-900 border-b border-gray-800">
                    <TableHead className="text-gray-100 font-bold h-12">Name</TableHead>
                    <TableHead className="text-gray-100 font-bold h-12">Emp ID</TableHead>
                    <TableHead className="text-gray-100 font-bold h-12">Email</TableHead>
                    <TableHead className="text-gray-100 font-bold h-12">First Name</TableHead>
                    <TableHead className="text-gray-100 font-bold h-12">Last Name</TableHead>
                    <TableHead className="text-gray-100 font-bold h-12">Phone</TableHead>
                    <TableHead className="text-gray-100 font-bold h-12">Gender</TableHead>
                    <TableHead className="text-gray-100 font-bold h-12">State</TableHead>
                    <TableHead className="text-gray-100 font-bold h-12">City</TableHead>
                    <TableHead className="text-gray-100 font-bold h-12">Process</TableHead>
                    <TableHead className="text-gray-100 font-bold h-12">Designation</TableHead>
                    <TableHead className="text-gray-100 font-bold h-12 text-center">Score</TableHead>
                    <TableHead className="text-gray-100 font-bold h-12 text-center">Percentage</TableHead>
                    <TableHead className="text-gray-100 font-bold h-12 text-center">Status</TableHead>
                    <TableHead className="text-gray-100 font-bold h-12">Date</TableHead>
                    <TableHead className="text-gray-100 font-bold h-12 text-center sticky right-0 bg-gray-900 shadow-[-4px_0_10px_rgba(0,0,0,0.1)]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attempts.length > 0 ? (
                    attempts.map((attempt) => (
                      <TableRow
                        key={attempt.id}
                        className="border-b border-gray-100 hover:bg-indigo-50/30 transition-colors odd:bg-white even:bg-gray-50/50"
                      >
                        <TableCell className="font-semibold text-gray-900 whitespace-nowrap">
                          {attempt.profiles?.full_name || 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-700 font-mono text-xs whitespace-nowrap">
                          {attempt.profiles?.emp_id || 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-700 whitespace-nowrap">
                          {attempt.profiles?.email || 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-700 whitespace-nowrap">
                          {attempt.userDetails?.first_name || 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-700 whitespace-nowrap">
                          {attempt.userDetails?.last_name || 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-700 whitespace-nowrap">
                          {attempt.userDetails?.phone_number || 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-700 whitespace-nowrap">
                          {attempt.userDetails?.gender || 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-700 whitespace-nowrap">
                          {attempt.userDetails?.state || 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-700 whitespace-nowrap">
                          {attempt.userDetails?.city || 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-700 whitespace-nowrap">
                          {attempt.userDetails?.process_allocated || 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-700 whitespace-nowrap">
                          {attempt.userDetails?.designation || 'N/A'}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`px-2 py-1 rounded text-sm font-bold ${attempt.score >= 13 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {attempt.score}/{attempt.total_questions}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-bold text-indigo-700">{attempt.percentage}%</span>
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${attempt.qualified ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{ width: `${attempt.percentage}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${attempt.qualified
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : 'bg-red-100 text-red-700 border-red-200'
                              }`}
                            variant="outline"
                          >
                            {attempt.qualified ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            {attempt.qualified ? 'Qualified' : 'Not Qualified'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600 text-xs whitespace-nowrap">
                          {new Date(attempt.completed_at).toLocaleDateString()}
                          <span className="block text-[10px] text-gray-400">
                            {new Date(attempt.completed_at).toLocaleTimeString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-center sticky right-0 bg-white shadow-[-4px_0_10px_rgba(0,0,0,0.05)] group-hover:bg-indigo-50/30">
                          <div className="flex justify-center gap-2">
                            <Dialog open={openDialog && selectedAttempt?.id === attempt.id} onOpenChange={(o) => { setOpenDialog(o); if (!o) setSelectedAttempt(null); }}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => { setSelectedAttempt(attempt); setOpenDialog(true); }}
                                  className="h-8 w-8 p-0 rounded-full hover:bg-indigo-600 hover:text-white transition-all"
                                  aria-label={`View answer sheet for ${attempt.profiles?.full_name}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl p-0 border-none shadow-2xl">
                                <div className="bg-indigo-600 p-6 text-white">
                                  <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold">Candidate Assessment Report</DialogTitle>
                                    <p className="text-indigo-100 opacity-80">Detailed performance analysis for {selectedAttempt?.profiles?.full_name}</p>
                                  </DialogHeader>
                                </div>
                                {selectedAttempt && (
                                  <div className="p-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Candidate Details</p>
                                        <p className="font-bold text-gray-900">{selectedAttempt.profiles?.full_name || 'N/A'}</p>
                                        <p className="text-xs text-gray-500">{selectedAttempt.profiles?.email || 'N/A'}</p>
                                        <p className="text-xs text-gray-500">{selectedAttempt.profiles?.emp_id || 'N/A'}</p>
                                      </div>
                                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Process & Role</p>
                                        <p className="font-bold text-gray-900">{selectedAttempt.userDetails?.process_allocated || 'N/A'}</p>
                                        <p className="text-xs text-gray-500">{selectedAttempt.userDetails?.designation || 'N/A'}</p>
                                      </div>
                                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Score Breakdown</p>
                                        <div className="flex items-end gap-2">
                                          <p className="text-2xl font-black text-indigo-600 leading-none">{selectedAttempt.score}/{selectedAttempt.total_questions}</p>
                                          <p className="text-xs font-bold text-gray-400 mb-0.5">{selectedAttempt.percentage}%</p>
                                        </div>
                                      </div>
                                      <div className={`p-4 rounded-xl border flex flex-col justify-center ${selectedAttempt.qualified ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Result Status</p>
                                        <div className="flex items-center gap-2">
                                          {selectedAttempt.qualified ? (
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                          ) : (
                                            <XCircle className="h-5 w-5 text-red-600" />
                                          )}
                                          <p className={`text-lg font-black uppercase ${selectedAttempt.qualified ? 'text-green-600' : 'text-red-600'}`}>
                                            {selectedAttempt.qualified ? 'Qualified' : 'Failed'}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="space-y-4">
                                      <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <ClipboardCheck className="w-5 h-5 text-indigo-600" />
                                        Question Response Analysis
                                      </h4>
                                      <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                                        <table className="min-w-full text-sm">
                                          <thead>
                                            <tr className="bg-gray-50 border-b border-gray-200">
                                              <th className="p-4 text-left font-bold text-gray-600 w-16 text-[10px] uppercase tracking-wider">#</th>
                                              <th className="p-4 text-left font-bold text-gray-600 text-[10px] uppercase tracking-wider">Question</th>
                                              <th className="p-4 text-center font-bold text-gray-600 text-[10px] uppercase tracking-wider">Response</th>
                                              <th className="p-4 text-center font-bold text-gray-600 text-[10px] uppercase tracking-wider">Correct Answer</th>
                                              <th className="p-4 text-center font-bold text-gray-600 text-[10px] uppercase tracking-wider w-24">Result</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100">
                                            {buildAnswerRows(selectedAttempt).map((r, idx) => (
                                              <tr key={r.id} className="hover:bg-gray-50/80 transition-colors">
                                                <td className="p-4 text-gray-400 font-mono text-xs">#{idx + 1}</td>
                                                <td className="p-4">
                                                  <p className="text-gray-900 font-medium leading-relaxed">{r.text}</p>
                                                </td>
                                                <td className="p-4 text-center">
                                                  <div className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${
                                                    r.isCorrect 
                                                      ? 'bg-green-50 border-green-100 text-green-700' 
                                                      : 'bg-red-50 border-red-100 text-red-700'
                                                  }`}>
                                                    <span className="opacity-60 mr-1.5">{r.selected}:</span>
                                                    {r.options[r.selected] || 'No response'}
                                                  </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                  <div className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 border border-indigo-100 text-indigo-700">
                                                    <span className="opacity-60 mr-1.5">{r.correct}:</span>
                                                    {r.options[r.correct]}
                                                  </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                  {r.isCorrect ? (
                                                    <div className="flex items-center justify-center text-green-600 bg-green-100 h-8 w-8 rounded-full mx-auto">
                                                      <CheckCircle className="h-5 w-5" />
                                                    </div>
                                                  ) : (
                                                    <div className="flex items-center justify-center text-red-600 bg-red-100 h-8 w-8 rounded-full mx-auto">
                                                      <XCircle className="h-5 w-5" />
                                                    </div>
                                                  )}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                    <div className="flex justify-end pt-4 border-t border-gray-100">
                                      <Button 
                                        onClick={() => downloadPdfForAttempt(selectedAttempt)} 
                                        className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl shadow-lg transition-all"
                                      >
                                        <Download className="w-4 h-4" />
                                        Download PDF Report
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadPdfForAttempt(attempt)}
                              className="h-8 w-8 p-0 rounded-full hover:bg-teal-600 hover:text-white transition-all"
                              aria-label={`Download PDF for ${attempt.profiles?.full_name}`}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            {!attempt.qualified && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onResetAttempt(attempt.id)}
                                className="h-8 w-8 p-0 rounded-full hover:bg-orange-500 hover:text-white transition-all border-orange-200 text-orange-600"
                                title="Allow Re-exam (Reset Attempt)"
                                aria-label={`Allow re-exam for ${attempt.profiles?.full_name}`}
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={16} className="py-20 text-center text-gray-500 italic">
                        No candidate results found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {!loadingData && attempts.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 order-2 sm:order-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Rows per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="bg-white border border-gray-200 rounded-md text-sm px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {[5, 10, 20, 50, 100].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <span className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * itemsPerPage, totalResults)}</span> of <span className="font-medium text-gray-900">{totalResults}</span> results
              </span>
            </div>

            <div className="flex items-center gap-2 order-1 sm:order-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0 rounded-md disabled:opacity-50"
              >
                <span className="sr-only">First page</span>
                <ChevronLeft className="h-4 w-4" />
                <ChevronLeft className="h-4 w-4 -ml-2" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0 rounded-md disabled:opacity-50"
              >
                <span className="sr-only">Previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1 mx-2">
                <span className="text-sm font-medium text-gray-900">Page {currentPage}</span>
                <span className="text-sm text-gray-500">of {totalPages}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0 rounded-md disabled:opacity-50"
              >
                <span className="sr-only">Next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0 rounded-md disabled:opacity-50"
              >
                <span className="sr-only">Last page</span>
                <ChevronRight className="h-4 w-4" />
                <ChevronRight className="h-4 w-4 -ml-2" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

CandidateResultsTable.displayName = 'CandidateResultsTable';

function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, loading: authLoading } = useAuth();

  // console.log("Admin Component - User:", user);
  console.log("user admin", user?.user_metadata?.full_name)
  // console.log("Admin Component - isAdmin:", isAdmin);
  const [attempts, setAttempts] = useState<TestAttemptWithProfile[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    total: 0,
    qualified: 0,
    notQualified: 0,
    averageScore: 0,
  });
  const [selectedAttempt, setSelectedAttempt] = useState<TestAttemptWithProfile | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'table' | 'analysis'>('table');
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');
  const [filterStatus, setFilterStatus] = useState<'all' | 'qualified' | 'not_qualified'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Pagination for question analysis table
  const [qCurrentPage, setQCurrentPage] = useState(1);
  const [qItemsPerPage, setQItemsPerPage] = useState(10);

  // State for re-exam confirmation dialog
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [attemptToReset, setAttemptToReset] = useState<string | null>(null);

  /**
   * Filtered attempts based on status and search query.
   */
  const filteredAttempts = useMemo(() => {
    return attempts.filter(attempt => {
      const matchesStatus = 
        filterStatus === 'all' || 
        (filterStatus === 'qualified' && attempt.qualified) || 
        (filterStatus === 'not_qualified' && !attempt.qualified);
      
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery || 
        (attempt.profiles?.full_name?.toLowerCase().includes(searchLower)) ||
        (attempt.profiles?.email?.toLowerCase().includes(searchLower)) ||
        (attempt.profiles?.emp_id?.toLowerCase().includes(searchLower)) ||
        (attempt.userDetails?.phone_number?.includes(searchQuery));

      return matchesStatus && matchesSearch;
    });
  }, [attempts, filterStatus, searchQuery]);

  /**
   * Paginated attempts based on filtered results.
   */
  const paginatedAttempts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAttempts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAttempts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAttempts.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchQuery, itemsPerPage]);

  /**
   * Memoized computation for detailed question-by-question performance analysis.
   * Calculates correct/wrong counts and compliance percentages for each question.
   */
  const questionAnalysisData = useMemo((): QuestionAnalysis[] => {
    const analysis: Record<number, {
      question: string;
      correct: number;
      wrong: number;
      total: number;
      options: Record<string, number>;
    }> = {};

    attempts.forEach(attempt => {
      if (attempt.answers) {
        Object.entries(attempt.answers).forEach(([qId, selectedOption]) => {
          const questionId = parseInt(qId);
          const question = questions.find(q => q.id === questionId);
          if (!question) return;

          if (!analysis[questionId]) {
            analysis[questionId] = {
              question: question.question_text,
              correct: 0,
              wrong: 0,
              total: 0,
              options: { 'A': 0, 'B': 0, 'C': 0, 'D': 0 }
            };
          }

          analysis[questionId].total++;
          analysis[questionId].options[selectedOption as string]++;

          if (selectedOption === question.correct_option) {
            analysis[questionId].correct++;
          } else {
            analysis[questionId].wrong++;
          }
        });
      }
    });

    return Object.entries(analysis).map(([id, data]) => ({
      id: parseInt(id),
      ...data,
      compliance: Math.round((data.correct / data.total) * 100) || 0,
      wrong_percentage: -Math.round((data.wrong / data.total) * 100) || 0
    })).sort((a, b) => a.id - b.id);
  }, [attempts]);

  /**
   * Memoized computation for module-level performance analysis.
   * Groups questions by their respective training modules.
   */
  const topicAnalysisData = useMemo((): TopicAnalysis[] => {
    const topicStats: Record<string, {
      moduleName: string;
      correct: number;
      total: number;
    }> = {};

    attempts.forEach(attempt => {
      if (attempt.answers) {
        Object.entries(attempt.answers).forEach(([qId, selectedOption]) => {
          const questionId = parseInt(qId);
          const question = questions.find(q => q.id === questionId);
          if (!question) return;

          const moduleData = modules.find(m => m.id === question.module);
          const moduleName = moduleData ? moduleData.name : question.module;

          if (!topicStats[question.module]) {
            topicStats[question.module] = {
              moduleName: moduleName,
              correct: 0,
              total: 0,
            };
          }

          topicStats[question.module].total++;
          if (selectedOption === question.correct_option) {
            topicStats[question.module].correct++;
          }
        });
      }
    });

    return Object.entries(topicStats).map(([id, data]) => ({
      id,
      name: data.moduleName,
      compliance: Math.round((data.correct / data.total) * 100) || 0,
      total: data.total
    })).sort((a, b) => a.compliance - b.compliance);
  }, [attempts]);

  /**
   * Memoized computation for category-level performance analysis.
   */
  const categoryAnalysisData = useMemo((): CategoryAnalysis[] => {
    const categories: Record<string, { correct: number; total: number }> = {};
    
    attempts.forEach(attempt => {
      if (attempt.answers) {
        Object.entries(attempt.answers).forEach(([qId, selectedOption]) => {
          const questionId = parseInt(qId);
          const question = questions.find(q => q.id === questionId);
          if (!question) return;

          if (!categories[question.category]) {
            categories[question.category] = { correct: 0, total: 0 };
          }
          categories[question.category].total++;
          if (selectedOption === question.correct_option) {
            categories[question.category].correct++;
          }
        });
      }
    });

    return Object.entries(categories).map(([name, data]) => ({
      name,
      value: Math.round((data.correct / data.total) * 100) || 0,
      count: data.total
    })).sort((a, b) => b.value - a.value);
  }, [attempts]);

  /**
   * Memoized computation for overall qualification distribution.
   */
  const qualifiedDistribution = useMemo(() => {
    return [
      { name: 'Qualified', value: stats.qualified, color: '#14b8a6' },
      { name: 'Not Qualified', value: stats.notQualified, color: '#f87171' }
    ];
  }, [stats.qualified, stats.notQualified]);

  /**
   * Memoized computation for strategic training suggestions based on low performance.
   */
  const suggestions = useMemo((): Suggestion[] => {
    const lowPerformingTopics = topicAnalysisData.filter(topic => topic.compliance < 70);

    if (lowPerformingTopics.length === 0 && topicAnalysisData.length > 0) {
      return [{
        text: "All modules are performing well. Maintain current training standards.",
        topic: "General Performance",
        status: "good"
      }];
    }

    return lowPerformingTopics.map(topic => {
      if (topic.compliance < 50) {
        return {
          text: `Urgent: Focus on "${topic.name}". Average compliance is only ${topic.compliance}%. Intensive retraining recommended.`,
          topic: topic.name,
          status: "urgent"
        };
      }
      return {
        text: `Improvement needed: "${topic.name}" has ${topic.compliance}% compliance. Consider additional refresher sessions.`,
        topic: topic.name,
        status: "warning"
      };
    });
  }, [topicAnalysisData]);


  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchAttempts();
    }
  }, [user, isAdmin]);

  const fetchAttempts = async () => {
    setLoadingData(true);

    try {
      // 1. Fetch test attempts with profiles
      const { data: attemptsData, error: attemptsError } = await supabase
        .from('test_attempts')
        .select(`
          *,
          profiles (email, full_name, emp_id)
        `)
        .order('completed_at', { ascending: false })
        .returns<any>();

      if (attemptsError) throw attemptsError;

      // 2. Fetch user details for these users
      const userIds = attemptsData.map(a => a.user_id);
      const uniqueUserIds = [...new Set(userIds)];

      // console.log('Admin: Fetching details for User IDs:', uniqueUserIds);

      let userDetailsMap: Record<string, any> = {};

      if (uniqueUserIds.length > 0) {
        const { data: detailsData, error: detailsError } = await supabase
          .from('user_details')
          .select('*')
          .in('user_id', uniqueUserIds as string[]);

        // console.log('Admin: User Details Response:', { data: detailsData, error: detailsError });

        if (detailsError) {
          // console.error('Error fetching user details (check RLS policies):', detailsError);
        } else if (detailsData) {
          detailsData.forEach((detail) => {
            userDetailsMap[detail.user_id] = detail;
          });
        }
      }

      // 3. Merge data
      const mergedData = attemptsData.map(attempt => ({
        ...attempt,
        userDetails: userDetailsMap[attempt.user_id] || null
      }));

      setAttempts(mergedData);

      const qualified = mergedData.filter(a => a.qualified).length;
      const totalPercentage = mergedData.reduce((sum, a) => sum + Number(a.percentage), 0);

      setStats({
        total: mergedData.length,
        qualified,
        notQualified: mergedData.length - qualified,
        averageScore: mergedData.length > 0 ? Math.round(totalPercentage / mergedData.length) : 0
      });

    } catch (error) {
      // console.error('Error fetching attempts:', error);
      // Fallback or empty state could be handled here
    }

    setLoadingData(false);
  };

  /**
   * Initiates the re-exam process by opening the confirmation dialog.
   */
  const initiateResetAttempt = (attemptId: string) => {
    setAttemptToReset(attemptId);
    setIsResetDialogOpen(true);
  };

  /**
   * Resets a candidate's test attempt, allowing them to retake the exam.
   * This operation deletes the current attempt record from the database.
   */
  const handleResetAttempt = async () => {
    if (!attemptToReset) return;

    try {
      const { error } = await supabase
        .from('test_attempts')
        .delete()
        .eq('id', attemptToReset);

      if (error) throw error;

      toast({
        title: "Re-exam Allowed",
        description: "The candidate's attempt has been reset. They can now retake the assessment.",
      });

      setIsResetDialogOpen(false);
      setAttemptToReset(null);
      // Refresh the list
      await fetchAttempts();
    } catch (error: any) {
      console.error('Error resetting attempt:', error);
      toast({
        title: "Action Failed",
        description: error.message || "Could not reset the attempt. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportToCsv = useCallback(() => {
    if (attempts.length === 0) return;

    const headers = [
      "Name",
      "Employee ID",
      "Email",
      "First Name",
      "Last Name",
      "Phone Number",
      "Gender",
      "State",
      "City",
      "Process Allocated",
      "Designation",
      "Father Name",
      "Address",
      "Qualification",
      "Date of Birth",
      "Score",
      "Percentage",
      "Status",
      "Date"
    ];

    const rows = attempts.map(attempt => [
      `"${attempt.profiles?.full_name || 'N/A'}"`,
      `"${attempt.profiles?.emp_id || 'N/A'}"`,
      `"${attempt.profiles?.email || 'N/A'}"`,
      `"${attempt.userDetails?.first_name || 'N/A'}"`,
      `"${attempt.userDetails?.last_name || 'N/A'}"`,
      `"${attempt.userDetails?.phone_number || 'N/A'}"`,
      `"${attempt.userDetails?.gender || 'N/A'}"`,
      `"${attempt.userDetails?.state || 'N/A'}"`,
      `"${attempt.userDetails?.city || 'N/A'}"`,
      `"${attempt.userDetails?.process_allocated || 'N/A'}"`,
      `"${attempt.userDetails?.designation || 'N/A'}"`,
      `"${attempt.userDetails?.father_name || 'N/A'}"`,
      `"${attempt.userDetails?.address || 'N/A'}"`,
      `"${attempt.userDetails?.qualification || 'N/A'}"`,
      `"${attempt.userDetails?.date_of_birth || 'N/A'}"`,
      attempt.score,
      attempt.percentage,
      attempt.qualified ? "Qualified" : "Not Qualified",
      `"${new Date(attempt.completed_at).toLocaleString()}"`
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "test_attempts.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [attempts]);

  const buildAnswerRows = useCallback((attempt: TestAttemptWithProfile) => {
    const ans = attempt.answers || {};
    const ids = Object.keys(ans).map(k => Number(k));
    const questionMap = new Map<number, typeof questions[number]>();
    questions.forEach(q => questionMap.set(q.id, q));
    return ids.map(id => {
      const q = questionMap.get(id);
      if (!q) return null;
      const selected = ans[id];
      const correctLabel = q.correct_option;
      const optionMap: Record<string, string> = {
        A: q.option_a,
        B: q.option_b,
        C: q.option_c,
        D: q.option_d,
      };
      return {
        id,
        text: q.question_text,
        options: optionMap,
        selected,
        correct: correctLabel,
        isCorrect: selected === correctLabel,
      };
    }).filter(Boolean) as Array<{
      id: number;
      text: string;
      options: Record<string, string>;
      selected: string;
      correct: string;
      isCorrect: boolean;
    }>;
  }, []);

  const downloadPdfForAttempt = useCallback((attempt: TestAttemptWithProfile) => {
    const rows = buildAnswerRows(attempt);
    const userName = attempt.profiles?.full_name || '';
    const userEmail = attempt.profiles?.email || '';
    const empId = attempt.profiles?.emp_id || '';
    const dob = attempt.userDetails?.date_of_birth || '';
    const phone = attempt.userDetails?.phone_number || '';
    const pa = attempt.userDetails?.process_allocated || '';
    const designation = attempt.userDetails?.designation || '';
    const qualification = attempt.userDetails?.qualification || '';
    const date = new Date(attempt.completed_at).toLocaleString();
    const scoreText = `${attempt.score}/${attempt.total_questions} (${attempt.percentage}%)`;
    const statusText = attempt.qualified ? 'Qualified' : 'Not Qualified';
    const win = window.open('', '_blank');
    if (!win) return;
    const style = `
      <style>
        body { font-family: Arial, sans-serif; color: #111; }
        h1 { font-size: 20px; margin: 0 0 8px 0; }
        h2 { font-size: 16px; margin: 16px 0 8px 0; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 6px; font-size: 12px; vertical-align: top; }
        th { background: #f5f5f5; text-align: left; }
        .meta { margin-bottom: 12px; font-size: 12px; }
        .badge-ok { color: #0a7d2b; }
        .badge-bad { color: #c02b2b; }
      </style>
    `;
    const header = `
      <div class="meta">
        <div><strong>Name:</strong> ${userName}</div>
        <div><strong>Employee ID:</strong> ${empId}</div>
        <div><strong>Email:</strong> ${userEmail}</div>
        <div><strong>Phone:</strong> ${phone}</div>
        <div><strong>Date of Birth:</strong> ${dob || 'N/A'}</div>
        <div><strong>Process Allocated:</strong> ${pa || 'N/A'}</div>
        <div><strong>Designation:</strong> ${designation || 'N/A'}</div>
        <div><strong>Qualification:</strong> ${qualification || 'N/A'}</div>
        <div><strong>Date:</strong> ${date}</div>
        <div><strong>Score:</strong> ${scoreText}</div>
        <div><strong>Status:</strong> ${statusText}</div>
      </div>
    `;
    const tableHeader = `
      <tr>
        <th>#</th>
        <th>Question</th>
        <th>Option A</th>
        <th>Option B</th>
        <th>Option C</th>
        <th>Option D</th>
        <th>Selected</th>
        <th>Correct</th>
        <th>Result</th>
      </tr>
    `;
    const tableRows = rows.map((r, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${r.text}</td>
        <td>${r.options.A}</td>
        <td>${r.options.B}</td>
        <td>${r.options.C}</td>
        <td>${r.options.D}</td>
        <td>${r.selected}</td>
        <td>${r.correct}</td>
        <td>${r.isCorrect ? '<span class="badge-ok">Correct</span>' : '<span class="badge-bad">Wrong</span>'}</td>
      </tr>
    `).join('');
    const html = `
      <html>
        <head>
          <title>Answer Sheet</title>
          ${style}
        </head>
        <body>
          <h1>Answer Sheet</h1>
          ${header}
          <h2>Questions</h2>
          <table>
            ${tableHeader}
            ${tableRows}
          </table>
        </body>
      </html>
    `;
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  }, [buildAnswerRows]);

  if (authLoading || (!user && !authLoading) || (!isAdmin && !authLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading admin panel...
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <div className="w-full mx-auto space-y-8 px-8">

        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-red-300 border border-gray-300 rounded-md px-2 py-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className='justify-center items-center flex bg-gray-100 rounded-md'>
            <h1 className=" text-4xl font-extrabold tracking-wide  ">
              ElderLine Staff Welfare Forum
            </h1>
          </div>

          <Button
            variant="outline"
            onClick={exportToCsv}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-red-300 border border-gray-300 rounded-md px-2 py-1"
          >
            <Download className="h-4 w-4" />
            Download Excel
          </Button>
        </div>


        <div className="flex items-center justify-between rounded-md bg-white p-4 shadow-md">

          <div className="flex items-center gap-2 cursor-pointer "onClick={()=>navigate('/')} >
            <img src="/icons/emblem.png" alt="ministry of justice" className="h-20 w-20 " />
            <div >
              <h2 className="font-bold text-md text-foreground">Department of Social Justice & Empowerment</h2>
              <h2 className="font-bold text-gray-600 text-xs text-foreground">Ministry of Social Justice & Empowerment</h2>
              <h2 className="font-bold text-gray-600  text-xs text-foreground">Government of India</h2>
            </div>


          </div>
          <img src="/tcil.png" alt="ministry of justice" className="h-20 w-50 " />


        </div>
        {/* <Header user={user} /> */}

        {/* <h2 className='text-2xl font-bold tracking-wide text-gray-500 pb-4'>Welcome {user?.user_metadata?.full_name}</h2> */}

        {/* Stats Cards */}
        <ErrorBoundary>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-between 
          ">
            <StatCard
              label="Total Attempts"
              value={stats.total}
              icon={BarChart3}
              bgImage="/icons/bg2.png"
              colorClass="border-custom-blue"
            />
            <StatCard
              label="Qualified"
              value={stats.qualified}
              icon={CheckCircle}
              bgImage="/icons/bg3.png"
              colorClass="border-custom-green"
            />
            <StatCard
              label="Not Qualified"
              value={stats.notQualified}
              icon={XCircle}
              bgImage="/icons/bg4.png"
              colorClass="border-custom-red"
            />
            <StatCard
              label="Average Score"
              value={`${stats.averageScore}%`}
              icon={Users}
              bgImage="/icons/bg1.png"
              colorClass="border-custom-purple"
            />
          </div>
        </ErrorBoundary>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8">
          <Button
            variant={activeTab === 'table' ? 'default' : 'outline'}
            onClick={() => setActiveTab('table')}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Candidate Results
          </Button>
          <Button
            variant={activeTab === 'analysis' ? 'default' : 'outline'}
            onClick={() => setActiveTab('analysis')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Question Analysis
          </Button>
        </div>

        <ErrorBoundary>
          <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading component...</div>}>
            {activeTab === 'table' ? (
              <CandidateResultsTable
                attempts={paginatedAttempts}
                loadingData={loadingData}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                selectedAttempt={selectedAttempt}
                setSelectedAttempt={setSelectedAttempt}
                buildAnswerRows={buildAnswerRows}
                downloadPdfForAttempt={downloadPdfForAttempt}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                totalResults={filteredAttempts.length}
                onResetAttempt={initiateResetAttempt}
              />
            ) : (
              <ChartsSection
                chartType={chartType}
                setChartType={setChartType}
                questionAnalysisData={questionAnalysisData}
                topicAnalysisData={topicAnalysisData}
                categoryAnalysisData={categoryAnalysisData}
                qualifiedDistribution={qualifiedDistribution}
                suggestions={suggestions}
                currentPage={qCurrentPage}
                setCurrentPage={setQCurrentPage}
                itemsPerPage={qItemsPerPage}
                setItemsPerPage={setQItemsPerPage}
              />
            )}
          </Suspense>
        </ErrorBoundary>
      </div>

      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent className="bg-white rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              Confirm Re-exam Allowance
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 pt-2">
              Are you sure you want to allow a re-exam for this candidate?
              <br /><br />
              This will <span className="font-bold text-red-600 underline">permanently delete</span> their current assessment result. The candidate will then see the "Take Assessment" button again on their dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-lg border-gray-200 hover:bg-gray-50">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetAttempt}
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg px-6"
            >
              Confirm & Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;
