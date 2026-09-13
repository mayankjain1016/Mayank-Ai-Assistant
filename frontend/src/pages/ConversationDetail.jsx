import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { format, parseISO, differenceInMinutes, isSameDay } from 'date-fns';
import { ArrowLeft, Bot, User, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import { Skeleton } from '../components/ui/Skeleton';

const ConversationDetail = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axiosClient.get(`/api/v1/analytics/conversations/${conversationId}`);
        const data = res.data.data;
        setConversation(data);
        setMessages(data.messages || []);
      } catch (err) {
        console.error('Failed to load conversation details:', err);
        setError('Failed to load conversation details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [conversationId]);

  useEffect(() => {
    // Scroll to bottom when messages load or change
    if (!loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const formatMessageTime = (dateString) => {
    try {
      return format(parseISO(dateString), 'h:mm a');
    } catch {
      return '';
    }
  };

  const formatHeaderDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy');
    } catch {
      return '';
    }
  };

  // Group messages logic
  const groupedMessages = [];
  let currentGroup = null;

  messages.forEach((msg, index) => {
    const msgDate = parseISO(msg.createdAt);
    
    // Create new group if different role, or if > 10 mins apart, or if different day
    if (!currentGroup || 
        currentGroup.role !== msg.role ||
        differenceInMinutes(msgDate, currentGroup.lastDate) > 10 ||
        !isSameDay(msgDate, currentGroup.lastDate)
    ) {
      if (currentGroup) groupedMessages.push(currentGroup);
      currentGroup = {
        id: msg._id,
        role: msg.role,
        messages: [msg],
        firstDate: msgDate,
        lastDate: msgDate,
      };
    } else {
      currentGroup.messages.push(msg);
      currentGroup.lastDate = msgDate;
    }

    // Push the last group
    if (index === messages.length - 1) {
      groupedMessages.push(currentGroup);
    }
  });

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm max-w-4xl mx-auto mt-8">
        {error}
      </div>
    );
  }

  const displayName = conversation?.username || conversation?.instagramUserId;
  const initial = displayName?.charAt(0).toUpperCase() || '?';

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-5rem)] lg:h-[calc(100vh-4rem)] flex flex-col bg-white border-x border-gray-200 shadow-xl overflow-hidden animate-in fade-in duration-500">
      
      {/* Sticky Header */}
      <div className="flex items-center gap-4 p-4 sm:p-6 bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => navigate('/conversations')}
          className="p-2 -ml-2 rounded-xl text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        
        {loading ? (
          <div className="flex items-center gap-4 flex-1">
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-black font-semibold text-lg shrink-0 shadow-sm shadow-black/5">
              {initial}
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-black flex items-center gap-3 tracking-tight">
                {displayName}
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 bg-gray-100 border border-gray-300 text-gray-700 rounded-md capitalize tracking-wide">
                  {conversation?.platform}
                </span>
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5 font-medium">
                Started {formatHeaderDate(conversation?.createdAt)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 scroll-smooth bg-gray-50">
        {loading ? (
          <div className="space-y-8">
            <div className="flex gap-4">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <Skeleton className="h-16 w-64 rounded-2xl rounded-tl-sm" />
            </div>
            <div className="flex gap-4 flex-row-reverse">
              <Skeleton className="h-12 w-48 rounded-2xl rounded-tr-sm" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <Skeleton className="h-24 w-72 rounded-2xl rounded-tl-sm" />
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-black0">
            <MessageSquare size={40} className="mb-4 opacity-50" />
            <p>No messages in this conversation.</p>
          </div>
        ) : (
          groupedMessages.map((group) => {
            const isUser = group.role === 'user';
            
            return (
              <div
                key={group.id}
                className={cn(
                  "flex w-full gap-3 sm:gap-4",
                  isUser ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar (only show on the non-user side, or both depending on preference. Usually user doesn't have an avatar in chat interfaces) */}
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center mt-auto shadow-sm",
                  isUser 
                    ? "bg-gray-100 text-gray-500 hidden" // Hide user avatar to look like iMessage
                    : "bg-black text-white shadow-black/10"
                )}>
                  {!isUser && <Bot size={18} />}
                </div>
                
                {/* Message Group */}
                <div className={cn(
                  "flex flex-col gap-1 max-w-[85%] sm:max-w-[75%]",
                  isUser ? "items-end" : "items-start"
                )}>
                  {group.messages.map((msg, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === group.messages.length - 1;
                    
                    return (
                      <div
                        key={msg._id}
                        className={cn(
                          "px-4 sm:px-5 py-2.5 sm:py-3 whitespace-pre-wrap text-[15px] leading-relaxed shadow-sm",
                          isUser 
                            ? "bg-black text-white" 
                            : "bg-gray-100 text-black",
                          // Border radius logic for grouped messages
                          "rounded-2xl",
                          isUser && isFirst && !isLast && "rounded-tr-md",
                          isUser && !isFirst && !isLast && "rounded-r-md",
                          isUser && !isFirst && isLast && "rounded-br-md",
                          !isUser && isFirst && !isLast && "rounded-tl-md",
                          !isUser && !isFirst && !isLast && "rounded-l-md",
                          !isUser && !isFirst && isLast && "rounded-bl-md",
                          // Single message in group
                          isUser && isFirst && isLast && "rounded-br-sm",
                          !isUser && isFirst && isLast && "rounded-bl-sm"
                        )}
                      >
                        {msg.content}
                      </div>
                    );
                  })}
                  
                  {/* Metadata below the last message in the group */}
                  <div className="flex items-center gap-2 mt-1 px-1">
                    <span className="text-[11px] font-medium text-black0">
                      {formatMessageTime(group.lastDate)}
                    </span>
                    
                    {/* Language tag for AI responses */}
                    {!isUser && group.messages[group.messages.length - 1].language && group.messages[group.messages.length - 1].language !== 'unknown' && (
                      <span className="text-[9px] uppercase font-bold tracking-wider text-black bg-gray-100 px-1.5 py-0.5 rounded border border-gray-300">
                        {group.messages[group.messages.length - 1].language}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  );
};

export default ConversationDetail;

