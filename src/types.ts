export type TabType = 
  | 'vision' 
  | 'audio' 
  | 'voice' 
  | 'whistle' 
  | 'snowflake' 
  | 'solana' 
  | 'coach';

export interface DogProfile {
  id: string;
  name: string;
  breed: string;
  ageYears: number;
  weightLbs: number;
  temperament: string;
  avatarUrl?: string;
  microchipId?: string;
  voicePersona: VoicePersonaId;
  solanaAddress?: string;
  treatsEarned: number;
  trainingLevel: 'Puppy Basics' | 'Intermediate Obedience' | 'Canine Good Citizen' | 'Master Companion';
}

export type VoicePersonaId = 
  | 'golden_goof' 
  | 'bulldog_lord' 
  | 'shepherd_guardian' 
  | 'frenchie_sassy' 
  | 'husky_dramatic' 
  | 'whisperer_calm';

export interface VoicePersona {
  id: VoicePersonaId;
  name: string;
  description: string;
  elevenlabsVoiceId: string;
  pitch: number;
  avatar: string;
  tag: string;
}

export interface BodyLanguageMarker {
  part: 'Ears' | 'Eyes' | 'Mouth/Tongue' | 'Tail' | 'Spine/Posture' | 'Paws';
  status: string;
  interpretation: string;
  arousalLevel: 'Low' | 'Moderate' | 'Elevated' | 'Extreme';
}

export interface VisionAnalysisResult {
  detectedBreed: string;
  primaryEmotion: 'Ecstatic Joy' | 'Relaxed & Content' | 'Playful Anticipation' | 'Alert & Guarding' | 'Fearful / Anxious' | 'Stress / Overstimulated' | 'Submissive Solicitation';
  confidenceScore: number;
  arousalLevel: number; // 0 - 100
  stressIndex: number; // 0 - 100
  bodyLanguageMarkers: BodyLanguageMarker[];
  canineThoughtTranslation: string;
  whispererAdvice: string;
  recommendedAction: string;
  calmingFrequencyHz?: number;
  timestamp: string;
}

export interface AudioAnalysisResult {
  vocalizationType: 'Alarm Bark' | 'Play Ruff' | 'Separation Whine' | 'Demand Bark' | 'Defensive Growl' | 'Boredom Howl' | 'Anxious Yelp';
  peakFrequencyHz: number;
  intensityDb: number;
  urgencyRating: 'Low' | 'Medium' | 'High' | 'Critical';
  emotionalRoot: string;
  humanTranslation: string;
  counterConditioningPlan: string[];
  suggestedAcousticCue: string;
  timestamp: string;
}

export interface SnowflakeTelemetryRecord {
  RECORD_ID: string;
  TIMESTAMP: string;
  DOG_ID: string;
  BREED: string;
  AGE_GROUP: string;
  TRIGGER_TYPE: string;
  HEART_RATE_BPM: number;
  AROUSAL_SCORE: number;
  DECIBEL_PEAK: number;
  INTERVENTION_APPLIED: string;
  RECOVERY_TIME_SEC: number;
  CORTEX_ANXIETY_FLAG: boolean;
}

export interface SolanaCertificate {
  certificateId: string;
  dogName: string;
  breed: string;
  title: string;
  issuer: string;
  dateAwarded: string;
  txHash: string;
  signature: string;
  badgeLevel: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  traits: { trait_type: string; value: string | number }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'whisperer' | 'dog';
  text: string;
  timestamp: string;
  audioUrl?: string;
  tags?: string[];
}
