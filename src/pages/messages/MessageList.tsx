
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Conversation {
  id: string;
  userId: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

const MessageList = () => {
  const { athleteProfiles } = useData();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        // Get all conversations where the current user is a participant
        const { data: participations, error: participationsError } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', currentUser.id);

        if (participationsError) throw participationsError;

        if (!participations || participations.length === 0) {
          setConversations([]);
          setIsLoading(false);
          return;
        }

        const conversationIds = participations.map(p => p.conversation_id);

        // For each conversation, get the other participants
        const conversationData: Conversation[] = [];

        for (const conversationId of conversationIds) {
          // Get other participants
          const { data: otherParticipants, error: participantsError } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', conversationId)
            .neq('user_id', currentUser.id);

          if (participantsError) continue;

          if (!otherParticipants || otherParticipants.length === 0) continue;

          const otherUserId = otherParticipants[0].user_id;

          // Get other user profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', otherUserId)
            .maybeSingle();

          if (profileError || !profileData) continue;

          // Get last message
          const { data: messages, error: messagesError } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: false })
            .limit(1);

          if (messagesError || !messages || messages.length === 0) continue;

          // Count unread messages
          const { data: unreadCount, error: unreadError } = await supabase
            .from('messages')
            .select('id', { count: 'exact' })
            .eq('conversation_id', conversationId)
            .eq('read', false)
            .neq('sender_id', currentUser.id);

          if (unreadError) continue;

          conversationData.push({
            id: conversationId,
            userId: otherUserId,
            name: profileData.name || `User ${otherUserId.substring(0, 8)}`,
            lastMessage: messages[0].content,
            timestamp: new Date(messages[0].created_at),
            unread: unreadCount ? unreadCount > 0 : false
          });
        }

        setConversations(conversationData);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [currentUser]);

  const filteredConversations = conversations.filter(
    convo => convo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mensagens</h1>
        <p className="text-zinc-400">
          Converse com outros jogadores e agende partidas
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
          <Input
            type="text"
            placeholder="Buscar conversas..."
            className="pl-10 bg-zinc-900 border-zinc-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <ConversationCard key={conversation.id} conversation={conversation} />
          ))
        ) : (
          <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
            <MessageCircle className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
            <h3 className="text-xl font-medium mb-2">Sem conversas</h3>
            <p className="text-zinc-400 mb-4">
              Comece a conversar com atletas para ver suas conversas aqui
            </p>
            <Link to="/athletes">
              <Button>Encontrar Atletas</Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

const ConversationCard = ({ conversation }: { conversation: Conversation }) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // If less than 24 hours, show time
    if (diff < 86400000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    // If less than 7 days, show day of week
    else if (diff < 604800000) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    // Otherwise show date
    else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <Link to={`/messages/${conversation.userId}`}>
      <Card className={`bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors ${conversation.unread ? 'border-l-4 border-l-primary' : ''}`}>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-zinc-200">
              <span className="text-md font-semibold">{conversation.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="font-medium">{conversation.name}</h3>
              <p className={`text-sm ${conversation.unread ? 'text-white font-medium' : 'text-zinc-400'}`}>
                {conversation.lastMessage}
              </p>
            </div>
          </div>
          <div className="text-sm text-zinc-500">
            {formatTime(conversation.timestamp)}
            {conversation.unread && <span className="ml-2 w-2 h-2 bg-primary rounded-full inline-block"></span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MessageList;
