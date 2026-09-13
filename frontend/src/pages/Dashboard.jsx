import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
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
  const [error, setError] = useState('');

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

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      setError('');
      try {
        const res = await axiosClient.get(`/api/v1/dashboard/stats?period=${period}`);
        setStats(res.data.data);
      } catch (err) {
        setError('Failed to load dashboard stats.');
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [period]);

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
    <div className="space-y-16 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-apple-border pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-apple-text">Overview</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex bg-apple-surface rounded-full p-1">
            <button
              onClick={() => setPeriod(7)}
              className={cn("px-4 py-1.5 rounded-full text-[13px] font-medium transition-all", period === 7 ? "bg-white shadow-sm text-apple-text" : "text-apple-meta")}
            >
              7 Days
            </button>
            <button
              onClick={() => setPeriod(30)}
              className={cn("px-4 py-1.5 rounded-full text-[13px] font-medium transition-all", period === 30 ? "bg-white shadow-sm text-apple-text" : "text-apple-meta")}
            >
              30 Days
            </button>
          </div>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* AI Toggle Banner */}
      <div className="flex items-center justify-between bg-apple-surface rounded-3xl p-6 md:p-8">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-apple-text mb-1">AI Assistant</h2>
          <p className="text-sm text-apple-meta">Automatically respond to incoming DMs.</p>
        </div>
        <button
          onClick={handleToggleAi}
          disabled={togglingAi}
          className={cn(
            "relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300",
            aiEnabled ? 'bg-[#34C759]' : 'bg-[#E5E5EA]' // Apple Green
          )}
        >
          <span
            className={cn(
              "inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-sm",
              aiEnabled ? 'translate-x-7' : 'translate-x-1'
            )}
          />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-apple-surface rounded-3xl p-6 md:p-8">
          <p className="text-[13px] font-semibold text-apple-meta mb-2 tracking-wide uppercase">Total DMs</p>
          {loadingStats ? (
            <Skeleton className="h-12 w-24" />
          ) : (
            <p className="text-5xl font-bold tracking-tighter text-apple-text">
              {stats?.totalDMs?.toLocaleString() || 0}
            </p>
          )}
        </div>
        
        <div className="bg-apple-surface rounded-3xl p-6 md:p-8">
          <p className="text-[13px] font-semibold text-apple-meta mb-2 tracking-wide uppercase">AI Replies</p>
          {loadingStats ? (
            <Skeleton className="h-12 w-24" />
          ) : (
            <p className="text-5xl font-bold tracking-tighter text-apple-blue">
              {stats?.aiReplies?.toLocaleString() || 0}
            </p>
          )}
        </div>

        <div className="bg-apple-surface rounded-3xl p-6 md:p-8">
          <p className="text-[13px] font-semibold text-apple-meta mb-2 tracking-wide uppercase">New Leads</p>
          {loadingStats ? (
            <Skeleton className="h-12 w-24" />
          ) : (
            <p className="text-5xl font-bold tracking-tighter text-apple-text">
              {stats?.newLeads?.toLocaleString() || 0}
            </p>
          )}
        </div>

        <div className="bg-apple-surface rounded-3xl p-6 md:p-8">
          <p className="text-[13px] font-semibold text-apple-meta mb-2 tracking-wide uppercase">Avg Time</p>
          {loadingStats ? (
            <Skeleton className="h-12 w-24" />
          ) : (
            <p className="text-5xl font-bold tracking-tighter text-apple-text">
              {formatResponseTime(stats?.avgResponseTimeSeconds)}
            </p>
          )}
        </div>
      </div>

      {/* Chart Section */}
      <div className="pt-4">
        <h2 className="text-2xl font-bold tracking-tight text-apple-text mb-8">Activity</h2>
        
        <div className="h-[400px] w-full">
          {loadingTrends ? (
            <Skeleton className="w-full h-full rounded-3xl" />
          ) : trends.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatChartDate}
                  stroke="#E5E5EA"
                  tick={{ fill: '#86868B', fontSize: 13, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  dy={15}
                  minTickGap={30}
                />
                <YAxis 
                  stroke="#E5E5EA"
                  tick={{ fill: '#86868B', fontSize: 13, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                />
                <Tooltip
                  cursor={{ stroke: '#E5E5EA', strokeWidth: 1 }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    backdropFilter: 'blur(12px)',
                    border: '1px solid #E5E5EA', 
                    borderRadius: '16px',
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)'
                  }}
                  itemStyle={{ color: '#1D1D1F', fontWeight: 600, fontSize: '14px' }}
                  labelStyle={{ color: '#86868B', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}
                  labelFormatter={formatChartDate}
                />
                <Line 
                  type="monotone" 
                  name="AI Replies"
                  dataKey="assistantMessages" 
                  stroke="#0066CC" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#0066CC', strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  name="User Messages"
                  dataKey="userMessages" 
                  stroke="#1D1D1F" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#1D1D1F', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-apple-meta bg-apple-surface rounded-3xl">
              No activity data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
