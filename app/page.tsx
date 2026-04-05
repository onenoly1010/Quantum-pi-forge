'use client';

import { useEffect, useState } from 'react';

interface ResonanceData {
  blockHeight: number;
  blockHex: string;
  systemBirth: string;
  coherenceHours: number;
  network: string;
  chainId: number;
  timestamp: string;
}

function StewardStatus() {
  const [data, setData] = useState<ResonanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResonance() {
      try {
        const response = await fetch('/api/resonance');
        if (!response.ok) throw new Error('Failed to fetch resonance');
        const json = await response.json() as ResonanceData;
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchResonance();
    // Refresh every 30 seconds
    const interval = setInterval(fetchResonance, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="mt-8 p-6 bg-gray-900/50 rounded-lg border border-gray-700">
        <div className="animate-pulse flex items-center gap-2">
          <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
          <span className="text-cyan-400 font-mono">Initializing Steward Protocol...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-6 bg-red-900/20 rounded-lg border border-red-700">
        <p className="text-red-400 font-mono text-sm">Steward Error: {error}</p>
      </div>
    );
  }

  if (!data) return null;

  const coherencePercent = Math.min(100, (data.coherenceHours / 168) * 100); // 168 hours = 1 week

  return (
    <div className="mt-8 p-6 bg-gray-900/50 rounded-lg border border-cyan-500/30">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
        <h2 className="text-lg font-bold text-cyan-400 font-mono">Steward Status</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <p className="text-xs text-gray-400 font-mono uppercase mb-1">0G Block Height</p>
          <p className="text-2xl font-bold text-white font-mono">{data.blockHeight.toLocaleString()}</p>
          <p className="text-xs text-gray-500 font-mono mt-1">{data.blockHex}</p>
        </div>

        <div className="p-4 bg-gray-800/50 rounded-lg">
          <p className="text-xs text-gray-400 font-mono uppercase mb-1">System Coherence</p>
          <p className="text-2xl font-bold text-green-400 font-mono">{data.coherenceHours}h</p>
          <div className="w-full h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-green-500 transition-all duration-500"
              style={{ width: `${coherencePercent}%` }}
            ></div>
          </div>
        </div>

        <div className="p-4 bg-gray-800/50 rounded-lg">
          <p className="text-xs text-gray-400 font-mono uppercase mb-1">Network</p>
          <p className="text-lg font-bold text-purple-400 font-mono">{data.network}</p>
          <p className="text-xs text-gray-500 font-mono mt-1">Chain ID: {data.chainId}</p>
        </div>

        <div className="p-4 bg-gray-800/50 rounded-lg">
          <p className="text-xs text-gray-400 font-mono uppercase mb-1">System Birth</p>
          <p className="text-lg font-bold text-yellow-400 font-mono">{new Date(data.systemBirth).toLocaleDateString()}</p>
          <p className="text-xs text-gray-500 font-mono mt-1">{new Date(data.systemBirth).toLocaleTimeString()}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500 font-mono">
          Last sync: {new Date(data.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen p-8 md:p-24 bg-gray-950">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Quantum Pi Forge
          </h1>
          <p className="text-lg text-gray-400">
            Sovereign AI Governance and DeFi Protocol
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-6 bg-gray-900/50 rounded-lg border border-purple-500/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-purple-400 font-mono text-sm">Interaction Layer</span>
            </div>
            <p className="text-white font-mono">Cloudflare Pages</p>
            <p className="text-xs text-gray-500 mt-1">Global edge deployment</p>
          </div>

          <div className="p-6 bg-gray-900/50 rounded-lg border border-cyan-500/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span className="text-cyan-400 font-mono text-sm">Intelligence Layer</span>
            </div>
            <p className="text-white font-mono">0G Aristotle</p>
            <p className="text-xs text-gray-500 mt-1">Live blockchain heartbeat</p>
          </div>

          <div className="p-6 bg-gray-900/50 rounded-lg border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400 font-mono text-sm">Memory Layer</span>
            </div>
            <p className="text-white font-mono">Workers KV</p>
            <p className="text-xs text-gray-500 mt-1">Soul metadata binding</p>
          </div>
        </div>

        <StewardStatus />
      </div>
    </main>
  );
}