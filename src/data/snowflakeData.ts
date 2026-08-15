import { SnowflakeTelemetryRecord } from '../types';

export const INITIAL_TELEMETRY_LOGS: SnowflakeTelemetryRecord[] = [
  {
    RECORD_ID: 'REC-SF-88912',
    TIMESTAMP: '2026-08-14 19:45:12',
    DOG_ID: 'DOG-772-GOLDEN',
    BREED: 'Golden Retriever',
    AGE_GROUP: 'Young Adult (2-4y)',
    TRIGGER_TYPE: 'Doorbell / Guest Arrival',
    HEART_RATE_BPM: 138,
    AROUSAL_SCORE: 84,
    DECIBEL_PEAK: 86.2,
    INTERVENTION_APPLIED: 'Place Command + High-Val Reward',
    RECOVERY_TIME_SEC: 42,
    CORTEX_ANXIETY_FLAG: false
  },
  {
    RECORD_ID: 'REC-SF-88913',
    TIMESTAMP: '2026-08-14 18:22:04',
    DOG_ID: 'DOG-419-CORGI',
    BREED: 'Pembroke Welsh Corgi',
    AGE_GROUP: 'Adult (4-7y)',
    TRIGGER_TYPE: 'Thunderstorm Barometric Drop',
    HEART_RATE_BPM: 162,
    AROUSAL_SCORE: 92,
    DECIBEL_PEAK: 68.5,
    INTERVENTION_APPLIED: '432Hz Calming Frequency + Snug Wrap',
    RECOVERY_TIME_SEC: 180,
    CORTEX_ANXIETY_FLAG: true
  },
  {
    RECORD_ID: 'REC-SF-88914',
    TIMESTAMP: '2026-08-14 17:10:55',
    DOG_ID: 'DOG-108-SHEPHERD',
    BREED: 'German Shepherd',
    AGE_GROUP: 'Adult (4-7y)',
    TRIGGER_TYPE: 'Mail Delivery Perimeter Notice',
    HEART_RATE_BPM: 145,
    AROUSAL_SCORE: 79,
    DECIBEL_PEAK: 89.1,
    INTERVENTION_APPLIED: 'Acoustic Whistle De-escalation',
    RECOVERY_TIME_SEC: 35,
    CORTEX_ANXIETY_FLAG: false
  },
  {
    RECORD_ID: 'REC-SF-88915',
    TIMESTAMP: '2026-08-14 15:30:18',
    DOG_ID: 'DOG-552-FRENCHIE',
    BREED: 'French Bulldog',
    AGE_GROUP: 'Puppy (6-12m)',
    TRIGGER_TYPE: 'Owner Departure (Keys/Coat)',
    HEART_RATE_BPM: 154,
    AROUSAL_SCORE: 88,
    DECIBEL_PEAK: 74.8,
    INTERVENTION_APPLIED: 'Lick Mat + Frozen Peanut Butter',
    RECOVERY_TIME_SEC: 125,
    CORTEX_ANXIETY_FLAG: true
  },
  {
    RECORD_ID: 'REC-SF-88916',
    TIMESTAMP: '2026-08-14 14:02:40',
    DOG_ID: 'DOG-901-HUSKY',
    BREED: 'Siberian Husky',
    AGE_GROUP: 'Young Adult (2-4y)',
    TRIGGER_TYPE: 'Boredom / Vocal Solicitation',
    HEART_RATE_BPM: 110,
    AROUSAL_SCORE: 65,
    DECIBEL_PEAK: 82.0,
    INTERVENTION_APPLIED: 'Mental Puzzle Toy / Sniff Walk',
    RECOVERY_TIME_SEC: 50,
    CORTEX_ANXIETY_FLAG: false
  },
  {
    RECORD_ID: 'REC-SF-88917',
    TIMESTAMP: '2026-08-14 12:15:33',
    DOG_ID: 'DOG-331-POODLE',
    BREED: 'Standard Poodle',
    AGE_GROUP: 'Senior (8y+)',
    TRIGGER_TYPE: 'Sudden Loud Construction Sound',
    HEART_RATE_BPM: 148,
    AROUSAL_SCORE: 76,
    DECIBEL_PEAK: 78.4,
    INTERVENTION_APPLIED: 'White Noise Generator + Calm Touch',
    RECOVERY_TIME_SEC: 95,
    CORTEX_ANXIETY_FLAG: true
  }
];

export const BREED_POPULATION_DATA = [
  { breed: 'Golden Retriever', avgArousal: 58, avgRecoverySec: 45, soundSensitivity: 42, separationScore: 65, sampleCount: 14200 },
  { breed: 'German Shepherd', avgArousal: 78, avgRecoverySec: 38, soundSensitivity: 72, separationScore: 54, sampleCount: 11850 },
  { breed: 'French Bulldog', avgArousal: 66, avgRecoverySec: 90, soundSensitivity: 48, separationScore: 82, sampleCount: 9600 },
  { breed: 'Welsh Corgi', avgArousal: 74, avgRecoverySec: 85, soundSensitivity: 79, separationScore: 68, sampleCount: 7400 },
  { breed: 'Siberian Husky', avgArousal: 72, avgRecoverySec: 52, soundSensitivity: 60, separationScore: 78, sampleCount: 8100 },
  { breed: 'Standard Poodle', avgArousal: 50, avgRecoverySec: 40, soundSensitivity: 55, separationScore: 50, sampleCount: 6900 },
  { breed: 'Border Collie', avgArousal: 86, avgRecoverySec: 32, soundSensitivity: 88, separationScore: 70, sampleCount: 8900 },
  { breed: 'Labrador Retriever', avgArousal: 54, avgRecoverySec: 42, soundSensitivity: 38, separationScore: 60, sampleCount: 16400 }
];

