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

const MessageList = () => {
  const { athleteProfiles } = useData();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  // For demo purposes, let's create mock conversations with the first 3 athletes
  const conversations = athleteProfiles.slice(0, 3).map(profile => ({
    userId: profile.userId,
    name: `Player ${profile.userId}`,
    lastMessage: "Let's schedule a match soon!",
    timestamp: new Date(Date.now() - Math.random() * 86400000 * 3), // Random time within last 3 days
    unread: Math.random() > 0.7, // 30% chance of being unread
  }));

  const filteredConversations = conversations.filter(
    convo => convo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('messages.title')}</h1>
        <p className="text-zinc-400">
          Chat with other players and schedule matches
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
          <Input
            type="text"
            placeholder="Search conversations..."
            className="pl-10 bg-zinc-900 border-zinc-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <ConversationCard key={conversation.userId} conversation={conversation} />
          ))
        ) : (
          <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
            <MessageCircle className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
            <h3 className="text-xl font-medium mb-2">{t('messages.noConversations')}</h3>
            <p className="text-zinc-400 mb-4">
              Start chatting with athletes to see conversations here
            </p>
            <Link to="/athletes">
              <Button>{t('messages.findAthletes')}</Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

interface Conversation {
  userId: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

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
