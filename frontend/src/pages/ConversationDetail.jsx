import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { format, parseISO, differenceInMinutes, isSameDay } from 'date-fns';
import { cn } from '../lib/utils';
import { Skeleton } from '../components/ui/Skeleton';
import { ChevronLeft } from 'lucide-react';

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
        setError('Failed to load conversation details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [conversationId]);

  useEffect(() => {
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

  const groupedMessages = [];
  let currentGroup = null;

  messages.forEach((msg, index) => {
    const msgDate = parseISO(msg.createdAt);
    
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

    if (index === messages.length - 1) {
      groupedMessages.push(currentGroup);
    }
  });

  if (error) {
    return (
      <div className="text-red-500 font-medium max-w-2xl mx-auto mt-12">
        {error}
      </div>
    );
  }

  const displayName = conversation?.username || conversation?.instagramUserId;
  const initial = displayName?.charAt(0).toUpperCase() || '?';

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-6rem)] lg:h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="pb-4 sticky top-16 lg:top-32 bg-white/80 backdrop-blur-xl z-20 -mx-6 px-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/conversations')}
            className="flex items-center text-apple-blue hover:opacity-70 transition-opacity font-medium text-[17px] -ml-2"
          >
            <ChevronLeft size={24} />
            Back
          </button>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center mt-2">
            <Skeleton className="w-16 h-16 rounded-full mb-2" />
            <Skeleton className="h-6 w-32" />
          </div>
        ) : (
          <div className="flex flex-col items-center mt-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center text-apple-text font-bold text-2xl mb-2 shadow-sm">
              {initial}
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-apple-text mb-0.5">
              {displayName}
            </h1>
            <p className="text-[13px] text-apple-meta capitalize font-medium">
              {conversation?.platform}
            </p>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto py-8 space-y-6 scroll-smooth px-2">
        {loading ? (
          <div className="space-y-6">
            <div className="flex flex-row-reverse">
              <Skeleton className="h-10 w-48 bg-apple-blue/20 rounded-2xl rounded-br-sm" />
            </div>
            <div className="flex">
              <Skeleton className="h-16 w-64 bg-apple-surface rounded-2xl rounded-bl-sm" />
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-apple-meta text-lg font-medium pt-20">
            No messages here.
          </div>
        ) : (
          groupedMessages.map((group) => {
            const isUser = group.role === 'user';
            
            return (
              <div key={group.id} className="flex flex-col w-full">
                {/* Timestamp above group if it's been a while */}
                <div className="text-center text-[11px] font-bold tracking-wide text-apple-meta mb-3 mt-4">
                  {formatMessageTime(group.firstDate)}
                </div>
                
                <div className={cn(
                  "flex flex-col gap-[2px] max-w-[80%] sm:max-w-[70%]",
                  isUser ? "self-start" : "self-end items-end"
                )}>
                  {group.messages.map((msg, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === group.messages.length - 1;
                    
                    return (
                      <div
                        key={msg._id}
                        className={cn(
                          "px-4 py-2.5 text-[15px] leading-relaxed",
                          isUser 
                            ? "bg-[#E9E9EB] text-black" 
                            : "bg-[#007AFF] text-white", // Apple Blue
                          
                          "rounded-2xl",
                          // User (Left side) rounding logic
                          isUser && isFirst && !isLast && "rounded-bl-md",
                          isUser && !isFirst && !isLast && "rounded-l-md",
                          isUser && !isFirst && isLast && "rounded-tl-md",
                          
                          // Assistant (Right side) rounding logic
                          !isUser && isFirst && !isLast && "rounded-br-md",
                          !isUser && !isFirst && !isLast && "rounded-r-md",
                          !isUser && !isFirst && isLast && "rounded-tr-md"
                        )}
                      >
                        {msg.content}
                      </div>
                    );
                  })}
                  
                  {!isUser && group.messages[group.messages.length - 1].language && group.messages[group.messages.length - 1].language !== 'unknown' && (
                    <div className="text-[11px] text-apple-meta mt-1 mr-1 font-medium">
                      Translated: {group.messages[group.messages.length - 1].language}
                    </div>
                  )}
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
