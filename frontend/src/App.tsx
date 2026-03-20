import React from 'react';
import TreasuryWidget from './components/Treasury/TreasuryWidget';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🌌 Quantum Pi Forge Dashboard</h1>
        <p className="tagline">Sovereign Treasury & Multi-Chain Analytics</p>
      </header>

      <main className="app-main">
        <section className="dashboard-section">
          <TreasuryWidget 
            polygonRpc="https://polygon-rpc.com"
            aristotleRpc="https://rpc.aristotle.0g.ai"
            treasuryAddresses={{
              polygon: "0x742d35Cc6634C0532925a3b8B9C4A1d3F1a8b1c2",
              aristotle: "" // Will be updated after Aristotle deployment
            }}
            refreshInterval={300000}
          />
        </section>

        <section className="info-section">
          <div className="info-card">
            <h3>📊 Live Metrics</h3>
            <p>Real-time treasury balances fetched directly from blockchain via Ethers.js v6</p>
          </div>
          <div className="info-card">
            <h3>🔗 Multi-Chain</h3>
            <p>Monitor assets across Polygon and Aristotle (0G Network)</p>
          </div>
          <div className="info-card">
            <h3>✅ Contract Tracking</h3>
            <p>Verify deployment and verification status of all protocol contracts</p>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>Powered by Quantum Pi Forge • Built with React + Ethers.js v6</p>
      </footer>
    </div>
  );
}

export default App;
