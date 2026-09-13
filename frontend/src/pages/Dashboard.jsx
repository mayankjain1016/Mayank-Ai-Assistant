import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import {
  MessageCircle,
  Bot,
  UserPlus,
  Users,
  Clock,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { cn } from '../lib/utils';
import { Skeleton } from '../components/ui/Skeleton';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [period, setPeriod] = useState(7);
  
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTrends, setLoadingTrends] = useState(true);
  const [togglingAi, setTogglingAi] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState('');

  // Fetch AI Toggle status on mount
  useEffect(() => {
    const fetchAiStatus = async () => {
      try {
        const res = await axiosClient.get('/api/v1/settings/ai-toggle');
        setAiEnabled(res.data.data.aiEnabled);
      } catch (err) {
        console.error('Failed to fetch AI status:', err);
      }
    };
    fetchAiStatus();
  }, []);

  // Fetch Stats when period changes
  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      setError('');
      try {
        const res = await axiosClient.get(`/api/v1/dashboard/stats?period=${period}`);
        setStats(res.data.data);
      } catch (err) {
        setError('Failed to load dashboard stats.');
        console.error(err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [period]);

  // Fetch Trends when period changes
  useEffect(() => {
    const fetchTrends = async () => {
      setLoadingTrends(true);
      try {
        const res = await axiosClient.get(`/api/v1/analytics/trends?days=${period}`);
        setTrends(res.data.data);
      } catch (err) {
        console.error('Failed to load trends:', err);
      } finally {
        setLoadingTrends(false);
      }
    };
    fetchTrends();
  }, [period]);

  const handleToggleAi = async () => {
    setTogglingAi(true);
    try {
      const res = await axiosClient.patch('/api/v1/settings/ai-toggle', {
        aiEnabled: !aiEnabled,
      });
      setAiEnabled(res.data.data.aiEnabled);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to toggle AI:', err);
      alert('Failed to toggle AI settings.');
    } finally {
      setTogglingAi(false);
    }
  };

  const formatResponseTime = (seconds) => {
    if (!seconds) return '0s';
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const formatChartDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Header & Controls */}
      <PageHeader 
        title="Dashboard" 
        description="Overview of your Instagram AI Assistant performance"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 w-full">
          
          {/* AI Toggle Control */}
          <div className="flex items-center justify-between sm:justify-start gap-4 bg-slate-900 border border-slate-800/60 p-2 sm:pr-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 px-2 sm:px-3">
              <div className={cn("w-2 h-2 rounded-full", aiEnabled ? "bg-emerald-500 animate-pulse" : "bg-slate-500")} />
              <span className="text-sm font-medium text-slate-200">
                AI Auto-Reply
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleAi}
                disabled={togglingAi}
                className={cn(
                  "relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50",
                  aiEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                )}
              >
                <span
                  className={cn(
                    "inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm",
                    aiEnabled ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
              
              {/* Toast */}
              <div className={cn(
                "absolute -top-10 left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 transition-all duration-300 flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md",
                showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
              )}>
                <CheckCircle2 size={14} /> Updated
              </div>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex bg-slate-900 border border-slate-800/60 rounded-xl p-1 shadow-sm w-full sm:w-auto">
            <button
              onClick={() => setPeriod(7)}
              className={cn(
                "flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200",
                period === 7 
                  ? "bg-slate-800 text-slate-50 shadow-sm" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              )}
            >
              7 Days
            </button>
            <button
              onClick={() => setPeriod(30)}
              className={cn(
                "flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200",
                period === 30 
                  ? "bg-slate-800 text-slate-50 shadow-sm" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              )}
            >
              30 Days
            </button>
          </div>

        </div>
      </PageHeader>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          title="Total DMs"
          value={stats?.totalDMs?.toLocaleString() || 0}
          icon={MessageCircle}
          colorClass="text-blue-400"
          bgClass="bg-blue-500/10"
          loading={loadingStats}
        />
        <StatCard
          title="AI Replies"
          value={stats?.aiReplies?.toLocaleString() || 0}
          icon={Bot}
          colorClass="text-indigo-400"
          bgClass="bg-indigo-500/10"
          loading={loadingStats}
        />
        <StatCard
          title="Avg Response Time"
          value={formatResponseTime(stats?.avgResponseTimeSeconds)}
          icon={Clock}
          colorClass="text-emerald-400"
          bgClass="bg-emerald-500/10"
          loading={loadingStats}
        />
        <StatCard
          title="New Leads"
          value={stats?.newLeads?.toLocaleString() || 0}
          icon={UserPlus}
          colorClass="text-amber-400"
          bgClass="bg-amber-500/10"
          loading={loadingStats}
        />
        <StatCard
          title="Active Users"
          value={stats?.activeUsers?.toLocaleString() || 0}
          icon={Users}
          colorClass="text-purple-400"
          bgClass="bg-purple-500/10"
          loading={loadingStats}
        />
      </div>

      {/* Chart Section */}
      <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6 px-2 sm:px-0">
          <Activity className="text-indigo-400" size={20} />
          <h2 className="text-lg font-semibold text-slate-50 tracking-tight">Message Activity</h2>
        </div>
        
        <div className="h-[300px] sm:h-[400px] w-full">
          {loadingTrends ? (
            <Skeleton className="w-full h-full rounded-xl" />
          ) : trends.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatChartDate}
                  stroke="#475569"
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  dy={15}
                  minTickGap={30}
                />
                <YAxis 
                  stroke="#475569"
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                />
                <Tooltip
                  cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #1e293b', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                  }}
                  itemStyle={{ color: '#f8fafc', fontWeight: 500 }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontSize: '13px' }}
                  labelFormatter={formatChartDate}
                />
                <Legend 
                  iconType="circle" 
                  wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: 500 }} 
                />
                <Line 
                  type="monotone" 
                  name="User Messages"
                  dataKey="userMessages" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#0f172a', stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
                />
                <Line 
                  type="monotone" 
                  name="AI Replies"
                  dataKey="assistantMessages" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#0f172a', stroke: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#8b5cf6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-950/50 rounded-xl border border-slate-800/50 border-dashed">
              No activity data available for this period.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
