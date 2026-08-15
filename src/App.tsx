import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { VisionDecoder } from './components/VisionDecoder';
import { BarkAudioDecoder } from './components/BarkAudioDecoder';
import { DogVoiceSynthesizer } from './components/DogVoiceSynthesizer';
import { CanineWhistleStudio } from './components/CanineWhistleStudio';
import { SnowflakeWarehouseStudio } from './components/SnowflakeWarehouseStudio';
import { SolanaPassportStudio } from './components/SolanaPassportStudio';
import { WhispererChatCoach } from './components/WhispererChatCoach';
import { DogProfileModal } from './components/DogProfileModal';
import { TabType, DogProfile, SnowflakeTelemetryRecord } from './types';
import { INITIAL_TELEMETRY_LOGS } from './data/snowflakeData';
import { Sparkles, Check, Coins } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('vision');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [telemetryLogs, setTelemetryLogs] = useState<SnowflakeTelemetryRecord[]>(INITIAL_TELEMETRY_LOGS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [dogProfile, setDogProfile] = useState<DogProfile>({
    id: 'DOG-772-GOLDEN',
    name: 'Buster',
    breed: 'Golden Retriever',
    ageYears: 3,
    weightLbs: 68,
    temperament: 'High enthusiasm, food-motivated, mild doorbell reactivity',
    voicePersona: 'golden_goof',
    treatsEarned: 140,
    trainingLevel: 'Canine Good Citizen',
    microchipId: '985141002948201',
    solanaAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAwardTreats = (points: number, reason: string) => {
    setDogProfile((prev) => ({
      ...prev,
      treatsEarned: prev.treatsEarned + points
    }));
    showToast(`+${points} Solana TREATS: ${reason}! 🦴`);
  };

  const handleAddTelemetryLog = (record: SnowflakeTelemetryRecord) => {
    setTelemetryLogs((prev) => [record, ...prev]);
    showToast(`Telemetry event ${record.RECORD_ID} streamed to Snowflake DW! ❄️`);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] flex flex-col font-serif selection:bg-[#1A1A1A] selection:text-[#FAF9F6]">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dogProfile={dogProfile}
        setDogProfile={setDogProfile}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Global Notification Toast (Editorial Archival Stamp) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in font-sans">
          <div className="px-4 py-3 bg-[#1A1A1A] text-[#FAF9F6] text-xs shadow-2xl flex items-center gap-3 border border-[#1A1A1A]">
            <Coins className="w-4 h-4 text-amber-300" />
            <span className="font-semibold uppercase tracking-wider">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 font-sans">
        
        {/* Render Tab Views */}
        {activeTab === 'vision' && (
          <VisionDecoder
            dogProfile={dogProfile}
            onSendToSnowflake={handleAddTelemetryLog}
            onAwardSolanaTreats={handleAwardTreats}
            onNavigateToVoice={(text) => {
              setActiveTab('voice');
            }}
          />
        )}

        {activeTab === 'audio' && (
          <BarkAudioDecoder
            dogProfile={dogProfile}
            onSendToSnowflake={handleAddTelemetryLog}
            onAwardSolanaTreats={handleAwardTreats}
          />
        )}

        {activeTab === 'voice' && (
          <DogVoiceSynthesizer
            dogProfile={dogProfile}
            setDogProfile={setDogProfile}
            onAwardSolanaTreats={handleAwardTreats}
          />
        )}

        {activeTab === 'whistle' && (
          <CanineWhistleStudio
            dogProfile={dogProfile}
            onAwardSolanaTreats={handleAwardTreats}
          />
        )}

        {activeTab === 'snowflake' && (
          <SnowflakeWarehouseStudio
            telemetryLogs={telemetryLogs}
            onAddTelemetryLog={handleAddTelemetryLog}
          />
        )}

        {activeTab === 'solana' && (
          <SolanaPassportStudio
            dogProfile={dogProfile}
            setDogProfile={setDogProfile}
            onAwardTreats={handleAwardTreats}
          />
        )}

        {activeTab === 'coach' && (
          <WhispererChatCoach
            dogProfile={dogProfile}
            onAwardSolanaTreats={handleAwardTreats}
          />
        )}

      </main>

      {/* Editorial Ruled Footer */}
      <footer className="mt-auto border-t border-[#1A1A1A] bg-[#FAF9F6] py-6 text-xs text-[#1A1A1A]/70 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] uppercase tracking-widest font-bold">
            <span>Project: Whisper Protocol</span>
            <span>•</span>
            <span>Gemini 3.7 Vision & Audio</span>
            <span>•</span>
            <span>ElevenLabs Neural Voice</span>
            <span>•</span>
            <span>Snowflake DW</span>
            <span>•</span>
            <span>Solana Web3</span>
          </div>
          <div className="text-[10px] uppercase tracking-widest font-bold opacity-60">
            Auth: Verified_Canine_Operator_77
          </div>
        </div>
      </footer>

      {/* Edit Profile Modal */}
      <DogProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        dogProfile={dogProfile}
        setDogProfile={setDogProfile}
      />

    </div>
  );
}
