import { VoicePersona, VisionAnalysisResult, AudioAnalysisResult } from '../types';

export const VOICE_PERSONAS: VoicePersona[] = [
  {
    id: 'golden_goof',
    name: 'Buster (Happy-Go-Lucky Golden)',
    description: 'Enthusiastic, food-motivated, loves everybody, high excitement energy',
    elevenlabsVoiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel
    pitch: 1.15,
    avatar: '🐕',
    tag: 'Playful & Loving'
  },
  {
    id: 'bulldog_lord',
    name: 'Winston (Aristocratic Bulldog)',
    description: 'Dry British wit, values naps above all, mildly inconvenienced by squirrels',
    elevenlabsVoiceId: 'ErXwobaYiN019PkySvjV', // Antoni
    pitch: 0.85,
    avatar: '🐶',
    tag: 'Dignified & Grumpy'
  },
  {
    id: 'shepherd_guardian',
    name: 'Rex (Vigilant German Shepherd)',
    description: 'Perimeter patrol officer, takes delivery truck surveillance very seriously',
    elevenlabsVoiceId: 'VR6AewLTigWG4xSOukaG', // Josh
    pitch: 0.95,
    avatar: '🐺',
    tag: 'Protective & Alert'
  },
  {
    id: 'frenchie_sassy',
    name: 'Coco (Sassy French Bulldog)',
    description: 'Demanding immediate belly rubs, gourmet treats, and royal cushions',
    elevenlabsVoiceId: 'AZnzlk1XvdvUeBnXmlld', // Domi
    pitch: 1.2,
    avatar: '🐾',
    tag: 'Sassy & Dramatic'
  },
  {
    id: 'husky_dramatic',
    name: 'Ghost (Opera Husky)',
    description: 'Loves theatrical singing, 20-minute breakfast delays are a tragedy',
    elevenlabsVoiceId: 'EXAVITQu4vr4xnSDxMaL', // Bella
    pitch: 1.1,
    avatar: '🐕‍🦺',
    tag: 'Dramatic & Vocal'
  },
  {
    id: 'whisperer_calm',
    name: 'Master Trainer Elena (Calm Whisperer)',
    description: 'Deeply soothing alpha trainer voice for guided canine de-escalation',
    elevenlabsVoiceId: 'yoZ06aMxZJJ28mfd3POQ', // Sam
    pitch: 1.0,
    avatar: '🧘‍♂️',
    tag: 'Trainer Coach'
  }
];

export interface SampleDogImage {
  id: string;
  title: string;
  breed: string;
  imageUrl: string;
  context: string;
  presetAnalysis: VisionAnalysisResult;
}

