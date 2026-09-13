import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Loader2, ChevronLeft, ChevronRight, MessageSquare, ExternalLink } from 'lucide-react';

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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-50">Conversations</h1>
        <p className="text-slate-400 mt-1">
          View and manage interactions with your Instagram users.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="text-indigo-500 animate-spin" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <MessageSquare size={48} className="mb-4 opacity-50" />
            <p>No conversations found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-sm">
                  <th className="px-6 py-4 font-medium">Instagram User ID</th>
                  <th className="px-6 py-4 font-medium">Platform</th>
                  <th className="px-6 py-4 font-medium">Messages</th>
                  <th className="px-6 py-4 font-medium">Last Active</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {conversations.map((conv) => (
                  <tr 
                    key={conv._id} 
                    onClick={() => handleRowClick(conv._id)}
                    className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-medium">
                          {(conv.username || conv.instagramUserId)?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span className="font-medium text-slate-200">
                          {conv.username || conv.instagramUserId}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 capitalize">
                      {conv.platform}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                        {conv.messageCount} msgs
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {formatLastActive(conv.lastMessageAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ExternalLink size={18} className="inline-block text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && conversations.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/50">
            <span className="text-sm text-slate-400">
              Showing <span className="font-medium text-slate-200">{(currentPage - 1) * limit + 1}</span> to{' '}
              <span className="font-medium text-slate-200">{Math.min(currentPage * limit, totalCount)}</span> of{' '}
              <span className="font-medium text-slate-200">{totalCount}</span> results
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-1 rounded-md text-slate-400 hover:text-slate-50 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-slate-300 font-medium px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-1 rounded-md text-slate-400 hover:text-slate-50 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsList;
