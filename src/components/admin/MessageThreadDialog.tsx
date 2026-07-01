import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { contactService } from '@/services/contact.service';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function MessageThreadDialog({ msg, refreshData }: { msg: { id: string; subject: string; first_name: string; last_name: string; email: string; is_read: boolean; message: string; created_at: string }; refreshData: () => void }) {
  const [open, setOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: threadData, isLoading, refetch } = useQuery({
    queryKey: ['admin-message-thread', msg.id],
    queryFn: async () => {
      const res = await contactService.getOne(msg.id);
      return res.data;
    },
    enabled: open,
    refetchInterval: open ? 5000 : false
  });

  const replyMutation = useMutation({
    mutationFn: async () => {
      return await contactService.reply(msg.id, replyText);
    },
    onSuccess: () => {
      setReplyText('');
      refetch();
      refreshData();
    },
    onError: () => {
      toast.error('Failed to send reply');
    }
  });

  const statusMutation = useMutation({
    mutationFn: async (status: string) => {
      return await contactService.updateStatus(msg.id, status);
    },
    onSuccess: () => {
      toast.success('Status updated');
      refetch();
      refreshData();
    }
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && !msg.is_read) {
      contactService.markAsRead(msg.id).then(() => refreshData());
    }
  };

  const handleSend = () => {
    if (!replyText.trim()) return;
    replyMutation.mutate();
  };

  useEffect(() => {
    if (messagesEndRef.current && open) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [threadData, open]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col p-0 overflow-hidden bg-gray-50 border-none rounded-3xl">
        <DialogHeader className="px-6 py-4 bg-white border-b border-gray-100 flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-lg font-bold text-gray-900">
              {msg.subject || 'Support Ticket'}
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              From: {msg.first_name} {msg.last_name} &lt;{msg.email}&gt;
            </p>
          </div>
          <div className="flex gap-2 mr-6 mt-0" style={{ marginTop: 0 }}>
            {['OPEN', 'PENDING', 'RESOLVED', 'CLOSED'].map((status) => (
              <button
                key={status}
                onClick={() => statusMutation.mutate(status)}
                disabled={statusMutation.isPending || threadData?.status === status}
                className={cn(
                  "text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider transition-colors border",
                  threadData?.status === status 
                    ? "bg-gray-900 text-white border-gray-900" 
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-900 hover:text-gray-900"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gray-400" /></div>
          ) : (
            <>
              {/* Original Message */}
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-[#BC8477] rounded-full flex items-center justify-center text-white shrink-0 text-xs font-bold uppercase">
                  {msg.first_name.charAt(0)}{msg.last_name.charAt(0)}
                </div>
                <div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-5 py-3.5 shadow-sm">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 ml-1 font-medium">{new Date(msg.created_at).toLocaleString()}</p>
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
                      {isAdmin ? 'V' : `${msg.first_name.charAt(0)}${msg.last_name.charAt(0)}`}
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
                        {isAdmin ? 'Velora Support (You)' : `${msg.first_name}`} • {new Date(reply.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {threadData?.status !== 'CLOSED' ? (
          <div className="p-4 bg-white border-t border-gray-100 mt-auto shrink-0">
            <div className="relative flex items-center">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply to the user..."
                className="w-full bg-[#F3F4F6] border-transparent focus:bg-white focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10 rounded-2xl pl-4 pr-14 py-3.5 text-sm resize-none h-[52px] min-h-[52px] max-h-32 transition-all outline-none scrollbar-hide"
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
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:hover:bg-gray-900"
              >
                {replyMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 border-t border-gray-100 bg-gray-50 text-center shrink-0">
            <p className="text-sm text-gray-500 font-medium">This ticket is closed. Reopen it to send a reply.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