export const SAMPLE_DOG_IMAGES: SampleDogImage[] = [
  {
    id: 'play_bow_golden',
    title: 'Play Bow Stance (Golden Retriever)',
    breed: 'Golden Retriever',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    context: 'Front elbows on ground, tail high and loosely wagging, relaxed open mouth smile.',
    presetAnalysis: {
      detectedBreed: 'Golden Retriever (Purebred / Working Line)',
      primaryEmotion: 'Playful Anticipation',
      confidenceScore: 98.4,
      arousalLevel: 72,
      stressIndex: 8,
      bodyLanguageMarkers: [
        { part: 'Spine/Posture', status: 'Classic Play Bow (Anterior lowered, rump elevated)', interpretation: 'Universal canine invitation to chase and frolic.', arousalLevel: 'Moderate' },
        { part: 'Ears', status: 'Perked forward but soft', interpretation: 'Attentive, welcoming, zero defensive tension.', arousalLevel: 'Low' },
        { part: 'Mouth/Tongue', status: 'Soft open mouth, tongue loosely lolling', interpretation: 'High endorphin state, completely non-threatening.', arousalLevel: 'Low' },
        { part: 'Tail', status: 'Elevated at 60°, broad rhythmic sweeping wag', interpretation: 'Uninhibited joy and friendly engagement signal.', arousalLevel: 'Moderate' }
      ],
      canineThoughtTranslation: `"Hey! Drop whatever you're doing right now! Let's chase that squeaky tennis ball across the lawn! I'll let you catch me twice, deal?!"`,
      whispererAdvice: 'Match their playful energy with structured release! Give a clear release cue ("Free!") and initiate interactive fetch or tug with firm start/stop boundaries.',
      recommendedAction: 'Engage in 10 minutes of structured play followed by a calming sit-stay reward.',
      calmingFrequencyHz: 432,
      timestamp: new Date().toISOString()
    }
  },
  {
    id: 'anxious_corgi',
    title: 'Lip Licking & Whale Eye (Pembroke Welsh Corgi)',
    breed: 'Welsh Corgi',
    imageUrl: 'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?auto=format&fit=crop&w=800&q=80',
    context: 'Corgi turning head away, showing white sclera in eye (whale eye), brief tongue flick.',
    presetAnalysis: {
      detectedBreed: 'Pembroke Welsh Corgi',
      primaryEmotion: 'Fearful / Anxious',
      confidenceScore: 96.1,
      arousalLevel: 68,
      stressIndex: 78,
      bodyLanguageMarkers: [
        { part: 'Eyes', status: 'Whale Eye (Sclera visible on side, dilated pupils)', interpretation: 'Dog feels cornered or overwhelmed by current proximity.', arousalLevel: 'Elevated' },
        { part: 'Mouth/Tongue', status: 'Micro tongue flick / lip licking', interpretation: 'Classic canine calming signal attempting to diffuse perceived conflict.', arousalLevel: 'Elevated' },
        { part: 'Ears', status: 'Pinned backward flush against the skull', interpretation: 'Defensive appeasement, apprehension.', arousalLevel: 'Elevated' },
        { part: 'Spine/Posture', status: 'Body weight shifted to rear paws, head turned sideways', interpretation: 'Avoidance posture, asking for spatial boundary.', arousalLevel: 'Moderate' }
      ],
      canineThoughtTranslation: `"Please don't lean over me right now. I'm feeling nervous and I need a few steps of space to breathe."`,
      whispererAdvice: 'Immediately step back 3-4 feet. Turn your side to the dog, avoid direct eye contact, and drop a high-value treat gently on the floor without reaching over their head.',
      recommendedAction: 'Grant immediate space, lower your voice octave, and avoid petting on top of the skull.',
      calmingFrequencyHz: 528,
      timestamp: new Date().toISOString()
    }
  },
  {
    id: 'alert_shepherd',
    title: 'Perimeter Alert Stance (German Shepherd)',
    breed: 'German Shepherd',
    imageUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800&q=80',
    context: 'Ears erect and cupped forward, rigid spine, mouth tightly clamped, locked stare.',
    presetAnalysis: {
      detectedBreed: 'German Shepherd Dog (Working Line)',
      primaryEmotion: 'Alert & Guarding',
      confidenceScore: 99.2,
      arousalLevel: 88,
      stressIndex: 45,
      bodyLanguageMarkers: [
        { part: 'Ears', status: 'Rigidly prick-forward, directional scanning', interpretation: 'Locking onto distant audio/visual anomaly outside perimeter.', arousalLevel: 'Elevated' },
        { part: 'Spine/Posture', status: 'Tense forward weight distribution, hackles slightly raised', interpretation: 'Prepared for instant sprint or territorial deterrent.', arousalLevel: 'Elevated' },
        { part: 'Mouth/Tongue', status: 'Tightly closed jaws, zero panting', interpretation: 'Concentrated predator/guardian focus.', arousalLevel: 'Moderate' },
        { part: 'Tail', status: 'Horizontal stiff extension, tip vibrating slowly', interpretation: 'High confidence dominance assessment.', arousalLevel: 'Elevated' }
      ],
      canineThoughtTranslation: `"Unknown movement detected at 45 yards near the front gate. Analyzing threat profile... Standing by for pack leader confirmation."`,
      whispererAdvice: 'Acknowledge their alert ("Thank you, got it"), then redirect immediately into a calm obedience command like "Place" or "Heel" to prevent vocal outburst.',
      recommendedAction: 'Claim the perimeter calmly, redirect with a "Touch" or "Down" command, reward with praise.',
      calmingFrequencyHz: 396,
      timestamp: new Date().toISOString()
    }
  }
];

