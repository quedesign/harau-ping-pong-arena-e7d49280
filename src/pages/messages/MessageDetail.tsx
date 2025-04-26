
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
import { toast } from '@/components/ui/sonner';

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
  
  const athlete = athleteProfiles.find(p => p.userId === id);
  const athleteName = athlete ? `Player ${athlete.userId}` : 'Unknown Player';

  useEffect(() => {
    const sampleMessages: Message[] = [
      {
        id: '1',
        text: `Hello! Would you like to schedule a match?`,
        timestamp: new Date(Date.now() - 60000 * 35),
        isFromCurrentUser: false,
      },
      {
        id: '2',
        text: `Sure, I'm available this weekend.`,
        timestamp: new Date(Date.now() - 60000 * 30),
        isFromCurrentUser: true,
      },
      {
        id: '3',
        text: `Great! How about Saturday afternoon?`,
        timestamp: new Date(Date.now() - 60000 * 10),
        isFromCurrentUser: false,
      }
    ];
    
    setMessages(sampleMessages);
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      timestamp: new Date(),
      isFromCurrentUser: true,
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    setTimeout(() => {
      if (Math.random() > 0.7) {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "That sounds good! Looking forward to our match.",
          timestamp: new Date(),
          isFromCurrentUser: false,
        };
        setMessages(prev => [...prev, responseMessage]);
      }
    }, 3000);
  };

  const handleScheduleMatch = () => {
    const matchMessage: Message = {
      id: Date.now().toString(),
      text: "I'd like to schedule a match with you. Are you available this weekend?",
      timestamp: new Date(),
      isFromCurrentUser: true,
    };
    
    setMessages([...messages, matchMessage]);
    
    toast.success(`Match request sent to ${athleteName}`);
  };

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
              Schedule Match
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
                placeholder="Type a message..."
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
