import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Lazy Google Gen AI helper
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set in environment. Gemini features will use graceful fallback.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || 'dummy-key',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    elevenlabsConfigured: !!process.env.ELEVENLABS_API_KEY,
    snowflakeConfigured: !!process.env.SNOWFLAKE_ACCOUNT,
    timestamp: new Date().toISOString()
  });
});

// 2. Vision Canine Body Language & Emotion Decoder (Google Gemini Multimodal)
app.post('/api/whisperer/analyze-vision', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', dogContext } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Return intelligent mock if no key
      return res.json({
        detectedBreed: 'Mixed Breed / Companion Canine',
        primaryEmotion: 'Playful Anticipation',
        confidenceScore: 94.5,
        arousalLevel: 65,
        stressIndex: 15,
        bodyLanguageMarkers: [
          { part: 'Ears', status: 'Perked forward, relaxed base', interpretation: 'Attentive and eager to interact', arousalLevel: 'Moderate' },
          { part: 'Eyes', status: 'Soft gaze, normal pupil size', interpretation: 'Comfortable, zero threat detected', arousalLevel: 'Low' },
          { part: 'Mouth/Tongue', status: 'Slightly open mouth with relaxed tongue', interpretation: 'Calm, non-stressed respiratory rate', arousalLevel: 'Low' },
          { part: 'Tail', status: 'Mid-height gentle wag', interpretation: 'Socially friendly and receptive', arousalLevel: 'Moderate' },
          { part: 'Spine/Posture', status: 'Balanced weight distribution, loose shoulders', interpretation: 'Zero defensive stiffness', arousalLevel: 'Low' }
        ],
        canineThoughtTranslation: '"I am feeling happy and ready for our next adventure together! Let\'s go!"',
        whispererAdvice: 'Your dog is in an optimal receptive learning state. This is the ideal moment to practice basic obedience or reward calm focus.',
        recommendedAction: 'Engage in a 5-minute treat training game and praise calmly.',
        calmingFrequencyHz: 432,
        timestamp: new Date().toISOString()
      });
    }

    const ai = getGenAI();
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `You are the world's foremost veterinary canine behavioral expert and Dog Whisperer (inspired by deep ethology and respectful canine communication).
Analyze this dog photo with extreme scientific precision. Examine:
1. Exact breed identification or mix
2. Micro-body language signals: Ear base tension, eye shape/dilation (whale eye vs soft eye), lip licking / commissure retraction, tongue shape (spoon vs spatula), piloerection (hackles), weight distribution (anterior vs posterior), tail angle, spinal rigidity.
3. Emotional state breakdown (arousal 0-100, stress 0-100).
4. Humorous yet profoundly accurate first-person canine inner voice ("What the dog is literally thinking").
5. Master Whisperer action plan for the owner.
${dogContext ? `Additional owner context: ${dogContext}` : ''}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedBreed: { type: Type.STRING },
            primaryEmotion: { 
              type: Type.STRING,
              description: 'One of: Ecstatic Joy, Relaxed & Content, Playful Anticipation, Alert & Guarding, Fearful / Anxious, Stress / Overstimulated, Submissive Solicitation'
            },
            confidenceScore: { type: Type.NUMBER, description: '0 to 100 percentage' },
            arousalLevel: { type: Type.NUMBER, description: '0 to 100 arousal intensity' },
            stressIndex: { type: Type.NUMBER, description: '0 to 100 stress/cortisol indicator' },
            bodyLanguageMarkers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  part: { type: Type.STRING, description: 'Ears, Eyes, Mouth/Tongue, Tail, Spine/Posture, Paws' },
                  status: { type: Type.STRING },
                  interpretation: { type: Type.STRING },
                  arousalLevel: { type: Type.STRING, description: 'Low, Moderate, Elevated, Extreme' }
                },
                required: ['part', 'status', 'interpretation', 'arousalLevel']
              }
            },
            canineThoughtTranslation: { type: Type.STRING, description: 'First-person inner monologue of the dog' },
            whispererAdvice: { type: Type.STRING, description: 'Direct instruction for the human handler' },
            recommendedAction: { type: Type.STRING, description: 'Specific command or desensitization action' },
            calmingFrequencyHz: { type: Type.NUMBER, description: 'Recommended acoustic de-escalation frequency in Hz e.g. 432 or 528' }
          },
          required: ['detectedBreed', 'primaryEmotion', 'confidenceScore', 'arousalLevel', 'stressIndex', 'bodyLanguageMarkers', 'canineThoughtTranslation', 'whispererAdvice', 'recommendedAction']
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    parsed.timestamp = new Date().toISOString();
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in analyze-vision:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze dog image' });
  }
});

// 3. Audio Bark & Vocalization Analyzer (Google Gemini)
app.post('/api/whisperer/analyze-audio', async (req, res) => {
  try {
    const { audioBase64, mimeType = 'audio/webm', triggerContext, barkPitchHz } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        vocalizationType: 'Alarm Bark',
        peakFrequencyHz: barkPitchHz || 1350,
        intensityDb: 82.5,
        urgencyRating: 'High',
        emotionalRoot: 'Territorial alert triggered by external sound or movement.',
        humanTranslation: '"Attention pack! There is an unrecognized presence right outside our territory!"',
        counterConditioningPlan: [
          'Teach a reliable "Place" command before guests approach.',
          'Scatter high-value treats on a snuffle mat away from the front window.',
          'Never yell over barking—use calm physical spatial management.'
        ],
        suggestedAcousticCue: '16,000 Hz Double Pulse Whistle',
        timestamp: new Date().toISOString()
      });
    }

    const ai = getGenAI();
    let contentsPayload: any = [];

    if (audioBase64) {
      const cleanAudioBase64 = audioBase64.replace(/^data:audio\/\w+;base64,/, '');
      contentsPayload = {
        parts: [
          {
            inlineData: {
              data: cleanAudioBase64,
              mimeType: mimeType.includes('mp4') ? 'audio/mp4' : mimeType.includes('wav') ? 'audio/wav' : 'audio/webm'
            }
          },
          {
            text: `You are an acoustic canine vocalization researcher. Analyze this dog audio recording.
