import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import {
  MessageCircle,
  Bot,
  UserPlus,
  Users,
  Clock,
  Activity,
  Loader2,
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

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-start gap-4 shadow-sm hover:border-slate-700 transition-colors">
    <div className={`p-3 rounded-xl ${colorClass}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-slate-400 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-50 mt-1">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [period, setPeriod] = useState(7);
  
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTrends, setLoadingTrends] = useState(true);
  const [togglingAi, setTogglingAi] = useState(false);
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">Dashboard</h1>
          <p className="text-slate-400 mt-1">Overview of your Instagram AI Assistant</p>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-2 rounded-xl">
          {/* AI Toggle */}
          <div className="flex items-center gap-3 px-3 border-r border-slate-800 pr-5">
            <span className="text-sm font-medium text-slate-300">AI Auto-Reply</span>
            <button
              onClick={handleToggleAi}
              disabled={togglingAi}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                aiEnabled ? 'bg-indigo-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  aiEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Period Selector */}
          <div className="flex bg-slate-950 rounded-lg p-1">
            <button
              onClick={() => setPeriod(7)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                period === 7 ? 'bg-slate-800 text-slate-50' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setPeriod(30)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                period === 30 ? 'bg-slate-800 text-slate-50' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      {loadingStats ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-indigo-500 animate-spin" />
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <StatCard
            title="Total DMs"
            value={stats.totalDMs?.toLocaleString() || 0}
            icon={MessageCircle}
            colorClass="bg-blue-500/10 text-blue-400"
          />
          <StatCard
            title="AI Replies"
            value={stats.aiReplies?.toLocaleString() || 0}
            icon={Bot}
            colorClass="bg-indigo-500/10 text-indigo-400"
          />
          <StatCard
            title="Avg Response Time"
            value={formatResponseTime(stats.avgResponseTimeSeconds)}
            icon={Clock}
            colorClass="bg-emerald-500/10 text-emerald-400"
          />
          <StatCard
            title="New Leads"
            value={stats.newLeads?.toLocaleString() || 0}
            icon={UserPlus}
            colorClass="bg-purple-500/10 text-purple-400"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers?.toLocaleString() || 0}
            icon={Users}
            colorClass="bg-amber-500/10 text-amber-400"
          />
        </div>
      ) : null}

      {/* Chart Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="text-indigo-500" size={20} />
          <h2 className="text-lg font-semibold text-slate-50">Message Activity</h2>
        </div>
        
        <div className="h-[400px] w-full">
          {loadingTrends ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 size={32} className="text-indigo-500 animate-spin" />
            </div>
          ) : trends.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatChartDate}
                  stroke="#475569"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#475569"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '8px' }}
                  labelFormatter={formatChartDate}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line 
                  type="monotone" 
                  name="User Messages"
                  dataKey="userMessages" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  name="AI Replies"
                  dataKey="assistantMessages" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              No activity data available for this period.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
