import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { formatDistanceToNow, parseISO } from 'date-fns';
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
        setError('Failed to load conversations.');
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
    <div className="space-y-12 animate-in fade-in duration-700 pb-12">
      <div className="flex justify-between items-end">
        <h1 className="text-4xl font-serif text-stone-100 tracking-tight">Conversations</h1>
        {!loading && (
          <span className="text-stone-500 uppercase tracking-widest text-xs">
            {totalCount} Total
          </span>
        )}
      </div>

      {error && (
        <div className="text-clay-500 py-2 border-b border-clay-500/30">
          {error}
        </div>
      )}

      <div>
        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 pb-6 border-b border-stone-800">
                <Skeleton className="h-5 w-48 bg-stone-800/50" />
                <Skeleton className="h-5 w-24 ml-auto bg-stone-800/50" />
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="py-20 text-stone-500 font-serif italic text-lg border-t border-stone-800">
            No conversations recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="border-b border-stone-800 text-stone-500 uppercase tracking-widest text-xs">
                  <th className="pb-4 font-normal">Contact</th>
                  <th className="pb-4 font-normal hidden md:table-cell">Platform</th>
                  <th className="pb-4 font-normal text-right">Messages</th>
                  <th className="pb-4 font-normal text-right hidden sm:table-cell">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/50">
                {conversations.map((conv) => {
                  const displayName = conv.username || conv.instagramUserId;
                  
                  return (
                    <tr 
                      key={conv._id} 
                      onClick={() => handleRowClick(conv._id)}
                      className="hover:bg-stone-800/20 transition-colors cursor-pointer group"
                    >
                      <td className="py-5 pr-6">
                        <span className="font-serif text-stone-100 text-lg group-hover:text-clay-500 transition-colors">
                          {displayName}
                        </span>
                        <span className="block text-xs text-stone-500 sm:hidden mt-1">
                          {formatLastActive(conv.lastMessageAt)}
                        </span>
                      </td>
                      <td className="py-5 pr-6 hidden md:table-cell text-stone-400 capitalize">
                        {conv.platform}
                      </td>
                      <td className="py-5 pr-6 text-right font-serif text-lg text-stone-300">
                        {conv.messageCount}
                      </td>
                      <td className="py-5 text-right text-stone-500 hidden sm:table-cell">
                        {formatLastActive(conv.lastMessageAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && conversations.length > 0 && (
          <div className="mt-8 flex justify-between items-center text-sm uppercase tracking-widest text-xs font-medium border-t border-stone-800 pt-6">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="text-stone-500 hover:text-stone-100 disabled:opacity-30 transition-colors"
            >
              Previous
            </button>
            <div className="text-stone-500">
              <span className="text-stone-200">{currentPage}</span> / {totalPages}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="text-stone-500 hover:text-stone-100 disabled:opacity-30 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsList;