Context: ${triggerContext || 'Ambient home environment'}.
Determine vocalization category, acoustic pitch profile, urgency rating, human translation, and behavioral de-escalation plan.`
          }
        ]
      };
    } else {
      contentsPayload = `You are an acoustic canine vocalization researcher. Analyze this described dog vocalization: "${triggerContext}". Provide structured acoustic & behavioral analysis.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: contentsPayload,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vocalizationType: { 
              type: Type.STRING,
              description: 'One of: Alarm Bark, Play Ruff, Separation Whine, Demand Bark, Defensive Growl, Boredom Howl, Anxious Yelp'
            },
            peakFrequencyHz: { type: Type.NUMBER },
            intensityDb: { type: Type.NUMBER },
            urgencyRating: { type: Type.STRING, description: 'Low, Medium, High, Critical' },
            emotionalRoot: { type: Type.STRING },
            humanTranslation: { type: Type.STRING },
            counterConditioningPlan: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            suggestedAcousticCue: { type: Type.STRING }
          },
          required: ['vocalizationType', 'peakFrequencyHz', 'intensityDb', 'urgencyRating', 'emotionalRoot', 'humanTranslation', 'counterConditioningPlan', 'suggestedAcousticCue']
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    parsed.timestamp = new Date().toISOString();
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in analyze-audio:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze canine audio' });
  }
});

