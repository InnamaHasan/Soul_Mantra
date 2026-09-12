import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { chatService } from '../services/mockApi';
import { ChatMessage } from '../types';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const suggestedStarters = [
  "I'm feeling a bit anxious today.",
  "Can you help me reframe a negative thought?",
  "I just want to vent for a minute."
];

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'ai',
      content: "Hi there. I'm Dawn, your AI companion. I'm here to listen, support you, and help you reflect. How are you feeling right now?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const aiResponse = await chatService.sendMessage(text);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      // Handle error gracefully
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        content: "I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" /> Dawn Companion
        </h1>
        <p className="text-muted-foreground">A safe space to explore your thoughts.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-primary/20 shadow-sm relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/50 to-primary/10" />
        
        <ScrollArea className="flex-1 p-4 overflow-y-auto" ref={scrollRef as any}>
          <div className="space-y-6 pb-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <Avatar className="h-8 w-8 mt-1 shrink-0">
                  {msg.role === 'ai' ? (
                    <div className="bg-primary/20 h-full w-full flex items-center justify-center text-primary">
                      <Bot size={16} />
                    </div>
                  ) : (
                    <div className="bg-secondary h-full w-full flex items-center justify-center text-foreground">
                      <User size={16} />
                    </div>
                  )}
                </Avatar>
                
                <div className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`px-4 py-3 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                        : 'bg-muted border rounded-tl-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <Avatar className="h-8 w-8 shrink-0">
                  <div className="bg-primary/20 h-full w-full flex items-center justify-center text-primary">
                    <Bot size={16} />
                  </div>
                </Avatar>
                <div className="px-4 py-3 rounded-2xl bg-muted border rounded-tl-sm flex items-center gap-1 h-11">
                  <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 bg-background border-t mt-auto">
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestedStarters.map((starter, idx) => (
                <Button 
                  key={idx} 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full text-xs text-muted-foreground hover:text-primary"
                  onClick={() => handleSend(starter)}
                >
                  {starter}
                </Button>
              ))}
            </div>
          )}
          
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="flex items-center gap-2"
          >
            <Input 
              placeholder="Type your message..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="rounded-full bg-muted/50 border-transparent focus-visible:bg-background h-12 px-6"
              disabled={isTyping}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="h-12 w-12 rounded-full shrink-0"
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          
          <p className="text-[10px] text-center text-muted-foreground mt-3">
            Dawn is an AI. It can make mistakes and is not a substitute for professional help.
          </p>
        </div>
      </Card>
    </div>
  );
}
