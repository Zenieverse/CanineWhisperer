import React, { useState, useRef } from 'react';
import { 
  Mic, 
  Square, 
  Volume2, 
  Sparkles, 
  Activity, 
  Radio, 
  AlertCircle, 
  CheckCircle, 
  Database, 
  Coins,
  RefreshCw,
  Sliders,
  AudioWaveform as WaveformIcon
} from 'lucide-react';
import { AudioAnalysisResult, DogProfile } from '../types';
import { SAMPLE_DOG_BARKS, SampleDogBark } from '../data/dogScenarios';
import { speakWithBrowserPersona, startTone, stopAllAudio } from '../utils/audioUtils';

interface BarkAudioDecoderProps {
  dogProfile: DogProfile;
  onSendToSnowflake?: (record: any) => void;
  onAwardSolanaTreats?: (points: number, reason: string) => void;
}

export const BarkAudioDecoder: React.FC<BarkAudioDecoderProps> = ({
  dogProfile,
  onSendToSnowflake,
  onAwardSolanaTreats
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AudioAnalysisResult | null>(SAMPLE_DOG_BARKS[0].presetAnalysis);
  const [selectedSampleId, setSelectedSampleId] = useState<string>(SAMPLE_DOG_BARKS[0].id);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [triggerContext, setTriggerContext] = useState<string>('');
  const [activeAcousticCue, setActiveAcousticCue] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Start Live Audio Mic Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Setup Web Audio Analyser for live visualizer
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      drawWaveform();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          analyzeAudioBlob(base64Audio);
        };
        reader.readAsDataURL(audioBlob);

        stream.getTracks().forEach(t => t.stop());
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
      setMicError(null);
    } catch (err: any) {
      console.error('Microphone error:', err);
      setMicError('Microphone permission not granted or unavailable. You can also analyze with preset canine vocalizations below.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  };

  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      analyser.getByteFrequencyData(dataArray);
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = `rgb(245, ${150 + dataArray[i] / 3}, 50)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
  };

  const analyzeAudioBlob = async (base64Audio: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/whisperer/analyze-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: base64Audio,
          mimeType: 'audio/webm',
          triggerContext: triggerContext || `Recorded bark from ${dogProfile.name}`
        })
      });

      if (!response.ok) throw new Error('Audio analysis failed');
      const data: AudioAnalysisResult = await response.json();
      setAnalysisResult(data);

      if (onAwardSolanaTreats) {
        onAwardSolanaTreats(15, 'Acoustic Bark Analysis Completed');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectPreset = (preset: SampleDogBark) => {
    setSelectedSampleId(preset.id);
    setAnalysisResult(preset.presetAnalysis);
  };

  const playHumanTranslationVoice = async () => {
    if (!analysisResult) return;
    setIsPlayingAudio(true);
    try {
      const response = await fetch('/api/elevenlabs/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: analysisResult.humanTranslation,
          personaId: dogProfile.voicePersona
        })
      });

      const data = await response.json();
      if (data.audioBase64) {
        const audio = new Audio(data.audioBase64);
        audio.onended = () => setIsPlayingAudio(false);
        audio.play();
      } else {
        speakWithBrowserPersona(analysisResult.humanTranslation, dogProfile.voicePersona, () => {
          setIsPlayingAudio(false);
        });
      }
    } catch {
      speakWithBrowserPersona(analysisResult.humanTranslation, dogProfile.voicePersona, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const triggerSuggestedAcousticCue = () => {
    if (activeAcousticCue) {
      stopAllAudio();
      setActiveAcousticCue(false);
    } else {
      // Trigger ultrasonic calming or redirect frequency
      startTone(16000, 0.25, 'sine');
      setActiveAcousticCue(true);
      setTimeout(() => {
        stopAllAudio();
        setActiveAcousticCue(false);
      }, 2500);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Microphone Error Notification */}
      {micError && (
        <div className="p-3.5 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold">⚠️ Notice:</span>
            <span>{micError}</span>
          </div>
          <button
            onClick={() => setMicError(null)}
            className="text-[10px] font-bold uppercase underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-[#1A1A1A] p-6 shadow-sm relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest font-mono bg-[#1A1A1A] text-[#FAF9F6]">
                Google Gemini Audio Acoustic Engine
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest font-mono border border-[#1A1A1A] bg-[#FAF9F6] text-[#1A1A1A]">
                Bark & Vocalization Decoder
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-light italic font-serif text-[#1A1A1A] tracking-tight">
              Canine Acoustic Spectrogram & Translation
            </h2>
            <p className="text-xs text-[#1A1A1A]/70 max-w-2xl mt-1 leading-relaxed">
              Record a live vocalization or inspect audio case studies. Acoustic telemetry extracts pitch harmonics, decibel peaks, and emotional urgency to reveal underlying canine motivations.
            </p>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/60">Acoustic Samples:</span>
            {SAMPLE_DOG_BARKS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
                  selectedSampleId === preset.id
                    ? 'bg-[#1A1A1A] text-[#FAF9F6] border-[#1A1A1A]'
                    : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/30 hover:border-[#1A1A1A] hover:bg-[#FAF9F6]'
                }`}
              >
                {preset.title.split(' ')[0]} Bark
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Audio Recorder & Spectrum (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#1A1A1A] p-6 shadow-sm space-y-5">
            
            {/* Visualizer Canvas / Status Display */}
            <div className="relative aspect-[4/3] bg-[#1A1A1A] border border-[#1A1A1A] overflow-hidden flex flex-col items-center justify-center p-6 text-center text-[#FAF9F6]">
              <canvas
                ref={canvasRef}
                width={360}
                height={160}
                className="w-full h-full object-cover absolute inset-0 opacity-80"
              />

              <div className="relative z-10 space-y-3">
                {isRecording ? (
                  <div className="space-y-2">
                    <div className="w-14 h-14 border border-red-400 bg-red-950/60 text-red-400 flex items-center justify-center mx-auto animate-pulse">
                      <Mic className="w-6 h-6" />
                    </div>
                    <p className="font-mono font-bold text-red-400 text-sm uppercase tracking-widest">
                      RECORDING BARK: {recordingSeconds}s
                    </p>
                    <p className="text-[11px] text-[#FAF9F6]/60 font-mono">Capturing acoustic packets...</p>
                  </div>
                ) : isAnalyzing ? (
                  <div className="space-y-3">
                    <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="font-bold text-white text-xs uppercase tracking-widest">Decoding Harmonics...</p>
                    <p className="text-[11px] text-[#FAF9F6]/60 font-mono">Gemini computing pitch & arousal...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 border border-white/20 bg-white/5 text-white flex items-center justify-center mx-auto">
                      <WaveformIcon className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-white text-xs uppercase tracking-widest">Live Acoustic Sensor</h4>
                    <p className="text-[11px] text-[#FAF9F6]/60 max-w-xs leading-normal">
                      Press record when subject barks or whines to analyze instantaneous waveforms.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Recorder Controls */}
            <div className="flex gap-3">
              {isRecording ? (
                <button
                  onClick={stopRecording}
                  className="flex-1 py-3 px-4 bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Square className="w-4 h-4" />
                  Stop & Decode Bark
                </button>
              ) : (
                <button
                  onClick={startRecording}
                  disabled={isAnalyzing}
                  className="flex-1 py-3 px-4 bg-[#1A1A1A] hover:bg-black text-[#FAF9F6] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  <Mic className="w-4 h-4" />
                  Start Live Bark Recording
                </button>
              )}
            </div>

            {/* Context Input */}
            <div className="space-y-1.5 pt-2 border-t border-[#1A1A1A]/20">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/70">
                Trigger Context (Optional)
              </label>
              <input
                type="text"
                value={triggerContext}
                onChange={(e) => setTriggerContext(e.target.value)}
                placeholder="e.g. Neighbor walked past, doorbell rang"
                className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/30 focus:border-[#1A1A1A] px-3 py-2 text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none"
              />
            </div>

          </div>
        </div>

        {/* Right Column: Acoustic Intelligence & Translation (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {analysisResult ? (
            <div className="bg-white border border-[#1A1A1A] p-6 shadow-sm space-y-5">
              
              {/* Header: Vocalization Type & Urgency */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1A1A1A]/20">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]/60">Acoustic Classification</span>
                  <h3 className="text-xl font-normal font-serif text-[#1A1A1A] flex items-center gap-2 mt-0.5">
                    {analysisResult.vocalizationType}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 font-bold text-xs border border-[#1A1A1A] bg-[#FAF9F6] text-[#1A1A1A] flex items-center gap-1.5 uppercase tracking-wider">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Urgency: {analysisResult.urgencyRating}
                  </span>
                </div>
              </div>

              {/* Spectral Vitals Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-[#FAF9F6] p-3 border border-[#1A1A1A]/30">
                  <span className="text-[9px] text-[#1A1A1A]/70 uppercase font-bold tracking-wider">Fundamental Peak</span>
                  <p className="text-lg font-mono font-bold text-[#1A1A1A] mt-0.5">
                    {analysisResult.peakFrequencyHz} <span className="text-xs font-normal text-[#1A1A1A]/60">Hz</span>
                  </p>
                  <span className="text-[9px] text-[#1A1A1A]/60 font-mono">
                    {analysisResult.peakFrequencyHz > 1800 ? 'High pitch distress' : analysisResult.peakFrequencyHz > 900 ? 'Alert mid-frequency' : 'Low territorial tone'}
                  </span>
                </div>

                <div className="bg-[#FAF9F6] p-3 border border-[#1A1A1A]/30">
                  <span className="text-[9px] text-[#1A1A1A]/70 uppercase font-bold tracking-wider">Acoustic Intensity</span>
                  <p className="text-lg font-mono font-bold text-[#1A1A1A] mt-0.5">
                    {analysisResult.intensityDb.toFixed(1)} <span className="text-xs font-normal text-[#1A1A1A]/60">dB</span>
                  </p>
                  <span className="text-[9px] text-[#1A1A1A]/60 font-mono">Peak sound pressure</span>
                </div>

                <div className="bg-[#FAF9F6] p-3 border border-[#1A1A1A]/30 col-span-2 sm:col-span-1">
                  <span className="text-[9px] text-[#1A1A1A]/70 uppercase font-bold tracking-wider">Emotional Driver</span>
                  <p className="text-xs font-bold text-[#1A1A1A] mt-1 line-clamp-2">
                    {analysisResult.emotionalRoot.substring(0, 45)}...
                  </p>
                </div>
              </div>

              {/* Human Translation Card with ElevenLabs Button */}
              <div className="bg-[#FAF9F6] border border-[#1A1A1A] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-1.5">
                    <span>🗣️</span>
                    Human Translation
                  </span>
                  <button
                    onClick={playHumanTranslationVoice}
                    disabled={isPlayingAudio}
                    className="px-3 py-1 bg-[#1A1A1A] hover:bg-black text-[#FAF9F6] font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
                    {isPlayingAudio ? 'Speaking...' : 'ElevenLabs Neural Voice'}
                  </button>
                </div>
                <p className="text-base italic font-serif text-[#1A1A1A] leading-relaxed">
                  "{analysisResult.humanTranslation}"
                </p>
              </div>

              {/* Step-by-Step Counter-Conditioning Training Plan */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#1A1A1A]" />
                  Whisperer Counter-Conditioning Protocol
                </h4>
                <div className="space-y-2">
                  {analysisResult.counterConditioningPlan.map((step, idx) => (
                    <div 
                      key={idx} 
                      className="bg-[#FAF9F6] p-3 border border-[#1A1A1A]/20 flex items-start gap-3"
                    >
                      <span className="w-5 h-5 bg-[#1A1A1A] text-[#FAF9F6] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-[#1A1A1A] leading-relaxed font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Acoustic Cue Button */}
              <div className="bg-[#FAF9F6] p-3.5 border border-[#1A1A1A] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[9px] text-[#1A1A1A]/70 uppercase font-bold tracking-wider">Recommended Acoustic Response</span>
                  <p className="text-xs font-bold text-[#1A1A1A]">{analysisResult.suggestedAcousticCue}</p>
                </div>

                <button
                  onClick={triggerSuggestedAcousticCue}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border flex items-center gap-2 transition-all cursor-pointer ${
                    activeAcousticCue
                      ? 'bg-[#1A1A1A] text-[#FAF9F6] border-[#1A1A1A] animate-pulse'
                      : 'bg-white hover:bg-[#FAF9F6] border-[#1A1A1A] text-[#1A1A1A]'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  {activeAcousticCue ? 'Transmitting Cue...' : 'Transmit Ultrasonic Cue'}
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white p-12 border border-[#1A1A1A] text-center flex flex-col items-center justify-center min-h-[360px]">
              <Activity className="w-12 h-12 text-[#1A1A1A]/40 mb-3" />
              <h3 className="text-base font-bold font-serif text-[#1A1A1A]">Awaiting Vocalization Audio</h3>
              <p className="text-xs text-[#1A1A1A]/60 max-w-sm mt-1">
                Record using your microphone or select a sample bark from above to view the acoustic decoding.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
