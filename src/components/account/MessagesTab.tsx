import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { toast } from 'sonner';
import { Loader2, Send, MessageCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';

export function MessagesTab() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedThread, setSelectedThread] = useState<string | null>(searchParams.get('id'));
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id && id !== selectedThread) {
      setSelectedThread(id);
    }
  }, [searchParams]);

  // Update URL when selecting a thread
  const handleSelectThread = (id: string | null) => {
    setSelectedThread(id);
    if (id) {
      router.push(`/account?tab=messages&id=${id}`);
    } else {
      router.push(`/account?tab=messages`);
    }
  };

  const { data: messagesData, isLoading, refetch } = useQuery({
    queryKey: ['my-messages'],
    queryFn: async () => {
      const res = await axios.get('/contact/my-messages');
      return res.data.data;
    },
    refetchInterval: selectedThread ? false : 15000,
  });

  const { data: threadData, isLoading: threadLoading, refetch: refetchThread } = useQuery({
    queryKey: ['message-thread', selectedThread],
    queryFn: async () => {
      if (!selectedThread) return null;
      // Mark as read when fetching thread
      try {
        await axios.patch(`/contact/${selectedThread}/read`);
      } catch (err) {
        // ignore
      }
      const res = await axios.get(`/contact/${selectedThread}`);
      return res.data.data;
    },
    enabled: !!selectedThread,
    refetchInterval: selectedThread ? 5000 : false,
  });

  const replyMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(`/contact/${selectedThread}/reply`, { message: replyText });
      return res.data;
    },
    onSuccess: () => {
      setReplyText('');
      refetchThread();
      refetch();
    },
    onError: () => {
      toast.error('Failed to send reply');
    }
  });

  const handleSend = () => {
    if (!replyText.trim()) return;
    replyMutation.mutate();
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [threadData]);

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gray-400" /></div>;
  }

  const threads = messagesData || [];

  if (!selectedThread) {
    return (
      <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm min-h-[500px]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-xl text-gray-900">Support Inbox</h2>
            <p className="text-sm text-gray-500 mt-1">View your conversations with our support team</p>
          </div>
        </div>

        {threads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-[#F5F2F0] rounded-full flex items-center justify-center mb-4">
              <MessageCircle size={28} className="text-[#B5AFAD]" />
            </div>
            <p className="text-[#7A7371] mb-4">You have no support tickets yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {threads.map((thread: { id: string; subject: string; message: string; created_at: string; status: string; _count: { replies: number } }) => (
              <div 
                key={thread.id} 
                onClick={() => handleSelectThread(thread.id)}
                className="group border border-gray-100 rounded-2xl p-5 hover:border-[#BC8477]/30 hover:bg-orange-50/30 transition-all cursor-pointer flex gap-4 items-start"
              >
                <div className="w-10 h-10 bg-[#F5F2F0] rounded-full flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-[#BC8477]">
                  <MessageCircle size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1">
                      {thread.subject || 'Support Ticket'}
                    </h3>
                    <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap ml-4">
                      {new Date(thread.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-1 mb-3">{thread.message}</p>
                  
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                      thread.status === 'OPEN' ? "bg-amber-100 text-amber-700" :
                      thread.status === 'PENDING' ? "bg-blue-100 text-blue-700" :
                      thread.status === 'RESOLVED' ? "bg-green-100 text-green-700" :
                      "bg-gray-100 text-gray-600"
                    )}>
                      {thread.status}
                    </span>
                    
                    {thread._count?.replies > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {thread._count.replies} new
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Conversation View
  if (threadLoading && !threadData) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-sm flex flex-col h-[650px]">
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-4 bg-[#F9FAFB]">
        <button 
          onClick={() => handleSelectThread(null)}
          className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="font-bold text-gray-900 text-lg">{threadData?.subject || 'Support Ticket'}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block",
              threadData?.status === 'OPEN' ? "bg-amber-100 text-amber-700" :
              threadData?.status === 'PENDING' ? "bg-blue-100 text-blue-700" :
              threadData?.status === 'RESOLVED' ? "bg-green-100 text-green-700" :
              "bg-gray-100 text-gray-600"
            )}>
              {threadData?.status}
            </span>
            <span className="text-xs text-gray-500">Ticket #{threadData?.id.split('-')[0].toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {/* Original Message */}
        <div className="flex gap-4">
          <div className="w-8 h-8 bg-[#BC8477] rounded-full flex items-center justify-center text-white shrink-0 text-xs font-bold uppercase">
            {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
          </div>
          <div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-5 py-3.5 shadow-sm">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{threadData?.message}</p>
            </div>
            <p className="text-[10px] text-gray-400 mt-1 ml-1 font-medium">{new Date(threadData?.created_at).toLocaleString()}</p>
          </div>
        </div>

        {/* Replies */}
        {threadData?.replies?.map((reply: { id: string; message: string; created_at: string; sender?: { role: string } }) => {
          const isAdmin = reply.sender?.role === 'ADMIN';
          return (
            <div key={reply.id} className={cn("flex gap-4", isAdmin ? "flex-row-reverse" : "")}>
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 text-xs font-bold uppercase", 
                isAdmin ? "bg-gray-900" : "bg-[#BC8477]"
              )}>
                {isAdmin ? 'V' : `${user?.first_name?.charAt(0)}${user?.last_name?.charAt(0)}`}
              </div>
              <div className={cn("flex flex-col", isAdmin ? "items-end" : "items-start")}>
                <div className={cn(
                  "px-5 py-3.5 shadow-sm max-w-[85%]",
                  isAdmin 
                    ? "bg-gray-900 text-white rounded-2xl rounded-tr-none" 
                    : "bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-tl-none"
                )}>
                  <p className="text-sm whitespace-pre-wrap">{reply.message}</p>
                </div>
                <p className={cn("text-[10px] text-gray-400 mt-1 font-medium", isAdmin ? "mr-1" : "ml-1")}>
                  {isAdmin ? 'Velora Support' : 'You'} • {new Date(reply.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Input */}
      {threadData?.status !== 'CLOSED' && (
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="relative flex items-center">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply..."
              className="w-full bg-[#F3F4F6] border-transparent focus:bg-white focus:border-[#BC8477] focus:ring-4 focus:ring-[#BC8477]/10 rounded-2xl pl-4 pr-14 py-3.5 text-sm resize-none h-[52px] min-h-[52px] max-h-32 transition-all outline-none scrollbar-hide"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              onClick={handleSend}
              disabled={replyMutation.isPending || !replyText.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-gray-900 text-white rounded-xl hover:bg-[#BC8477] transition-colors disabled:opacity-50 disabled:hover:bg-gray-900"
            >
              {replyMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      )}
      
      {threadData?.status === 'CLOSED' && (
        <div className="p-6 border-t border-gray-100 bg-gray-50 text-center">
          <p className="text-sm text-gray-500 font-medium">This ticket has been closed. If you need further assistance, please open a new ticket.</p>
        </div>
      )}
    </div>
  );
}
