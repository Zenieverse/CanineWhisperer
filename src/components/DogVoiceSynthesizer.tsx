import React, { useState } from 'react';
import { 
  Volume2, 
  Sparkles, 
  Play, 
  Square, 
  Mic2, 
  Radio, 
  Dog, 
  Heart, 
  Shield, 
  Flame, 
  Zap,
  CheckCircle2
} from 'lucide-react';
import { VoicePersona, DogProfile } from '../types';
import { VOICE_PERSONAS } from '../data/dogScenarios';
import { speakWithBrowserPersona, stopAllAudio } from '../utils/audioUtils';

interface DogVoiceSynthesizerProps {
  dogProfile: DogProfile;
  setDogProfile: React.Dispatch<React.SetStateAction<DogProfile>>;
  onAwardSolanaTreats?: (points: number, reason: string) => void;
}

export const DogVoiceSynthesizer: React.FC<DogVoiceSynthesizerProps> = ({
  dogProfile,
  setDogProfile,
  onAwardSolanaTreats
}) => {
  const [selectedPersona, setSelectedPersona] = useState<VoicePersona>(
    VOICE_PERSONAS.find((p) => p.id === dogProfile.voicePersona) || VOICE_PERSONAS[0]
  );
  const [customText, setCustomText] = useState<string>(
    `Listen, I don't mean to alarm anyone, but it has been exactly three minutes since my last treat, which according to canine law constitutes an emergency!`
  );
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeAudioUrl, setActiveAudioUrl] = useState<string | null>(null);

  const PRESET_MONOLOGUES = [
    {
      title: '🚨 The Vacuum Cleaner Threat',
      text: 'Warning to all pack members! The loud mechanical beast with the cord has emerged from the closet! Stand back while I bark aggressively from behind the couch!'
    },
    {
      title: '🍖 The 5:00 PM Dinner Crisis',
      text: 'My internal biological clock has officially struck dinner time. Look at my eyes. I am wasting away. Please dispense the kibble with maximum urgency.'
    },
    {
      title: '🐿️ The Squirrel Conspiracy',
      text: 'The bushy-tailed trespasser is currently on the fence staring directly into my soul. If you let me outside for 4 seconds, I will solve this international incident.'
    },
    {
      title: '🧘 Trainer Calming De-escalation',
      text: 'Breathe in slowly. Drop your shoulders. Your dog mirrors your heart rate. Claim your space with calm, quiet stillness.'
    }
  ];

  const handlePersonaSelect = (persona: VoicePersona) => {
    setSelectedPersona(persona);
    setDogProfile((prev) => ({
      ...prev,
      voicePersona: persona.id
    }));
  };

  const handleSpeak = async (textToSpeak?: string) => {
    const text = textToSpeak || customText;
    if (!text.trim()) return;

    stopAllAudio();
    setIsSpeaking(true);

    try {
      const response = await fetch('/api/elevenlabs/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceId: selectedPersona.elevenlabsVoiceId,
          personaId: selectedPersona.id
        })
      });

      const data = await response.json();

      if (data.audioBase64) {
        const audio = new Audio(data.audioBase64);
        audio.onended = () => {
          setIsSpeaking(false);
          setActiveAudioUrl(null);
        };
        audio.play();
        setActiveAudioUrl(data.audioBase64);
      } else {
        // Fallback TTS
        speakWithBrowserPersona(text, selectedPersona.id, () => {
          setIsSpeaking(false);
        });
      }

      if (onAwardSolanaTreats) {
        onAwardSolanaTreats(5, 'Canine Voice Synthesis');
      }
    } catch (err) {
      console.error('TTS error:', err);
      speakWithBrowserPersona(text, selectedPersona.id, () => {
        setIsSpeaking(false);
      });
    }
  };

  const handleStop = () => {
    stopAllAudio();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setActiveAudioUrl(null);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-white border border-[#1A1A1A] p-6 shadow-sm relative">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest font-mono bg-[#1A1A1A] text-[#FAF9F6]">
              ElevenLabs Neural Voice AI
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest font-mono border border-[#1A1A1A] bg-[#FAF9F6] text-[#1A1A1A]">
              Canine Inner Voice Personas
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light italic font-serif text-[#1A1A1A] tracking-tight">
            Canine Voice Synthesis & Whisperer Audio Studio
          </h2>
          <p className="text-xs text-[#1A1A1A]/70 max-w-2xl mt-1 leading-relaxed">
            Give your dog their own distinctive voice. Powered by ElevenLabs expressive neural TTS and custom pitch tuning. Select an ethological personality persona or synthesize calm whisperer trainer de-escalation audio.
          </p>
        </div>
      </div>

      {/* Personas Selection Grid */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest flex items-center gap-2">
          <Dog className="w-4 h-4 text-[#1A1A1A]" />
          Select Subject Inner Voice Persona
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {VOICE_PERSONAS.map((persona) => {
            const isSelected = selectedPersona.id === persona.id;
            return (
              <button
                key={persona.id}
                onClick={() => handlePersonaSelect(persona)}
                className={`p-4 border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#FAF9F6] border-[#1A1A1A] shadow-xs ring-1 ring-[#1A1A1A]'
                    : 'bg-white border-[#1A1A1A]/30 hover:border-[#1A1A1A] hover:bg-[#FAF9F6]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{persona.avatar}</span>
                    <div>
                      <h4 className="font-bold text-sm text-[#1A1A1A]">{persona.name}</h4>
                      <span className="text-[9px] px-1.5 py-0.2 font-mono uppercase font-bold bg-[#1A1A1A] text-white">
                        {persona.tag}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-[#1A1A1A] shrink-0" />
                  )}
                </div>
                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed mt-1">
                  {persona.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Speech Generator & Preset Monologues */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Monologue Text Area & Audio Controls (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-[#1A1A1A] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest flex items-center gap-2">
              <Mic2 className="w-3.5 h-3.5 text-[#1A1A1A]" />
              Canine Script to Synthesize
            </span>
            <span className="text-xs text-[#1A1A1A] font-medium font-sans">
              Speaking as: <strong className="underline">{selectedPersona.name}</strong>
            </span>
          </div>

          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            rows={4}
            placeholder="Type what your dog wants to say..."
            className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/30 focus:border-[#1A1A1A] p-4 text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none font-serif italic leading-relaxed"
          />

          {/* Action Play / Stop Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3">
              {isSpeaking ? (
                <button
                  onClick={handleStop}
                  className="py-2.5 px-5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Square className="w-4 h-4" />
                  Stop Voice Playback
                </button>
              ) : (
                <button
                  onClick={() => handleSpeak()}
                  className="py-2.5 px-5 bg-[#1A1A1A] hover:bg-black text-[#FAF9F6] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Synthesize Monologue (ElevenLabs)
                </button>
              )}
            </div>

            {isSpeaking && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A] text-white text-[10px] uppercase font-mono tracking-wider">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Neural Audio Synthesizing
              </div>
            )}
          </div>
        </div>

        {/* Right: Instant Monologue Library (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-[#1A1A1A] p-6 shadow-sm space-y-4">
          <h3 className="text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#1A1A1A]" />
            Archival Monologue Library
          </h3>
          <p className="text-xs text-[#1A1A1A]/60">
            Click any canine monologue to immediately load and synthesize:
          </p>

          <div className="space-y-2.5">
            {PRESET_MONOLOGUES.map((preset, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setCustomText(preset.text);
                  handleSpeak(preset.text);
                }}
                className="p-3.5 bg-[#FAF9F6] hover:bg-[#F2EFE8] border border-[#1A1A1A]/20 hover:border-[#1A1A1A] cursor-pointer transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#1A1A1A]">
                    {preset.title}
                  </span>
                  <Play className="w-3.5 h-3.5 text-[#1A1A1A]/40 group-hover:text-[#1A1A1A] transition-colors" />
                </div>
                <p className="text-xs text-[#1A1A1A]/70 line-clamp-2 italic font-serif">
                  "{preset.text}"
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