export interface SampleDogBark {
  id: string;
  title: string;
  description: string;
  durationSec: number;
  audioSimType: 'rapid_alarm' | 'separation_whine' | 'play_ruff' | 'territorial_growl';
  presetAnalysis: AudioAnalysisResult;
}

export const SAMPLE_DOG_BARKS: SampleDogBark[] = [
  {
    id: 'doorbell_frenzy',
    title: 'Doorbell Alert Frenzy (High-Pitch Rapid Barking)',
    description: '3 sharp staccato barks with 0.2s intervals at 85dB',
    durationSec: 4.5,
    audioSimType: 'rapid_alarm',
    presetAnalysis: {
      vocalizationType: 'Alarm Bark',
      peakFrequencyHz: 1420,
      intensityDb: 86.4,
      urgencyRating: 'High',
      emotionalRoot: 'Territorial excitement + pack alert reflex triggered by sudden doorbell acoustic pulse.',
      humanTranslation: `"ALERT! Someone is standing at our front threshold! Pack leader, report to the door immediately!"`,
      counterConditioningPlan: [
        'Desensitize the doorbell chime at 20% volume while feeding chicken liver treats.',
        'Establish an automatic "Go to Bed/Place" response upon hearing the chime before opening the door.',
        'Avoid shouting "Quiet!" as dogs interpret owner shouting as joining in the pack barking chorus.'
      ],
      suggestedAcousticCue: 'Calming Double-Pulse Whistle at 16,500 Hz',
      timestamp: new Date().toISOString()
    }
  },
  {
    id: 'separation_anxiety_whine',
    title: 'Separation Anxiety Whine & Paced Cry',
    description: 'Ascending high-pitched harmonic whine between 2,200Hz - 3,800Hz',
    durationSec: 6.0,
    audioSimType: 'separation_whine',
    presetAnalysis: {
      vocalizationType: 'Separation Whine',
      peakFrequencyHz: 2850,
      intensityDb: 64.2,
      urgencyRating: 'Medium',
      emotionalRoot: 'Acute attachment distress and cortisol spike due to owner departure cues (keys jangling, coat).',
      humanTranslation: `"Where did you go?! Don't leave me behind in this quiet room! I feel unsafe without my pack!"`,
      counterConditioningPlan: [
        'Practice 30-second micro-departures without fanfare or dramatic goodbyes.',
        'Leave a frozen peanut-butter KONG or lick-mat 5 minutes prior to leaving.',
        'Broadcast continuous 432Hz delta-wave ambient audio to mask outdoor neighborhood noises.'
      ],
      suggestedAcousticCue: 'Heartbeat Rhythm Pulse at 60 BPM',
      timestamp: new Date().toISOString()
    }
  },
  {
    id: 'play_bow_ruff',
    title: 'Play Solicitation "Boof" & Tail Wag Ruff',
    description: 'Throaty low-mid tonal bark with rising inflection and panting pauses',
    durationSec: 3.2,
    audioSimType: 'play_ruff',
    presetAnalysis: {
      vocalizationType: 'Play Ruff',
      peakFrequencyHz: 820,
      intensityDb: 71.0,
      urgencyRating: 'Low',
      emotionalRoot: 'Pure social play invitation and dopamine surge looking for interactive game.',
      humanTranslation: `"C'mon human! You have been staring at that glowing rectangle all day! Throw the squeaker!"`,
      counterConditioningPlan: [
        'Reward the play request only when the dog transitions into a polite "Sit" first.',
        'Use structured interactive games (flirt pole, hide-and-seek scent puzzles) to burn mental energy.'
      ],
      suggestedAcousticCue: 'Dual Chirp Play Whistle at 12,000 Hz',
      timestamp: new Date().toISOString()
    }
  }
];
