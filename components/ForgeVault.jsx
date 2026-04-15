import React from 'react';

/**
 * QUANTUM PI FORGE VAULT
 * Autonomous Live Liquidity Dashboard Component
 * 
 * This component consumes data directly from your local sovereign sentinel.
 * No external APIs. No third party trackers. 100% self-hosted.
 * 
 * Data is updated autonomously every 4 hours by forge_rebalancer_sentinel.py
 * Data source: src/data/vault.json
 */

const ForgeVault = ({ vaultData }) => {
  // Autonomous Sentinel Data Structure
  // {
  //   tvl: "1,240,000",
  //   oinioPrice: "0.042",
  //   liquidityDepth: "27,450,000",
  //   rebalanceStatus: "Optimized",
  //   lastSync: "14:02 UTC",
  //   blockHeight: 12745892
  // }

  return (
    <section className="p-8 bg-zinc-950 border-t border-b border-emerald-500/20">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-6">
          <h3 className="text-xs uppercase tracking-[0.3em] text-emerald-600/70 mb-1">
            Sovereign Value Engine
          </h3>
          <h2 className="text-xl font-black text-zinc-200">FORGE VAULT</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* METRIC 1: TOTAL VALUE FORGED */}
          <div className="group p-6 bg-gradient-to-br from-zinc-900 to-black border border-emerald-900/50 rounded-lg transition-all duration-300 hover:border-emerald-500/40">
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-500/60 mb-2">
              Total Value Forged
            </p>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-emerald-400 font-mono">
                ${vaultData.tvl}
              </span>
              <span className="text-xs text-emerald-700">USD</span>
            </div>
            <div className="mt-4 h-1 w-full bg-emerald-950 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[65%] shadow-[0_0_10px_#10b981]"></div>
            </div>
            <p className="mt-2 text-[9px] text-zinc-600 font-mono">
              Block: {vaultData.blockHeight}
            </p>
          </div>

          {/* METRIC 2: LIQUIDITY PULSE */}
          <div className="p-6 bg-zinc-900/30 border border-emerald-900/30 rounded-lg">
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-500/60 mb-2">
              Liquidity Pulse
            </p>
            <div className="text-2xl font-mono text-zinc-300">
              1 OINIO = <span className="text-emerald-400">{vaultData.oinioPrice} A0GI</span>
            </div>
            <div className="mt-2 text-sm font-mono text-zinc-400">
              {vaultData.liquidityDepth} OINIO Locked
            </div>
            <p className="text-[10px] text-zinc-600 mt-3 font-mono italic">
              Source: 0G Aristotle Uniswap-V2 Fork
            </p>
          </div>

          {/* METRIC 3: SENTINEL STATUS */}
          <div className="p-6 bg-zinc-900/30 border border-emerald-900/30 rounded-lg flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-500/60">
                Sentinel Status
              </p>
              <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {vaultData.rebalanceStatus}
              </span>
            </div>
            
            <div className="mt-6 space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <code className="text-[10px] text-zinc-500">
                  Last Reconcile: {vaultData.lastSync}
                </code>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ForgeVault;