import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { format, parseISO, differenceInMinutes, isSameDay } from 'date-fns';
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

  const formatHeaderDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy');
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
      <div className="text-clay-500 py-2 border-b border-clay-500/30 max-w-3xl">
        {error}
      </div>
    );
  }

  const displayName = conversation?.username || conversation?.instagramUserId;

  return (
    <div className="max-w-3xl h-[calc(100vh-5rem)] lg:h-[calc(100vh-4rem)] flex flex-col animate-in fade-in duration-700">
      
      {/* Editorial Header */}
      <div className="pb-8 border-b border-stone-800 sticky top-0 bg-stone-900 z-10 pt-4">
        <button
          onClick={() => navigate('/conversations')}
          className="text-stone-500 hover:text-stone-100 uppercase tracking-widest text-xs font-medium transition-colors mb-6"
        >
          &larr; Back to List
        </button>
        
        {loading ? (
          <div className="space-y-4 mt-2">
            <Skeleton className="h-10 w-48 bg-stone-800/50" />
            <Skeleton className="h-4 w-32 bg-stone-800/50" />
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-serif text-stone-100 tracking-tight mb-2">
              {displayName}
            </h1>
            <div className="flex gap-4 text-stone-500 uppercase tracking-widest text-xs">
              <span>{conversation?.platform}</span>
              <span>•</span>
              <span>Started {formatHeaderDate(conversation?.createdAt)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Transcript Area */}
      <div className="flex-1 overflow-y-auto py-8 space-y-12 scroll-smooth">
        {loading ? (
          <div className="space-y-12">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-stone-800/50" />
              <Skeleton className="h-4 w-full bg-stone-800/50" />
              <Skeleton className="h-4 w-2/3 bg-stone-800/50" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-stone-800/50" />
              <Skeleton className="h-4 w-5/6 bg-stone-800/50" />
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-stone-500 font-serif italic text-lg text-center pt-20">
            Transcript empty.
          </div>
        ) : (
          groupedMessages.map((group) => {
            const isUser = group.role === 'user';
            
            return (
              <div key={group.id} className="group">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className={cn(
                    "font-serif text-lg",
                    isUser ? "text-stone-100" : "text-clay-500"
                  )}>
                    {isUser ? displayName : "Mayank AI"}
                  </span>
                  <span className="text-stone-500 uppercase tracking-widest text-[10px]">
                    {formatMessageTime(group.firstDate)}
                  </span>
                </div>
                
                <div className="pl-0 sm:pl-8 space-y-4">
                  {group.messages.map((msg) => (
                    <div
                      key={msg._id}
                      className="text-stone-300 leading-relaxed whitespace-pre-wrap font-sans text-[15px]"
                    >
                      {msg.content}
                    </div>
                  ))}
                  
                  {/* Language meta for AI */}
                  {!isUser && group.messages[group.messages.length - 1].language && group.messages[group.messages.length - 1].language !== 'unknown' && (
                    <div className="text-[10px] uppercase tracking-widest text-clay-700 font-medium">
                      Translated: {group.messages[group.messages.length - 1].language}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} className="h-8" />
      </div>
    </div>
  );
};

export default ConversationDetail;
