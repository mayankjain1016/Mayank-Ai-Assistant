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
        console.error(err);
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
    <div className="space-y-16 animate-in fade-in duration-700 pb-12">
      
      {/* Header & Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8">
        <div>
          <h1 className="text-4xl font-serif text-stone-100 tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-6 mt-6">
            <span className="text-stone-400 uppercase tracking-widest text-xs">AI Auto-Reply</span>
            <button
              onClick={handleToggleAi}
              disabled={togglingAi}
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div
                className={cn(
                  "w-10 h-1.5 rounded-full transition-colors duration-300 relative",
                  aiEnabled ? "bg-clay-600" : "bg-stone-800"
                )}
              >
                <div 
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all duration-300",
                    aiEnabled ? "bg-clay-500 left-full -translate-x-full" : "bg-stone-500 left-0"
                  )} 
                />
              </div>
              <span className={cn(
                "text-sm font-medium transition-colors uppercase tracking-widest text-xs",
                aiEnabled ? "text-clay-500" : "text-stone-500"
              )}>
                {aiEnabled ? 'Active' : 'Paused'}
              </span>
            </button>
          </div>
        </div>
        
        {/* Period Selector (Subtle text links) */}
        <div className="flex items-center gap-4 text-sm uppercase tracking-widest text-xs font-medium">
          <button
            onClick={() => setPeriod(7)}
            className={cn("transition-colors", period === 7 ? "text-stone-100" : "text-stone-600 hover:text-stone-400")}
          >
            7 Days
          </button>
          <span className="text-stone-800">/</span>
          <button
            onClick={() => setPeriod(30)}
            className={cn("transition-colors", period === 30 ? "text-stone-100" : "text-stone-600 hover:text-stone-400")}
          >
            30 Days
          </button>
        </div>
      </div>

      {error && (
        <div className="text-clay-500 py-2 border-b border-clay-500/30">
          {error}
        </div>
      )}

      {/* Stats Section: Asymmetric Typography */}
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-start">
        
        {/* Massive Key Numbers */}
        <div className="flex gap-16">
          <div>
            <p className="text-stone-500 uppercase tracking-widest text-xs mb-4">Total DMs</p>
            {loadingStats ? (
              <Skeleton className="h-16 w-32 bg-stone-800/50" />
            ) : (
              <p className="font-serif text-7xl font-bold text-stone-100 tracking-tight leading-none">
                {stats?.totalDMs?.toLocaleString() || 0}
              </p>
            )}
          </div>
          <div>
            <p className="text-stone-500 uppercase tracking-widest text-xs mb-4">AI Replies</p>
            {loadingStats ? (
              <Skeleton className="h-16 w-32 bg-stone-800/50" />
            ) : (
              <p className="font-serif text-7xl font-bold text-clay-500 tracking-tight leading-none">
                {stats?.aiReplies?.toLocaleString() || 0}
              </p>
            )}
          </div>
        </div>

        {/* List of Secondary Stats */}
        <div className="flex-1 w-full lg:w-auto">
          <ul className="space-y-4">
            <li className="flex justify-between items-end border-b border-stone-800 pb-2">
              <span className="text-stone-400">Response Time</span>
              {loadingStats ? <Skeleton className="h-6 w-16 bg-stone-800/50" /> : <span className="text-stone-100 text-lg">{formatResponseTime(stats?.avgResponseTimeSeconds)}</span>}
            </li>
            <li className="flex justify-between items-end border-b border-stone-800 pb-2">
              <span className="text-stone-400">New Leads</span>
              {loadingStats ? <Skeleton className="h-6 w-12 bg-stone-800/50" /> : <span className="text-stone-100 text-lg">{stats?.newLeads?.toLocaleString() || 0}</span>}
            </li>
            <li className="flex justify-between items-end border-b border-stone-800 pb-2">
              <span className="text-stone-400">Active Users</span>
              {loadingStats ? <Skeleton className="h-6 w-12 bg-stone-800/50" /> : <span className="text-stone-100 text-lg">{stats?.activeUsers?.toLocaleString() || 0}</span>}
            </li>
          </ul>
        </div>
      </div>

      {/* Chart Section */}
      <div className="pt-8">
        <h2 className="font-serif text-2xl text-stone-100 mb-8">Activity Volume</h2>
        
        <div className="h-[400px] w-full">
          {loadingTrends ? (
            <Skeleton className="w-full h-full bg-stone-800/50 rounded-none" />
          ) : trends.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatChartDate}
                  stroke="#57534e"
                  tick={{ fill: '#78716c', fontSize: 12 }}
                  axisLine={{ stroke: '#292524' }}
                  tickLine={false}
                  dy={15}
                  minTickGap={30}
                />
                <YAxis 
                  stroke="#57534e"
                  tick={{ fill: '#78716c', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                />
                <Tooltip
                  cursor={{ stroke: '#292524', strokeWidth: 1 }}
                  contentStyle={{ 
                    backgroundColor: '#1c1917', 
                    border: '1px solid #292524', 
                    borderRadius: '0',
                    boxShadow: 'none'
                  }}
                  itemStyle={{ color: '#f5f5f4' }}
                  labelStyle={{ color: '#78716c', marginBottom: '8px', fontSize: '12px' }}
                  labelFormatter={formatChartDate}
                />
                <Line 
                  type="monotone" 
                  name="AI Replies"
                  dataKey="assistantMessages" 
                  stroke="#c2410c" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#c2410c', strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  name="User Messages"
                  dataKey="userMessages" 
                  stroke="#57534e" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#57534e', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-500 border-t border-stone-800">
              No activity data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
