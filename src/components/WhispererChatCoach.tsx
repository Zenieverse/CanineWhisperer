import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Volume2, 
  Dog, 
  User, 
  MessageSquareHeart, 
  HelpCircle, 
  Radio, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { ChatMessage, DogProfile } from '../types';
import { speakWithBrowserPersona } from '../utils/audioUtils';

interface WhispererChatCoachProps {
  dogProfile: DogProfile;
  onAwardSolanaTreats?: (points: number, reason: string) => void;
}

export const WhispererChatCoach: React.FC<WhispererChatCoachProps> = ({
  dogProfile,
  onAwardSolanaTreats
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      sender: 'whisperer',
      text: `Hello! I am your AI Master Dog Whisperer & Canine Behavioral Coach. I see you're working with ${dogProfile.name}, a wonderful ${dogProfile.breed}. What specific behavior, trigger, or training goal would you like to solve together today?`,
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const QUICK_PROMPTS = [
    'How do I stop intense leash reactivity toward other dogs?',
    'Steps to cure acute separation whining when I leave the house',
    'How do I introduce an acoustic whistle for emergency recall?',
    'Resource guarding the food bowl and high-value chew treats',
    'Puppy nipping and high-energy evening zoomies'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/whisperer/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          dogProfile,
          conversationHistory: messages
        })
      });

      const data = await response.json();
      const whispererMsg: ChatMessage = {
        id: `whisperer_${Date.now()}`,
        sender: 'whisperer',
        text: data.reply || 'Remain calm, establish spatial boundaries, and reward the calm state of mind.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, whispererMsg]);

      if (onAwardSolanaTreats) {
        onAwardSolanaTreats(5, 'Canine Coach Consultation');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `whisperer_${Date.now()}`,
          sender: 'whisperer',
          text: `With ${dogProfile.name}, always maintain calm, assertive energy. Before reacting to any trigger, lower your own breathing tempo and claim the space gently. What happened next?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakMessage = async (msg: ChatMessage) => {
    setSpeakingMsgId(msg.id);
    try {
      const res = await fetch('/api/elevenlabs/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: msg.text,
          voiceId: 'yoZ06aMxZJJ28mfd3POQ', // Trainer Elena
          personaId: 'whisperer_calm'
        })
      });
      const data = await res.json();
      if (data.audioBase64) {
        const audio = new Audio(data.audioBase64);
        audio.onended = () => setSpeakingMsgId(null);
        audio.play();
      } else {
        speakWithBrowserPersona(msg.text, 'whisperer_calm', () => setSpeakingMsgId(null));
      }
    } catch {
      speakWithBrowserPersona(msg.text, 'whisperer_calm', () => setSpeakingMsgId(null));
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-white border border-[#1A1A1A] p-6 shadow-sm relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest font-mono bg-[#1A1A1A] text-[#FAF9F6] flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#FAF9F6]" />
                Gemini 3.7 Veterinary Behavioral Coach
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest font-mono border border-[#1A1A1A] bg-[#FAF9F6] text-[#1A1A1A]">
                Cesar Millan Ethology Methodology
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-light italic font-serif text-[#1A1A1A] tracking-tight">
              AI Dog Whisperer Coaching Dialogue
            </h2>
            <p className="text-xs text-[#1A1A1A]/70 max-w-2xl mt-1 leading-relaxed">
              Get instant expert guidance for separation anxiety, resource guarding, reactivity, and crate milestones tailored specifically to {dogProfile.name}'s breed and age.
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Dialogue Stream (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-[#1A1A1A] p-6 shadow-sm flex flex-col h-[580px]">
          
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((msg) => {
              const isWhisperer = msg.sender === 'whisperer';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isWhisperer ? 'justify-start' : 'justify-end'}`}
                >
                  {isWhisperer && (
                    <div className="w-8 h-8 bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-sm shrink-0 mt-1">
                      🐾
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] p-4 text-xs sm:text-sm leading-relaxed space-y-2 border ${
                      isWhisperer
                        ? 'bg-[#FAF9F6] border-[#1A1A1A]/30 text-[#1A1A1A]'
                        : 'bg-[#1A1A1A] border-[#1A1A1A] text-[#FAF9F6]'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    
                    <div className={`flex items-center justify-between text-[10px] font-mono pt-1 ${
                      isWhisperer ? 'text-[#1A1A1A]/50 border-t border-[#1A1A1A]/10' : 'text-[#FAF9F6]/60 border-t border-white/10'
                    }`}>
                      <span>{msg.timestamp}</span>
                      {isWhisperer && (
                        <button
                          onClick={() => handleSpeakMessage(msg)}
                          disabled={speakingMsgId === msg.id}
                          className="hover:text-black flex items-center gap-1 font-bold transition-colors cursor-pointer"
                        >
                          <Volume2 className={`w-3 h-3 ${speakingMsgId === msg.id ? 'animate-pulse text-amber-700' : ''}`} />
                          {speakingMsgId === msg.id ? 'Speaking...' : 'Listen'}
                        </button>
                      )}
                    </div>
                  </div>

                  {!isWhisperer && (
                    <div className="w-8 h-8 bg-[#FAF9F6] border border-[#1A1A1A] text-[#1A1A1A] flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#1A1A1A] text-white flex items-center justify-center text-xs animate-pulse">
                  🐾
                </div>
                <div className="bg-[#FAF9F6] border border-[#1A1A1A]/30 p-3.5 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#1A1A1A] animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-[#1A1A1A] animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-[#1A1A1A] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="pt-4 border-t border-[#1A1A1A]/20 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Ask anything about ${dogProfile.name}'s behavior, barking, or leash manners...`}
              className="flex-1 bg-[#FAF9F6] border border-[#1A1A1A]/30 focus:border-[#1A1A1A] px-4 py-2.5 text-xs sm:text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputText.trim()}
              className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-black text-[#FAF9F6] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </div>

        </div>

        {/* Right: Quick Prompts & Whisperer Core Directives (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#1A1A1A] p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-[#1A1A1A]" />
              Frequently Asked Scenarios
            </h3>

            <div className="space-y-2">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="w-full p-3 bg-[#FAF9F6] hover:bg-white border border-[#1A1A1A]/20 hover:border-[#1A1A1A] text-left text-xs text-[#1A1A1A] transition-all font-medium cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Golden Rules Card */}
          <div className="bg-white border border-[#1A1A1A] p-5 shadow-sm space-y-2.5">
            <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1A1A1A]" />
              The 3 Golden Rules of Canine Whisperers
            </h4>
            <div className="space-y-2 text-xs text-[#1A1A1A]/80 leading-relaxed font-sans">
              <p><strong>1. Exercise, Discipline, Affection:</strong> In that exact order. Never reward hyper-arousal or anxious whining with affection.</p>
              <p><strong>2. Quiet Spatial Pressure:</strong> Control thresholds (doorways, crate gates, food bowls) with your body posture before words.</p>
              <p><strong>3. Calm Assertive Energy:</strong> Dogs do not follow anxious or frustrated pack leaders.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
