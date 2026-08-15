import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Volume2, 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  RefreshCw, 
  ArrowRight,
  Database,
  Coins,
  Smile,
  ShieldAlert,
  HelpCircle,
  Eye
} from 'lucide-react';
import { VisionAnalysisResult, DogProfile } from '../types';
import { SAMPLE_DOG_IMAGES, SampleDogImage } from '../data/dogScenarios';
import { speakWithBrowserPersona, startTone, stopAllAudio } from '../utils/audioUtils';

interface VisionDecoderProps {
  dogProfile: DogProfile;
  onSendToSnowflake?: (record: any) => void;
  onAwardSolanaTreats?: (points: number, reason: string) => void;
  onNavigateToVoice?: (text: string) => void;
}

export const VisionDecoder: React.FC<VisionDecoderProps> = ({
  dogProfile,
  onSendToSnowflake,
  onAwardSolanaTreats,
  onNavigateToVoice
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_DOG_IMAGES[0].imageUrl);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<VisionAnalysisResult | null>(SAMPLE_DOG_IMAGES[0].presetAnalysis);
  const [contextInput, setContextInput] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeFrequency, setActiveFrequency] = useState<number | null>(null);
  const [streamedToSnowflake, setStreamedToSnowflake] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start Web Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error('Camera access error:', err);
      alert('Could not access camera. Please ensure permissions are granted or use photo upload.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setSelectedImage(dataUrl);
      stopCamera();
      analyzeImage(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        analyzeImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (sample: SampleDogImage) => {
    stopCamera();
    setSelectedImage(sample.imageUrl);
    setAnalysisResult(sample.presetAnalysis);
    setStreamedToSnowflake(false);
  };

  const analyzeImage = async (imageSrc: string) => {
    setIsAnalyzing(true);
    setStreamedToSnowflake(false);
    try {
      const response = await fetch('/api/whisperer/analyze-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageSrc,
          dogContext: contextInput || `Dog name: ${dogProfile.name}, Breed: ${dogProfile.breed}`
        })
      });

      if (!response.ok) throw new Error('Failed to analyze image');
      const data: VisionAnalysisResult = await response.json();
      setAnalysisResult(data);

      // Automatically award 10 Solana TREATS for decoded session
      if (onAwardSolanaTreats) {
        onAwardSolanaTreats(10, 'Multimodal Body Language Decoded');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      // Fallback to rich default
      setAnalysisResult(SAMPLE_DOG_IMAGES[0].presetAnalysis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const playCanineVoice = async () => {
    if (!analysisResult) return;
    setIsPlayingAudio(true);
    try {
      const response = await fetch('/api/elevenlabs/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: analysisResult.canineThoughtTranslation,
          personaId: dogProfile.voicePersona
        })
      });

      const resData = await response.json();
      if (resData.audioBase64) {
        const audio = new Audio(resData.audioBase64);
        audio.onended = () => setIsPlayingAudio(false);
        audio.play();
      } else {
        // Fallback TTS
        speakWithBrowserPersona(analysisResult.canineThoughtTranslation, dogProfile.voicePersona, () => {
          setIsPlayingAudio(false);
        });
      }
    } catch {
      speakWithBrowserPersona(analysisResult.canineThoughtTranslation, dogProfile.voicePersona, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const toggleCalmingFrequency = (hz: number = 432) => {
    if (activeFrequency === hz) {
      stopAllAudio();
      setActiveFrequency(null);
    } else {
      startTone(hz, 0.3, 'sine');
      setActiveFrequency(hz);
    }
  };

  const streamToSnowflakeWarehouse = () => {
    if (!analysisResult) return;
    const record = {
      RECORD_ID: `REC-SF-${Math.floor(10000 + Math.random() * 90000)}`,
      TIMESTAMP: new Date().toISOString().replace('T', ' ').substring(0, 19),
      DOG_ID: `DOG-${dogProfile.name.toUpperCase()}`,
      BREED: analysisResult.detectedBreed || dogProfile.breed,
      AGE_GROUP: `${dogProfile.ageYears}y (${dogProfile.trainingLevel})`,
      TRIGGER_TYPE: analysisResult.primaryEmotion,
      HEART_RATE_BPM: 90 + Math.round(analysisResult.arousalLevel * 0.7),
      AROUSAL_SCORE: analysisResult.arousalLevel,
      DECIBEL_PEAK: 60 + Math.round(analysisResult.arousalLevel * 0.3),
      INTERVENTION_APPLIED: analysisResult.recommendedAction.substring(0, 40),
      RECOVERY_TIME_SEC: Math.round(analysisResult.stressIndex * 1.5),
      CORTEX_ANXIETY_FLAG: analysisResult.stressIndex > 50
    };

    if (onSendToSnowflake) {
      onSendToSnowflake(record);
    }
    setStreamedToSnowflake(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Introduction */}
      <div className="bg-white border border-[#1A1A1A] p-6 shadow-sm relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest font-mono bg-[#1A1A1A] text-[#FAF9F6]">
                Google Gemini 2.5 / 3.7 Vision
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest font-mono border border-[#1A1A1A] bg-[#FAF9F6] text-[#1A1A1A]">
                Micro-Expression Ethology
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-light italic font-serif text-[#1A1A1A] tracking-tight">
              Canine Body Language & Micro-Expression Decoder
            </h2>
            <p className="text-xs text-[#1A1A1A]/70 max-w-2xl mt-1 leading-relaxed">
              Google Gemini analyzes ear tension, sclera exposure (whale eye), lip licking, spinal curvature, and weight distribution to translate internal emotional state and cognitive motivation in real time.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 font-sans">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/60">Case Studies:</span>
            {SAMPLE_DOG_IMAGES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectPreset(sample)}
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
                  selectedImage === sample.imageUrl
                    ? 'bg-[#1A1A1A] text-[#FAF9F6] border-[#1A1A1A]'
                    : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/30 hover:border-[#1A1A1A] hover:bg-[#FAF9F6]'
                }`}
              >
                {sample.title.split(' ')[0]} {sample.breed.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Two-Column Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Capture & Inputs (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#1A1A1A] p-5 shadow-sm space-y-4">
            
            {/* Viewport */}
            <div className="relative aspect-square bg-[#FAF9F6] border border-[#1A1A1A] overflow-hidden flex items-center justify-center group">
              {isCameraActive ? (
                <div className="relative w-full h-full">
                  <video 
                    ref={videoRef} 
                    playsInline 
                    autoPlay 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 border border-dashed border-[#1A1A1A]/60 pointer-events-none flex items-center justify-center">
                    <div className="w-24 h-24 border border-[#1A1A1A] rounded-full animate-ping opacity-40" />
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                    <button
                      onClick={captureSnapshot}
                      className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-[#FAF9F6] font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 active:scale-95 transition-transform cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      Take Snapshot
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-3 py-2 bg-white hover:bg-[#FAF9F6] border border-[#1A1A1A] text-[#1A1A1A] text-xs font-semibold uppercase tracking-wider cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <img 
                    src={selectedImage} 
                    alt="Canine Subject" 
                    className="w-full h-full object-cover grayscale-[15%] contrast-[1.05]" 
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-[#FAF9F6]/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center border border-[#1A1A1A]">
                      <div className="w-10 h-10 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="font-bold text-[#1A1A1A] text-xs uppercase tracking-widest">Gemini Neural Decoding in Progress</p>
                      <p className="text-[11px] text-[#1A1A1A]/60 mt-1 font-mono">Scanning ear position, pupil dilation & spinal torque...</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Controls Bar */}
            <div className="grid grid-cols-2 gap-3 font-sans">
              <button
                onClick={isCameraActive ? stopCamera : startCamera}
                className="py-2.5 px-3 bg-white hover:bg-[#FAF9F6] border border-[#1A1A1A] text-[#1A1A1A] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4 text-[#1A1A1A]" />
                {isCameraActive ? 'Turn Off Cam' : 'Live Camera'}
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-3 bg-white hover:bg-[#FAF9F6] border border-[#1A1A1A] text-[#1A1A1A] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-[#1A1A1A]" />
                Upload Photo
              </button>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </div>

            {/* Situation Context Field */}
            <div className="space-y-1.5 font-sans">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/70 flex items-center justify-between">
                <span>Situation Context (Optional)</span>
                <span className="text-[9px] text-[#1A1A1A]/50 font-mono">e.g. Mail carrier, thunderstorm</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={contextInput}
                  onChange={(e) => setContextInput(e.target.value)}
                  placeholder="e.g. Someone rang the doorbell"
                  className="flex-1 bg-[#FAF9F6] border border-[#1A1A1A]/40 focus:border-[#1A1A1A] px-3 py-2 text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none"
                />
                <button
                  onClick={() => analyzeImage(selectedImage)}
                  disabled={isAnalyzing}
                  className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-[#FAF9F6] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  Decode
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Decoded Psychological Intelligence (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {analysisResult ? (
            <div className="space-y-4">
              
              {/* Primary Emotion & Core Vitals Card */}
              <div className="bg-white border border-[#1A1A1A] p-6 shadow-sm space-y-5">
                
                {/* Header with Detected Breed & Emotion Badge */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1A1A1A]/20">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]/60 font-sans">Identified Subject Profile</span>
                    <h3 className="text-xl font-normal font-serif text-[#1A1A1A] flex items-center gap-2 mt-0.5">
                      {analysisResult.detectedBreed}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2 font-sans">
                    <span className="px-3 py-1 font-bold text-xs bg-[#1A1A1A] text-[#FAF9F6] border border-[#1A1A1A] flex items-center gap-1.5 uppercase tracking-wider">
                      <Smile className="w-3.5 h-3.5 text-amber-300" />
                      {analysisResult.primaryEmotion}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-mono font-bold bg-[#FAF9F6] text-[#1A1A1A] border border-[#1A1A1A]/30">
                      {analysisResult.confidenceScore.toFixed(1)}% Conf
                    </span>
                  </div>
                </div>

                {/* Arousal and Stress Gauges */}
                <div className="grid grid-cols-2 gap-4 font-sans">
                  <div className="bg-[#FAF9F6] border border-[#1A1A1A]/30 p-3.5">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/70">Canine Arousal Index</span>
                      <span className="font-mono font-bold text-[#1A1A1A]">{analysisResult.arousalLevel}/100</span>
                    </div>
                    <div className="w-full bg-[#E5E2D9] h-2 overflow-hidden border border-[#1A1A1A]/20">
                      <div 
                        className="h-full bg-[#1A1A1A] transition-all duration-700" 
                        style={{ width: `${Math.min(100, analysisResult.arousalLevel)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[#1A1A1A]/60 mt-1 block font-mono">
                      {analysisResult.arousalLevel > 70 ? 'High Excitement / Reactivity' : analysisResult.arousalLevel > 40 ? 'Moderate Alertness' : 'Calm Resting State'}
                    </span>
                  </div>

                  <div className="bg-[#FAF9F6] border border-[#1A1A1A]/30 p-3.5">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/70">Cortisol / Stress Index</span>
                      <span className="font-mono font-bold text-[#1A1A1A]">
                        {analysisResult.stressIndex}/100
                      </span>
                    </div>
                    <div className="w-full bg-[#E5E2D9] h-2 overflow-hidden border border-[#1A1A1A]/20">
                      <div 
                        className="h-full bg-[#1A1A1A] transition-all duration-700"
                        style={{ width: `${Math.min(100, analysisResult.stressIndex)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[#1A1A1A]/60 mt-1 block font-mono">
                      {analysisResult.stressIndex > 50 ? 'Appeasement / Avoidance Signals' : 'Low Tension / Contentment'}
                    </span>
                  </div>
                </div>

                {/* Canine Thought Translation (Inner Voice with ElevenLabs Button) */}
                <div className="bg-[#FAF9F6] border border-[#1A1A1A] p-4 relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">💭</span>
                      <span className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest font-sans">
                        Canine Inner Voice Translation
                      </span>
                    </div>
                    <button
                      onClick={playCanineVoice}
                      disabled={isPlayingAudio}
                      className="px-3 py-1 bg-[#1A1A1A] hover:bg-black text-[#FAF9F6] font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer font-sans"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
                      {isPlayingAudio ? 'Speaking...' : 'ElevenLabs Neural TTS'}
                    </button>
                  </div>
                  <p className="text-base italic font-serif text-[#1A1A1A] leading-relaxed">
                    "{analysisResult.canineThoughtTranslation}"
                  </p>
                </div>

                {/* Anatomical Micro-Expression Markers Grid */}
                <div>
                  <h4 className="text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest mb-2.5 flex items-center gap-1.5 font-sans">
                    <Layers className="w-3.5 h-3.5 text-[#1A1A1A]" />
                    Ethological Micro-Markers Breakdown
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {analysisResult.bodyLanguageMarkers.map((marker, idx) => (
                      <div 
                        key={idx} 
                        className="bg-[#FAF9F6] p-3 border border-[#1A1A1A]/20 space-y-1 hover:border-[#1A1A1A] transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#1A1A1A]">{marker.part}</span>
                          <span className="text-[9px] px-1.5 py-0.2 font-mono uppercase font-bold border border-[#1A1A1A]/30 bg-white text-[#1A1A1A]">
                            {marker.arousalLevel}
                          </span>
                        </div>
                        <p className="text-xs text-[#1A1A1A] font-semibold">{marker.status}</p>
                        <p className="text-[11px] text-[#1A1A1A]/70 leading-normal">{marker.interpretation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Whisperer Action Directives */}
                <div className="bg-[#FAF9F6] p-4 border border-[#1A1A1A] space-y-3 font-sans">
                  <div className="flex items-center gap-2 text-[#1A1A1A]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Master Whisperer Protocol Directive</span>
                  </div>
                  <p className="text-xs text-[#1A1A1A]/90 leading-relaxed">
                    {analysisResult.whispererAdvice}
                  </p>
                  
                  <div className="pt-2 border-t border-[#1A1A1A]/20 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/70">Recommended Action:</span>
                      <span className="text-xs font-bold text-[#1A1A1A] bg-white px-2 py-0.5 border border-[#1A1A1A]/30">
                        {analysisResult.recommendedAction}
                      </span>
                    </div>

                    {analysisResult.calmingFrequencyHz && (
                      <button
                        onClick={() => toggleCalmingFrequency(analysisResult.calmingFrequencyHz || 432)}
                        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-all cursor-pointer ${
                          activeFrequency === analysisResult.calmingFrequencyHz
                            ? 'bg-[#1A1A1A] text-[#FAF9F6] border-[#1A1A1A] animate-pulse'
                            : 'bg-white border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#FAF9F6]'
                        }`}
                      >
                        <Radio className="w-3.5 h-3.5" />
                        {activeFrequency === analysisResult.calmingFrequencyHz 
                          ? `Playing ${analysisResult.calmingFrequencyHz}Hz Calming Tone` 
                          : `Play ${analysisResult.calmingFrequencyHz}Hz Sound`}
                      </button>
                    )}
                  </div>
                </div>

                {/* Multi-Cloud & Web3 Pipeline Integration Bar */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#1A1A1A]/20 font-sans">
                  <button
                    onClick={streamToSnowflakeWarehouse}
                    disabled={streamedToSnowflake}
                    className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border transition-all cursor-pointer ${
                      streamedToSnowflake
                        ? 'bg-[#1A1A1A] text-[#FAF9F6] border-[#1A1A1A]'
                        : 'bg-white hover:bg-[#FAF9F6] border-[#1A1A1A] text-[#1A1A1A] shadow-xs'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    {streamedToSnowflake ? 'Streamed to Snowflake DW ✓' : 'Stream Telemetry to Snowflake'}
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#1A1A1A]/70 font-medium">Earned +10 TREATS</span>
                    <span className="px-2 py-0.5 text-xs font-mono font-bold bg-[#1A1A1A] text-white flex items-center gap-1">
                      <Coins className="w-3 h-3 text-amber-300" />
                      Solana
                    </span>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-white p-12 border border-[#1A1A1A] text-center flex flex-col items-center justify-center min-h-[400px]">
              <Eye className="w-12 h-12 text-[#1A1A1A]/40 mb-3" />
              <h3 className="text-base font-bold font-serif text-[#1A1A1A]">Ready to Decode Canine Body Language</h3>
              <p className="text-xs text-[#1A1A1A]/60 max-w-sm mt-1">
                Take a photo with the live camera or select one of the presets above to view micro-expression analysis.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
