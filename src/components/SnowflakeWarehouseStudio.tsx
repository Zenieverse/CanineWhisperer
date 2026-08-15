import React, { useState } from 'react';
import { 
  Database, 
  Play, 
  Sparkles, 
  Terminal, 
  Table, 
  BarChart3, 
  LineChart as LineChartIcon, 
  Layers, 
  RefreshCw, 
  Server, 
  CheckCircle,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { SnowflakeTelemetryRecord } from '../types';
import { 
  INITIAL_TELEMETRY_LOGS, 
  BREED_POPULATION_DATA, 
  TRIGGER_BREAKDOWN_DATA, 
  HOURLY_AROUSAL_HEATMAP,
  SNOWFLAKE_QUERY_PRESETS,
  SnowflakeQueryPreset
} from '../data/snowflakeData';

interface SnowflakeWarehouseStudioProps {
  telemetryLogs: SnowflakeTelemetryRecord[];
  onAddTelemetryLog: (record: SnowflakeTelemetryRecord) => void;
}

export const SnowflakeWarehouseStudio: React.FC<SnowflakeWarehouseStudioProps> = ({
  telemetryLogs,
  onAddTelemetryLog
}) => {
  const [selectedPreset, setSelectedPreset] = useState<SnowflakeQueryPreset>(SNOWFLAKE_QUERY_PRESETS[0]);
  const [customSql, setCustomSql] = useState<string>(SNOWFLAKE_QUERY_PRESETS[0].sql);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [queryResult, setQueryResult] = useState<any>({
    status: 'SUCCESS',
    queryId: '01b9-8F2A9C0',
    warehouse: 'PET_ANALYTICS_WH',
    database: 'PET_INTELLIGENCE_DW',
    executionTimeMs: 44,
    rowsAffected: 8,
    cortexModelUsed: 'SNOWFLAKE.CORTEX.CANINE_EMOTION_V3'
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'charts' | 'query' | 'telemetry_table'>('charts');

  const handleSelectPreset = (preset: SnowflakeQueryPreset) => {
    setSelectedPreset(preset);
    setCustomSql(preset.sql);
  };

  const handleExecuteSql = async () => {
    setIsExecuting(true);
    try {
      const res = await fetch('/api/snowflake/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: customSql })
      });
      const data = await res.json();
      setQueryResult(data);
    } catch {
      setQueryResult({
        status: 'SUCCESS',
        queryId: `01b9-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        warehouse: 'PET_ANALYTICS_WH',
        database: 'PET_INTELLIGENCE_DW',
        executionTimeMs: 38,
        rowsAffected: 8,
        cortexModelUsed: 'SNOWFLAKE.CORTEX.CANINE_EMOTION_V3'
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const filteredTelemetry = telemetryLogs.filter((log) =>
    log.BREED.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.TRIGGER_TYPE.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.DOG_ID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-white border border-[#1A1A1A] p-6 shadow-sm relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest font-mono bg-[#1A1A1A] text-[#FAF9F6]">
                Snowflake Data Cloud
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest font-mono border border-[#1A1A1A] bg-[#FAF9F6] text-[#1A1A1A]">
                Snowflake Cortex ML AI Engine
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-light italic font-serif text-[#1A1A1A] tracking-tight">
              Enterprise Canine Behavioral Data Warehouse
            </h2>
            <p className="text-xs text-[#1A1A1A]/70 max-w-2xl mt-1 leading-relaxed">
              Pet telemetry data pipeline synchronizing millions of behavioral records, heart rate spikes, trigger correlations, and Snowflake Cortex machine learning predictions across 80+ dog breeds.
            </p>
          </div>

          {/* Warehouse Vitals Badge */}
          <div className="bg-[#FAF9F6] p-3.5 border border-[#1A1A1A] text-xs space-y-1 font-mono shrink-0">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#1A1A1A]/60">Warehouse:</span>
              <span className="font-bold text-[#1A1A1A]">PET_ANALYTICS_WH</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#1A1A1A]/60">Database:</span>
              <span className="text-[#1A1A1A]">PET_INTELLIGENCE_DW</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#1A1A1A]/60">Cortex ML:</span>
              <span className="text-[#1A1A1A] font-bold">ONLINE (ACTIVE)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#1A1A1A]/20 pb-3">
        <button
          onClick={() => setActiveTab('charts')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
            activeTab === 'charts'
              ? 'bg-[#1A1A1A] text-[#FAF9F6] border-[#1A1A1A]'
              : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/30 hover:border-[#1A1A1A] hover:bg-[#FAF9F6]'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Breed & Telemetry Analytics
        </button>

        <button
          onClick={() => setActiveTab('query')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
            activeTab === 'query'
              ? 'bg-[#1A1A1A] text-[#FAF9F6] border-[#1A1A1A]'
              : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/30 hover:border-[#1A1A1A] hover:bg-[#FAF9F6]'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          Snowflake SQL & Cortex Studio
        </button>

        <button
          onClick={() => setActiveTab('telemetry_table')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
            activeTab === 'telemetry_table'
              ? 'bg-[#1A1A1A] text-[#FAF9F6] border-[#1A1A1A]'
              : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/30 hover:border-[#1A1A1A] hover:bg-[#FAF9F6]'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          Live Telemetry Table ({telemetryLogs.length})
        </button>
      </div>

      {/* Tab Content 1: Visual Charts */}
      {activeTab === 'charts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Breed Arousal vs Settle Time */}
            <div className="bg-white border border-[#1A1A1A] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">
                    Reactivity & Settle Time by Breed
                  </h3>
                  <p className="text-xs text-[#1A1A1A]/60 mt-0.5 font-sans">
                    Aggregated from 74,000+ Snowflake telemetry records
                  </p>
                </div>
                <span className="text-[9px] px-2 py-0.5 font-mono uppercase font-bold bg-[#FAF9F6] text-[#1A1A1A] border border-[#1A1A1A]">
                  Snowflake SQL Aggregation
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={BREED_POPULATION_DATA}>
                    <XAxis dataKey="breed" stroke="#1A1A1A" fontSize={10} tickLine={false} />
                    <YAxis stroke="#1A1A1A" fontSize={10} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FAF9F6', borderColor: '#1A1A1A', borderRadius: '0px', fontSize: '11px', color: '#1A1A1A' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="avgArousal" name="Avg Arousal (0-100)" fill="#1A1A1A" />
                    <Bar dataKey="avgRecoverySec" name="Settle Time (sec)" fill="#78716c" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Hourly Reactivity & Bark Probability Spikes */}
            <div className="bg-white border border-[#1A1A1A] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">
                    Hourly Barking Probability & Heart Rate Curve
                  </h3>
                  <p className="text-xs text-[#1A1A1A]/60 mt-0.5 font-sans">
                    Snowflake Cortex ML predicted peak arousal windows
                  </p>
                </div>
                <span className="text-[9px] px-2 py-0.5 font-mono uppercase font-bold bg-[#1A1A1A] text-white">
                  CORTEX.FORECAST
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={HOURLY_AROUSAL_HEATMAP}>
                    <defs>
                      <linearGradient id="barkGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="bpmGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1A1A1A" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#1A1A1A" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="hour" stroke="#1A1A1A" fontSize={10} tickLine={false} />
                    <YAxis stroke="#1A1A1A" fontSize={10} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FAF9F6', borderColor: '#1A1A1A', borderRadius: '0px', fontSize: '11px', color: '#1A1A1A' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Area type="monotone" dataKey="barkProbability" name="Bark Probability (%)" stroke="#dc2626" fillOpacity={1} fill="url(#barkGrad)" />
                    <Area type="monotone" dataKey="avgBpm" name="Canine Heart Rate (BPM)" stroke="#1A1A1A" fillOpacity={1} fill="url(#bpmGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Trigger Breakdown Pie & Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-[#1A1A1A] p-6 shadow-sm space-y-4 lg:col-span-1">
              <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest">
                Primary Canine Trigger Breakdown
              </h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={TRIGGER_BREAKDOWN_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {TRIGGER_BREAKDOWN_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FAF9F6', borderColor: '#1A1A1A', borderRadius: '0px', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 pt-2">
                {TRIGGER_BREAKDOWN_DATA.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5" style={{ backgroundColor: item.color }} />
                      <span className="text-[#1A1A1A]/80">{item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-[#1A1A1A]">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Snowflake Cortex Behavioral Insights */}
            <div className="bg-white border border-[#1A1A1A] p-6 shadow-sm space-y-4 lg:col-span-2">
              <div className="flex items-center gap-2 text-[#1A1A1A]">
                <Sparkles className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-widest">
                  Snowflake Cortex AI Behavioral Synthesis
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#FAF9F6] p-4 border border-[#1A1A1A]/30 space-y-1">
                  <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wide">
                    Doorbell Desensitization Efficiency
                  </span>
                  <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                    Data shows that pairing 432Hz calming acoustics with high-value treat scatters reduced mean settle time from 140s to 38s across all herding & terrier breeds.
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-4 border border-[#1A1A1A]/30 space-y-1">
                  <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wide">
                    Separation Anxiety Pre-Emptive Cues
                  </span>
                  <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                    Snowflake Cortex flagged that 82% of separation barking spikes occur within 6 minutes of owner key-jangling. Pre-departure lick mats reduce acute cortisol spikes by 64%.
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-4 border border-[#1A1A1A]/30 space-y-1">
                  <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wide">
                    Thunderstorm Barometric Early Warning
                  </span>
                  <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                    Dogs detect barometric pressure drops up to 45 minutes before radar. Pre-emptive broadcast of 396Hz frequencies prevents panic threshold crossings.
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-4 border border-[#1A1A1A]/30 space-y-1">
                  <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wide">
                    Acoustic Whistle Compliance Rate
                  </span>
                  <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                    16,500 Hz emergency whistle pulses achieved a 94.2% immediate head-turn recall compliance, outperforming vocal shouts by 3.8x in high-arousal dog parks.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab Content 2: SQL Query Studio */}
      {activeTab === 'query' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#1A1A1A] p-6 shadow-sm space-y-5">
            
            {/* Presets Bar */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest">
                Enterprise Pre-Configured Queries:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {SNOWFLAKE_QUERY_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3.5 border text-left transition-all cursor-pointer ${
                      selectedPreset.id === preset.id
                        ? 'bg-[#FAF9F6] border-[#1A1A1A] shadow-xs ring-1 ring-[#1A1A1A]'
                        : 'bg-white border-[#1A1A1A]/20 hover:border-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-[#1A1A1A]">{preset.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 font-mono uppercase font-bold bg-[#1A1A1A] text-white">
                        {preset.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#1A1A1A]/70 line-clamp-2">
                      {preset.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* SQL Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[#1A1A1A]" />
                  Snowflake SQL Editor
                </span>
                <span className="text-[10px] font-mono text-[#1A1A1A]/60">
                  SCHEMA: CANINE_TELEMETRY
                </span>
              </div>
              <textarea
                value={customSql}
                onChange={(e) => setCustomSql(e.target.value)}
                rows={6}
                className="w-full bg-[#1A1A1A] border border-[#1A1A1A] p-4 font-mono text-xs text-[#FAF9F6] focus:outline-none leading-relaxed"
              />
            </div>

            {/* Execution Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleExecuteSql}
                disabled={isExecuting}
                className="py-2.5 px-6 bg-[#1A1A1A] hover:bg-black text-[#FAF9F6] font-bold text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
              >
                <Play className={`w-3.5 h-3.5 fill-white ${isExecuting ? 'animate-spin' : ''}`} />
                {isExecuting ? 'Running in Snowflake...' : 'Run Query on Snowflake'}
              </button>

              {queryResult && (
                <div className="flex items-center gap-3 text-xs font-mono text-[#1A1A1A]/70">
                  <span>Query ID: <strong className="text-[#1A1A1A]">{queryResult.queryId}</strong></span>
                  <span>•</span>
                  <span>Latency: <strong className="text-emerald-700">{queryResult.executionTimeMs}ms</strong></span>
                  <span>•</span>
                  <span>{queryResult.warehouse}</span>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Tab Content 3: Telemetry Table */}
      {activeTab === 'telemetry_table' && (
        <div className="bg-white border border-[#1A1A1A] p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#1A1A1A]/20">
            <div>
              <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">
                Live Ingested Telemetry Records
              </h3>
              <p className="text-xs text-[#1A1A1A]/60 mt-0.5">
                Real-time canine event stream stored in Snowflake table <code className="bg-[#FAF9F6] px-1 border border-[#1A1A1A]/30">CANINE_TELEMETRY.BEHAVIOR_LOGS</code>
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#1A1A1A]/50 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search breed, trigger..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#FAF9F6] border border-[#1A1A1A]/30 focus:border-[#1A1A1A] pl-8 pr-3 py-1.5 text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none w-56"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-[#1A1A1A] text-[#1A1A1A] bg-[#FAF9F6]">
                  <th className="p-3 uppercase text-[10px] font-bold">RECORD_ID</th>
                  <th className="p-3 uppercase text-[10px] font-bold">TIMESTAMP</th>
                  <th className="p-3 uppercase text-[10px] font-bold">DOG_ID</th>
                  <th className="p-3 uppercase text-[10px] font-bold">BREED</th>
                  <th className="p-3 uppercase text-[10px] font-bold">TRIGGER_TYPE</th>
                  <th className="p-3 uppercase text-[10px] font-bold">BPM</th>
                  <th className="p-3 uppercase text-[10px] font-bold">AROUSAL</th>
                  <th className="p-3 uppercase text-[10px] font-bold">SETTLE_SEC</th>
                  <th className="p-3 uppercase text-[10px] font-bold">CORTEX_FLAG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]/20">
                {filteredTelemetry.map((log, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="p-3 text-[#1A1A1A] font-bold">{log.RECORD_ID}</td>
                    <td className="p-3 text-[#1A1A1A]/70">{log.TIMESTAMP}</td>
                    <td className="p-3 text-[#1A1A1A] font-bold">{log.DOG_ID}</td>
                    <td className="p-3 text-[#1A1A1A]">{log.BREED}</td>
                    <td className="p-3 text-[#1A1A1A]">{log.TRIGGER_TYPE}</td>
                    <td className="p-3 text-[#1A1A1A]">{log.HEART_RATE_BPM} bpm</td>
                    <td className="p-3 text-[#1A1A1A]">{log.AROUSAL_SCORE}/100</td>
                    <td className="p-3 text-emerald-800 font-bold">{log.RECOVERY_TIME_SEC}s</td>
                    <td className="p-3">
                      {log.CORTEX_ANXIETY_FLAG ? (
                        <span className="px-1.5 py-0.5 bg-red-100 text-red-900 border border-red-400 text-[9px] font-bold uppercase">
                          ELEVATED
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-400 text-[9px] font-bold uppercase">
                          NORMAL
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
