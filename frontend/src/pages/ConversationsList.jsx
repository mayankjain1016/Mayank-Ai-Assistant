import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, MessageSquare, ExternalLink, Inbox } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Skeleton } from '../components/ui/Skeleton';
import { cn } from '../lib/utils';

const ConversationsList = () => {
  const [conversations, setConversations] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const limit = 10;

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axiosClient.get(`/api/v1/analytics/conversations?page=${currentPage}&limit=${limit}`);
        const data = res.data.data;
        setConversations(data.conversations || []);
        setTotalCount(data.totalCount || 0);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('Failed to load conversations:', err);
        setError('Failed to load conversations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleRowClick = (id) => {
    navigate(`/conversations/${id}`);
  };

  const formatLastActive = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-12">
      <PageHeader 
        title="Conversations" 
        description="View and manage interactions with your Instagram users."
      />

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800/60 rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[500px]">
        {loading ? (
          <div className="flex-1 p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-24 ml-auto hidden sm:block" />
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center text-slate-500 mb-6">
              <Inbox size={32} />
            </div>
            <h3 className="text-xl font-semibold text-slate-200 mb-2">No conversations yet</h3>
            <p className="text-slate-400 max-w-sm">
              When users interact with your AI Assistant on Instagram, their conversations will appear here.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800/60 text-slate-400 text-xs sm:text-sm tracking-wide uppercase">
                  <th className="px-4 sm:px-6 py-4 font-semibold">User</th>
                  <th className="px-4 sm:px-6 py-4 font-semibold hidden md:table-cell">Platform</th>
                  <th className="px-4 sm:px-6 py-4 font-semibold">Messages</th>
                  <th className="px-4 sm:px-6 py-4 font-semibold hidden sm:table-cell">Last Active</th>
                  <th className="px-4 sm:px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {conversations.map((conv) => {
                  const displayName = conv.username || conv.instagramUserId;
                  const initial = displayName?.charAt(0).toUpperCase() || '?';
                  
                  return (
                    <tr 
                      key={conv._id} 
                      onClick={() => handleRowClick(conv._id)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold text-sm sm:text-base shrink-0">
                            {initial}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-slate-200 truncate">
                              {displayName}
                            </span>
                            <span className="text-xs text-slate-500 sm:hidden mt-0.5 truncate">
                              {formatLastActive(conv.lastMessageAt)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/50 text-slate-300 capitalize border border-slate-700/50">
                          {conv.platform}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <MessageSquare size={12} className="mr-1.5" />
                          {conv.messageCount}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-slate-400 text-sm hidden sm:table-cell">
                        {formatLastActive(conv.lastMessageAt)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <button className="p-2 -mr-2 rounded-lg text-slate-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors inline-flex items-center justify-center">
                          <ExternalLink size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && conversations.length > 0 && (
          <div className="px-4 sm:px-6 py-4 border-t border-slate-800/60 bg-slate-950/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-slate-400">
              Showing <span className="font-medium text-slate-200">{(currentPage - 1) * limit + 1}</span> to{' '}
              <span className="font-medium text-slate-200">{Math.min(currentPage * limit, totalCount)}</span> of{' '}
              <span className="font-medium text-slate-200">{totalCount}</span> results
            </span>
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-md text-slate-400 hover:text-slate-50 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 text-sm font-medium"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <div className="px-2 text-sm font-medium text-slate-500">
                <span className="text-slate-200">{currentPage}</span> / {totalPages}
              </div>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-md text-slate-400 hover:text-slate-50 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 text-sm font-medium"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsList;
