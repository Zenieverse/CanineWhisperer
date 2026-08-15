import React from 'react';
import { 
  Sparkles, 
  Eye, 
  Mic, 
  Volume2, 
  Radio, 
  Database, 
  Coins, 
  MessageSquareHeart,
  ShieldCheck,
  Dog,
  SlidersHorizontal
} from 'lucide-react';
import { TabType, DogProfile } from '../types';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  dogProfile: DogProfile;
  setDogProfile: React.Dispatch<React.SetStateAction<DogProfile>>;
  onOpenProfileModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  dogProfile,
  onOpenProfileModal
}) => {
  const tabs = [
    { id: 'vision' as TabType, label: 'Vision Decoder', icon: Eye, tech: 'Gemini AI', index: '01' },
    { id: 'audio' as TabType, label: 'Bark Acoustic', icon: Mic, tech: 'Audio Spectrogram', index: '02' },
    { id: 'voice' as TabType, label: 'Voice Synthesis', icon: Volume2, tech: 'ElevenLabs', index: '03' },
    { id: 'whistle' as TabType, label: 'Acoustic Whistle', icon: Radio, tech: 'Ultrasonic', index: '04' },
    { id: 'snowflake' as TabType, label: 'Snowflake DW', icon: Database, tech: 'Cortex ML', index: '05' },
    { id: 'solana' as TabType, label: 'Solana Passport', icon: Coins, tech: 'cNFT Web3', index: '06' },
    { id: 'coach' as TabType, label: 'Whisperer Coach', icon: MessageSquareHeart, tech: 'Gemini 3.7', index: '07' },
  ];

  return (
    <header className="bg-[#FAF9F6] border-b border-[#1A1A1A] text-[#1A1A1A] sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Row with System Meta & Title */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between pt-5 pb-4 border-b border-[#1A1A1A]/20 gap-4">
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 border border-[#1A1A1A] bg-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
              🐕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.22em] font-sans font-bold text-[#1A1A1A]/60">
                  Canine Ethology Intelligence System
                </span>
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 border border-[#1A1A1A] bg-white font-bold">
                  v.04
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-light italic font-serif text-[#1A1A1A] tracking-tight mt-0.5">
                Canine Interpreter <span className="font-sans not-italic font-bold text-sm tracking-normal ml-1.5 px-2 py-0.5 bg-[#1A1A1A] text-[#FAF9F6]">CORE</span>
              </h1>
            </div>
          </div>

          {/* Network & Infrastructure Live Feeds */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[10px] uppercase tracking-widest font-sans font-bold text-[#1A1A1A]/70">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Network: <strong className="text-[#1A1A1A]">Solana Devnet</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>Storage: <strong className="text-[#1A1A1A]">Snowflake DW</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              <span>Voice: <strong className="text-[#1A1A1A]">ElevenLabs Neural</strong></span>
            </div>

            {/* Profile Trigger */}
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 px-3 py-1 border border-[#1A1A1A] bg-white hover:bg-[#F0EFEA] text-[#1A1A1A] transition-all cursor-pointer shadow-xs"
              title="Edit Subject Dog Profile"
            >
              <span className="text-[11px]">🐾</span>
              <span className="font-bold">{dogProfile.name}</span>
              <span className="opacity-40 font-mono text-[9px]">({dogProfile.breed})</span>
              <SlidersHorizontal className="w-3 h-3 ml-1 opacity-60" />
            </button>
          </div>

        </div>

        {/* Tab Navigation Menu (Editorial Index Bar) */}
        <nav className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto py-2.5 scrollbar-none font-sans">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1A1A1A] text-[#FAF9F6] shadow-sm'
                    : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/5 border border-transparent hover:border-[#1A1A1A]/30'
                }`}
              >
                <span className="text-[10px] font-mono opacity-60">{tab.index}</span>
                <span>{tab.label}</span>
                <span className={`text-[9px] px-1 py-0.2 font-mono ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-[#1A1A1A]/5 text-[#1A1A1A]/60'
                }`}>
                  {tab.tech}
                </span>
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};

