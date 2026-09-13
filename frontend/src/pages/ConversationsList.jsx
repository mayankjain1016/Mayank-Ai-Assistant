import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Skeleton } from '../components/ui/Skeleton';
import { ChevronRight } from 'lucide-react';
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-apple-border pb-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-apple-text">Messages</h1>
        {!loading && (
          <span className="text-[15px] font-medium text-apple-meta bg-apple-surface px-4 py-1.5 rounded-full">
            {totalCount} Total
          </span>
        )}
      </div>

      {error && (
        <div className="text-red-500 font-medium py-2">
          {error}
        </div>
      )}

      <div>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-4 border-b border-apple-border/50">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="py-24 text-center text-apple-meta text-lg font-medium">
            No messages yet.
          </div>
        ) : (
          <div className="flex flex-col">
            {conversations.map((conv) => {
              const displayName = conv.username || conv.instagramUserId;
              const initial = displayName?.charAt(0).toUpperCase() || '?';
              
              return (
                <div 
                  key={conv._id} 
                  onClick={() => handleRowClick(conv._id)}
                  className="flex items-center gap-4 py-4 border-b border-apple-border/50 cursor-pointer hover:bg-apple-surface/50 transition-colors -mx-4 px-4 rounded-2xl group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#E5E5EA] flex items-center justify-center text-apple-text font-bold text-lg shrink-0">
                    {initial}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="font-semibold text-[17px] text-apple-text truncate">
                        {displayName}
                      </span>
                      <span className="text-[15px] text-apple-meta shrink-0 ml-4 hidden sm:inline">
                        {formatLastActive(conv.lastMessageAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] text-apple-meta truncate">
                        {conv.messageCount} messages • {conv.platform}
                      </span>
                    </div>
                  </div>
                  
                  <div className="shrink-0 text-apple-meta/50 group-hover:text-apple-meta transition-colors pl-2">
                    <ChevronRight size={20} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && conversations.length > 0 && (
          <div className="mt-12 flex justify-between items-center text-[15px] font-medium">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="text-apple-blue hover:opacity-70 disabled:text-apple-meta disabled:opacity-50 transition-all px-4 py-2 bg-apple-surface rounded-full"
            >
              Previous
            </button>
            <div className="text-apple-meta">
              <span className="text-apple-text">{currentPage}</span> of {totalPages}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="text-apple-blue hover:opacity-70 disabled:text-apple-meta disabled:opacity-50 transition-all px-4 py-2 bg-apple-surface rounded-full"
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
