
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isFromCurrentUser: boolean;
}

const MessageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { athleteProfiles } = useData();
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const athlete = athleteProfiles.find(p => p.userId === id);
  const athleteName = athlete?.name || `Atleta ${id?.substring(0, 8)}`;

  useEffect(() => {
    if (!currentUser || !id) return;

    const fetchOrCreateConversation = async () => {
      setLoading(true);
      try {
        // Try to get or create a conversation using the RPC function
        if (currentUser.id) {
          const { data: convId, error: rpcError } = await supabase
            .rpc('get_or_create_conversation', { 
              user1_id: currentUser.id, 
              user2_id: id 
            });
            
          if (rpcError) {
            throw rpcError;
          }
          
          if (convId) {
            setConversationId(convId);
            await fetchMessages(convId);
          }
        }
      } catch (error) {
        console.error('Error fetching/creating conversation:', error);
        toast({
          title: "Erro",
          description: "Não foi possível iniciar a conversa",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchMessages = async (convId: string) => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', convId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        const formattedMessages = data.map(msg => ({
          id: msg.id,
          text: msg.content,
          timestamp: new Date(msg.created_at),
          isFromCurrentUser: msg.sender_id === currentUser.id
        }));

        setMessages(formattedMessages);

        // Mark messages as read
        if (data.some(msg => !msg.read && msg.sender_id !== currentUser.id)) {
          await supabase
            .from('messages')
            .update({ read: true })
            .eq('conversation_id', convId)
            .neq('sender_id', currentUser.id)
            .eq('read', false);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchOrCreateConversation();

    // Set up real-time subscription
    if (conversationId) {
      const channel = supabase
        .channel('messages-channel')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`
          }, 
          (payload) => {
            if (payload.new && currentUser && payload.new.sender_id !== currentUser.id) {
              const newMsg = {
                id: payload.new.id,
                text: payload.new.content,
                timestamp: new Date(payload.new.created_at),
                isFromCurrentUser: false
              };
              setMessages(prevMessages => [...prevMessages, newMsg]);
              
              // Mark as read
              supabase
                .from('messages')
                .update({ read: true })
                .eq('id', payload.new.id);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentUser, id, conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId || !currentUser?.id) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUser.id,
          content: newMessage.trim(),
        });

      if (error) throw error;

      const newMsg = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        timestamp: new Date(),
        isFromCurrentUser: true
      };
      
      setMessages(prevMessages => [...prevMessages, newMsg]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive"
      });
    }
  };

  const handleScheduleMatch = () => {
    const matchMessage = "Gostaria de marcar uma partida com você. Está disponível este final de semana?";
    setNewMessage(matchMessage);
    
    toast({
      title: "Solicitação de partida",
      description: `Envie a mensagem para ${athleteName}`
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/messages">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{athleteName}</h1>
          <p className="text-zinc-400 text-sm">
            {athlete?.location?.city}, {athlete?.location?.country}
          </p>
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 mb-4">
        <CardContent className="p-4">
          <div className="flex justify-end mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleScheduleMatch}
            >
              <Calendar size={16} />
              Agendar Partida
            </Button>
          </div>
          
          <div className="h-[calc(100vh-280px)] overflow-y-auto pb-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.isFromCurrentUser 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isFromCurrentUser 
                        ? 'text-primary-foreground/70' 
                        : 'text-zinc-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Digite uma mensagem..."
                className="bg-zinc-800 border-zinc-700"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
            </div>
            <Button 
              size="icon" 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Send size={18} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default MessageDetail;
