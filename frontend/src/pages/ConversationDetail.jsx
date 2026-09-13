import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { format, parseISO } from 'date-fns';
import { Loader2, ArrowLeft, Bot, User } from 'lucide-react';
import clsx from 'clsx';

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
    // Scroll to bottom when messages load
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatMessageTime = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM d, h:mm a');
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <Loader2 size={40} className="text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-6rem)] flex flex-col animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
        <button
          onClick={() => navigate('/conversations')}
          className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-slate-50 hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-3">
            {conversation?.instagramUserId}
            <span className="text-xs font-medium px-2 py-1 bg-slate-800 text-slate-300 rounded-md capitalize">
              {conversation?.platform}
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Started {formatMessageTime(conversation?.createdAt)}
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-4">
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 mt-10">No messages in this conversation.</div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            
            return (
              <div
                key={msg._id}
                className={clsx(
                  "flex w-full",
                  isUser ? "justify-end" : "justify-start"
                )}
              >
                <div className={clsx(
                  "flex max-w-[80%] gap-3",
                  isUser ? "flex-row-reverse" : "flex-row"
                )}>
                  {/* Avatar */}
                  <div className={clsx(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1",
                    isUser ? "bg-indigo-500/20 text-indigo-400" : "bg-emerald-500/20 text-emerald-400"
                  )}>
                    {isUser ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  
                  {/* Message Bubble */}
                  <div className={clsx(
                    "flex flex-col",
                    isUser ? "items-end" : "items-start"
                  )}>
                    <div className={clsx(
                      "px-4 py-3 rounded-2xl whitespace-pre-wrap",
                      isUser 
                        ? "bg-indigo-600 text-white rounded-tr-sm" 
                        : "bg-slate-800 text-slate-100 rounded-tl-sm"
                    )}>
                      {msg.content}
                    </div>
                    
                    {/* Metadata below bubble */}
                    <div className="flex items-center gap-2 mt-1 px-1">
                      <span className="text-xs text-slate-500">
                        {formatMessageTime(msg.createdAt)}
                      </span>
                      {!isUser && msg.language && msg.language !== 'unknown' && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 bg-slate-800/50 px-1.5 py-0.5 rounded">
                          {msg.language}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ConversationDetail;
