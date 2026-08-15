import React, { useState } from 'react';
import { 
  Radio, 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  Heart, 
  Sparkles, 
  Shield, 
  Bell, 
  AlertCircle,
  Sliders
} from 'lucide-react';
import { 
  startTone, 
  playWhistleBurst, 
  startHeartbeat, 
  stopAllAudio 
} from '../utils/audioUtils';
import { DogProfile } from '../types';

interface CanineWhistleStudioProps {
  dogProfile: DogProfile;
  onAwardSolanaTreats?: (points: number, reason: string) => void;
}

export const CanineWhistleStudio: React.FC<CanineWhistleStudioProps> = ({
  dogProfile,
  onAwardSolanaTreats
}) => {
  const [frequency, setFrequency] = useState<number>(16500);
  const [volume, setVolume] = useState<number>(0.3);
  const [isPlayingContinuous, setIsPlayingContinuous] = useState<boolean>(false);
  const [activeCalmMode, setActiveCalmMode] = useState<string | null>(null);

  const WHISTLE_PRESETS = [
    {
      id: 'emergency_recall',
      name: 'Emergency Recall (Come Here!)',
      frequency: 16500,
      pulses: 3,
      description: '3 sharp high-pitch ultrasonic pulses to trigger immediate sprint return.',
      icon: '🚨'
    },
    {
      id: 'bark_redirect',
      name: 'Stop Barking Redirect',
      frequency: 18000,
      pulses: 2,
      description: 'Breaks obsessive hyper-fixation on doorbells or fence-line triggers.',
      icon: '🛑'
    },
    {
      id: 'attention_touch',
      name: 'Attention / Focus Check',
      frequency: 14000,
      pulses: 1,
      description: 'Gentle audible cue to regain eye contact before giving commands.',
      icon: '👀'
    },
    {
      id: 'play_release',
      name: 'Free / Play Release Cue',
      frequency: 12500,
      pulses: 2,
      description: 'Clear cheerful double-chirp releasing from stay or crate.',
      icon: '🎾'
    }
  ];

  const CALMING_TONES = [
    {
      id: 'calm_432',
      name: '432 Hz Deep Relaxation',
      hz: 432,
      description: 'Harmonic frequency proven to decelerate canine heart rate and cortisol levels.',
      badge: 'Stress Reduction'
    },
    {
      id: 'calm_528',
      name: '528 Hz Transformation & Healing',
      hz: 528,
      description: 'Solfeggio frequency aiding recovery after intense overstimulation episodes.',
      badge: 'Recovery'
    },
    {
      id: 'calm_396',
      name: '396 Hz Fear & Anxiety Release',
      hz: 396,
      description: 'Counteracts thunderstorm and fireworks panic responses.',
      badge: 'Anti-Panic'
    },
    {
      id: 'maternal_heartbeat',
      name: '60 BPM Maternal Heartbeat',
      isHeartbeat: true,
      bpm: 60,
      description: 'Rhythmic bass heartbeat mimicking the mother dog for crate anxiety.',
      badge: 'Puppy & Separation'
    }
  ];

  const handleToggleContinuous = () => {
    if (isPlayingContinuous) {
      stopAllAudio();
      setIsPlayingContinuous(false);
      setActiveCalmMode(null);
    } else {
      stopAllAudio();
      startTone(frequency, volume, 'sine');
      setIsPlayingContinuous(true);
      setActiveCalmMode(null);
      if (onAwardSolanaTreats) {
        onAwardSolanaTreats(5, 'Acoustic Whistle Transmitted');
      }
    }
  };

  const handlePlayPreset = (preset: typeof WHISTLE_PRESETS[0]) => {
    stopAllAudio();
    setIsPlayingContinuous(false);
    setActiveCalmMode(null);
    playWhistleBurst(preset.frequency, preset.pulses);
    if (onAwardSolanaTreats) {
      onAwardSolanaTreats(5, `Transmitted ${preset.name}`);
    }
  };

  const handleToggleCalmTone = (tone: typeof CALMING_TONES[0]) => {
    if (activeCalmMode === tone.id) {
      stopAllAudio();
      setActiveCalmMode(null);
      setIsPlayingContinuous(false);
    } else {
      stopAllAudio();
      setIsPlayingContinuous(false);
      setActiveCalmMode(tone.id);

      if (tone.isHeartbeat) {
        startHeartbeat(tone.bpm || 60, volume);
      } else if (tone.hz) {
        startTone(tone.hz, volume, 'sine');
      }

      if (onAwardSolanaTreats) {
        onAwardSolanaTreats(5, `Calming Tone Activated: ${tone.name}`);
      }
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-white border border-[#1A1A1A] p-6 shadow-sm relative">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest font-mono bg-[#1A1A1A] text-[#FAF9F6]">
              Web Audio Precision Synthesizer
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest font-mono border border-[#1A1A1A] bg-[#FAF9F6] text-[#1A1A1A]">
              Canine Auditory Range: Up to 45,000 Hz
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light italic font-serif text-[#1A1A1A] tracking-tight">
            Ultrasonic Dog Whistle & Calming Frequency Studio
          </h2>
          <p className="text-xs text-[#1A1A1A]/70 max-w-2xl mt-1 leading-relaxed">
            Canines perceive sound waves far beyond the human audible spectrum. Transmit high-frequency commands for instant recall without human auditory disruption, or broadcast calibrated restorative frequencies to reduce nervous arousal.
          </p>
        </div>
      </div>

      {/* Main Grid: Whistle Synthesizer & Calming Frequencies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Ultrasonic Whistle Studio (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-[#1A1A1A] p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#1A1A1A]/20 pb-3">
            <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#1A1A1A]" />
              Ultrasonic Frequency Generator
            </h3>
            <span className="text-xs font-mono font-bold text-[#1A1A1A] bg-[#FAF9F6] px-2.5 py-1 border border-[#1A1A1A]">
              {frequency.toLocaleString()} Hz
            </span>
          </div>

          {/* Slider & Frequency Meter */}
          <div className="space-y-4 bg-[#FAF9F6] p-4 border border-[#1A1A1A]/30">
            <div>
              <div className="flex justify-between text-[11px] text-[#1A1A1A]/70 mb-1.5 font-sans">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Frequency Setting</span>
                <span className="font-semibold text-[#1A1A1A]">
                  {frequency >= 18000 ? 'Ultrasonic (Inaudible to humans)' : frequency >= 14000 ? 'High Canine Pitch' : 'Audible Range'}
                </span>
              </div>
              <input
                type="range"
                min="8000"
                max="22000"
                step="250"
                value={frequency}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFrequency(val);
                  if (isPlayingContinuous) {
                    startTone(val, volume, 'sine');
                  }
                }}
                className="w-full h-1.5 bg-[#1A1A1A]/20 rounded-none appearance-none cursor-pointer accent-[#1A1A1A]"
              />
              <div className="flex justify-between text-[9px] text-[#1A1A1A]/60 mt-1 font-mono">
                <span>8,000 Hz</span>
                <span>14,000 Hz</span>
                <span>22,000 Hz (Ultrasonic)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-[#1A1A1A]/70 mb-1.5 font-sans">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Volume / Gain</span>
                <span className="font-mono font-bold text-[#1A1A1A]">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={volume}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setVolume(val);
                  if (isPlayingContinuous) {
                    startTone(frequency, val, 'sine');
                  }
                }}
                className="w-full h-1.5 bg-[#1A1A1A]/20 rounded-none appearance-none cursor-pointer accent-[#1A1A1A]"
              />
            </div>
          </div>

          {/* Continuous Play Button */}
          <div className="flex gap-3">
            <button
              onClick={handleToggleContinuous}
              className={`flex-1 py-3 px-4 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                isPlayingContinuous
                  ? 'bg-red-700 hover:bg-red-800 text-white'
                  : 'bg-[#1A1A1A] hover:bg-black text-[#FAF9F6]'
              }`}
            >
              {isPlayingContinuous ? (
                <>
                  <Square className="w-4 h-4" />
                  Stop Continuous Whistle
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  Transmit Continuous Tone ({frequency} Hz)
                </>
              )}
            </button>
          </div>

          {/* Command Whistle Presets */}
          <div className="space-y-2.5 pt-2">
            <h4 className="text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest">
              Standard Command Signals
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {WHISTLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePlayPreset(preset)}
                  className="p-3 bg-[#FAF9F6] hover:bg-[#F2EFE8] border border-[#1A1A1A]/30 hover:border-[#1A1A1A] text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{preset.icon}</span>
                    <span className="font-bold text-xs text-[#1A1A1A]">
                      {preset.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#1A1A1A]/70 line-clamp-2">
                    {preset.description}
                  </p>
                  <span className="text-[9px] font-mono font-bold text-[#1A1A1A]/80 mt-1 block">
                    {preset.frequency.toLocaleString()} Hz • {preset.pulses} Pulses
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Calming Delta Tones & Heartbeat (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-[#1A1A1A] p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#1A1A1A]/20 pb-3">
            <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#1A1A1A]" />
              Restorative & Anti-Anxiety Frequencies
            </h3>
            <span className="text-[9px] font-mono uppercase font-bold text-[#1A1A1A] bg-[#FAF9F6] px-2 py-0.5 border border-[#1A1A1A]">
              Cortisol Reduction
            </span>
          </div>

          <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
            Calibrated harmonic tones to decelerate tachycardia during thunderstorms, fireworks, separation episodes, and crate transitions:
          </p>

          <div className="space-y-3">
            {CALMING_TONES.map((tone) => {
              const isActive = activeCalmMode === tone.id;
              return (
                <div
                  key={tone.id}
                  className={`p-4 border transition-all duration-200 flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-[#FAF9F6] border-[#1A1A1A] shadow-xs ring-1 ring-[#1A1A1A]'
                      : 'bg-white border-[#1A1A1A]/20 hover:border-[#1A1A1A]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#1A1A1A]">{tone.name}</h4>
                      <span className="text-[9px] px-1.5 py-0.2 font-mono uppercase font-bold bg-[#1A1A1A] text-white">
                        {tone.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                      {tone.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleCalmTone(tone)}
                    className={`py-2 px-3.5 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-red-700 text-white'
                        : 'bg-[#1A1A1A] hover:bg-black text-white'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Square className="w-3.5 h-3.5" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-white" />
                        Broadcast
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Calming Tip Card */}
          <div className="p-4 bg-[#FAF9F6] border border-[#1A1A1A] space-y-1.5">
            <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              Whisperer Crate Conditioning Protocol
            </span>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
              When introducing a subject to a crate enclosure, broadcast the 60 BPM Maternal Heartbeat sound for 15 minutes prior to latching the gate. Subjects naturally settle when rhythmic cardiovascular vibrations are present.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