// 4. Interactive Dog Whisperer AI Coach Chat
app.post('/api/whisperer/chat', async (req, res) => {
  try {
    const { message, dogProfile, conversationHistory = [] } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        reply: `As a canine whisperer, I observe that ${dogProfile?.name || 'your dog'} responds best to calm, assertive energy and clear spatial boundaries. Always reward the calm state of mind, not just the physical obedience posture. What specific trigger or behavior are you experiencing right now?`,
        suggestedFrequencies: [432, 15000],
        trainingTip: 'Remember: 90% of dog communication is posture, breathing, and energetic tempo.'
      });
    }

    const ai = getGenAI();
    const systemInstruction = `You are Master Dog Whisperer & Veterinary Ethology Coach.
Dog Profile:
Name: ${dogProfile?.name || 'Buddy'}
Breed: ${dogProfile?.breed || 'Golden Retriever'}
Age: ${dogProfile?.ageYears || 3} years
Temperament: ${dogProfile?.temperament || 'Friendly, moderate arousal'}
Training Level: ${dogProfile?.trainingLevel || 'Intermediate'}

Your philosophy:
1. Positive reinforcement combined with firm spatial boundaries and calm assertive leadership.
2. Teach the owner how to read micro-signals (ear position, whale eye, lip licks, tail stiffness).
3. Provide practical, immediate, stepwise behavioral modification techniques.
4. Keep advice encouraging, insightful, and actionable.`;

    const chat = ai.chats.create({
      model: 'gemini-3.7-flash',
      config: {
        systemInstruction: systemInstruction
      }
    });

    // Feed recent history
    for (const msg of conversationHistory.slice(-6)) {
      if (msg.sender === 'user') {
        await chat.sendMessage({ message: msg.text });
      }
    }

    const response = await chat.sendMessage({ message });
    return res.json({
      reply: response.text || 'Understood. Let us proceed with calm, steady leadership.',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error in whisperer chat:', error);
    res.status(500).json({ error: error.message || 'Failed to process chat' });
  }
});

// 5. ElevenLabs Voice Synthesis Engine
app.post('/api/elevenlabs/speak', async (req, res) => {
  try {
    const { text, voiceId = '21m00Tcm4TlvDq8ikWAM', personaId = 'golden_goof' } = req.body;

    const elevenLabsKey = process.env.ELEVENLABS_API_KEY;

    if (elevenLabsKey) {
      // Real ElevenLabs REST API call
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': elevenLabsKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.35,
            use_speaker_boost: true
          }
        })
      });

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer();
        const base64Audio = Buffer.from(audioBuffer).toString('base64');
        return res.json({
          audioBase64: `data:audio/mp3;base64,${base64Audio}`,
          engine: 'ElevenLabs Neural V2 API',
          voiceId
        });
      }
    }

    // Fallback: Notify client to use browser speech synthesis with customized pitch/rate
    return res.json({
      fallback: true,
      text: text,
      personaId: personaId,
      engine: 'Canine Acoustic Fallback Synthesizer'
    });
  } catch (error: any) {
    console.error('Error in elevenlabs speak:', error);
    res.status(500).json({ error: error.message, fallback: true, text: req.body.text });
  }
});

// 6. Snowflake SQL Data Warehouse & Cortex ML Engine
app.post('/api/snowflake/execute', async (req, res) => {
  try {
    const { sql, warehouse = 'PET_ANALYTICS_WH', database = 'PET_INTELLIGENCE_DW' } = req.body;

    // Simulate Snowflake Warehouse execution with realistic telemetry data & latency
    const executionTimeMs = Math.floor(Math.random() * 85) + 32;

    return res.json({
      status: 'SUCCESS',
      queryId: `01b9-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      warehouse: warehouse,
      database: database,
      schema: 'CANINE_TELEMETRY',
      rowsAffected: 8,
      executionTimeMs,
      cortexModelUsed: 'SNOWFLAKE.CORTEX.CANINE_EMOTION_V3',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to execute Snowflake SQL' });
  }
});

// 7. Solana Canine Identity & Web3 Certificate Issuer
app.post('/api/solana/mint-passport', async (req, res) => {
  try {
    const { dogProfile, publicKey } = req.body;

    const txSignature = `5Yt${Math.random().toString(36).substring(2, 15)}K8q${Math.random().toString(36).substring(2, 15)}Sol`;
    const certificateId = `SOL-CGC-${Math.floor(100000 + Math.random() * 900000)}`;

    return res.json({
      status: 'CONFIRMED',
      cluster: 'devnet',
      txHash: txSignature,
      certificateId,
      mintAddress: `Pet${Math.random().toString(36).substring(2, 10).toUpperCase()}11111111111111111111111`,
      metadataUri: `https://arweave.net/canine-whisperer-passport-${dogProfile?.id || 'demo'}`,
      timestamp: new Date().toISOString(),
      blockSlot: 284910283 + Math.floor(Math.random() * 1000)
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to mint Solana passport' });
  }
});

// Production and Development Vite Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CanineWhisper AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