export const TRIGGER_BREAKDOWN_DATA = [
  { name: 'Doorbell / Knocking', value: 34, color: '#f59e0b' },
  { name: 'Separation (Owner Exit)', value: 26, color: '#ef4444' },
  { name: 'Thunder / Fireworks', value: 18, color: '#8b5cf6' },
  { name: 'Passing Dogs on Leash', value: 14, color: '#3b82f6' },
  { name: 'Boredom Vocalization', value: 8, color: '#10b981' }
];

export const HOURLY_AROUSAL_HEATMAP = [
  { hour: '06:00', avgBpm: 82, barkProbability: 12 },
  { hour: '08:00', avgBpm: 128, barkProbability: 68 }, // Morning walk/commute
  { hour: '10:00', avgBpm: 94, barkProbability: 24 },
  { hour: '12:00', avgBpm: 105, barkProbability: 38 }, // Mail/delivery time
  { hour: '14:00', avgBpm: 88, barkProbability: 18 },
  { hour: '17:30', avgBpm: 142, barkProbability: 75 }, // Owner return excitement
  { hour: '19:30', avgBpm: 112, barkProbability: 40 },
  { hour: '22:00', avgBpm: 76, barkProbability: 8 }
];

export interface SnowflakeQueryPreset {
  id: string;
  name: string;
  category: 'Telemetry Aggregation' | 'Predictive Cortex ML' | 'Breed Behavioral Benchmarks';
  sql: string;
  description: string;
  badge: string;
}

export const SNOWFLAKE_QUERY_PRESETS: SnowflakeQueryPreset[] = [
  {
    id: 'q1_breed_anxiety',
    name: 'Breed De-escalation & Recovery Efficiency',
    category: 'Breed Behavioral Benchmarks',
    badge: 'FAST CLUSTER',
    description: 'Calculates the average recovery time and sound sensitivity index grouped by canine breed category.',
    sql: `SELECT 
    breed,
    COUNT(*) AS total_telemetry_events,
    ROUND(AVG(arousal_score), 2) AS avg_arousal_index,
    ROUND(AVG(recovery_time_sec), 1) AS avg_recovery_seconds,
    ROUND(AVG(decibel_peak), 1) AS avg_bark_decibels,
    COUNT(CASE WHEN cortex_anxiety_flag = TRUE THEN 1 END) AS high_anxiety_clusters
FROM CANINE_TELEMETRY.BEHAVIOR_LOGS
WHERE timestamp >= DATEADD('day', -30, CURRENT_TIMESTAMP())
GROUP BY breed
ORDER BY avg_arousal_index DESC;`
  },
  {
    id: 'q2_cortex_ai_triggers',
    name: 'Snowflake Cortex AI: Predicted Barking Surges',
    category: 'Predictive Cortex ML',
    badge: 'SNOWFLAKE CORTEX',
    description: 'Uses Snowflake Cortex ML functions (SNOWFLAKE.CORTEX.FORECAST & CLASSIFY) to predict high reactivity windows based on weather & time.',
    sql: `WITH TriggerAgg AS (
    SELECT 
        trigger_type,
        COUNT(*) AS occurrence_count,
        ROUND(AVG(heart_rate_bpm), 1) AS peak_bpm,
        SNOWFLAKE.CORTEX.SENTIMENT(intervention_applied) AS owner_compliance_sentiment
    FROM CANINE_TELEMETRY.BEHAVIOR_LOGS
    GROUP BY trigger_type
)
SELECT 
    trigger_type,
    occurrence_count,
    peak_bpm,
    ROUND(occurrence_count * 100.0 / SUM(occurrence_count) OVER(), 1) AS share_pct
FROM TriggerAgg
ORDER BY occurrence_count DESC;`
  },
  {
    id: 'q3_intervention_efficacy',
    name: 'Whisperer Intervention Success Matrix',
    category: 'Telemetry Aggregation',
    badge: 'ANALYTICS',
    description: 'Measures how effective acoustic whistle vs place command vs calming frequencies were at reducing canine heart rate and cortisol.',
    sql: `SELECT 
    intervention_applied,
    COUNT(*) AS times_administered,
    ROUND(AVG(recovery_time_sec), 2) AS mean_settle_sec,
    MIN(recovery_time_sec) AS fastest_calm_sec,
    ROUND(AVG(arousal_score) - 30.5, 1) AS delta_calm_score
FROM CANINE_TELEMETRY.BEHAVIOR_LOGS
GROUP BY intervention_applied
ORDER BY mean_settle_sec ASC;`
  }
];
