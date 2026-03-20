import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import type { TreasuryWidgetProps, ContractInfo, TreasuryState } from './Treasury.types';
import './TreasuryWidget.css';

const TreasuryWidget: React.FC<TreasuryWidgetProps> = ({ 
  polygonRpc = 'https://polygon-rpc.com',
  aristotleRpc = 'https://rpc.aristotle.0g.ai',
  treasuryAddresses = {},
  refreshInterval = 300000 // 5 minutes
}) => {
  const [state, setState] = useState<TreasuryState>({
    balances: {},
    loading: true,
    error: null,
    lastUpdated: null
  });
  
  // Make addresses configurable via props with fallback
  const TREASURY_ADDRESSES = {
    polygon: treasuryAddresses.polygon || '0x742d35Cc6634C0532925a3b8B9C4A1d3F1a8b1c2',
    aristotle: treasuryAddresses.aristotle || '' // Empty until deployed
  };
  
  const CONTRACTS: Record<string, ContractInfo[]> = {
    polygon: [
      { 
        name: 'OINIO', 
        address: '0x07f43E5B1A8a0928B364E40d5885f81A543B05C7', 
        verified: false 
      },
      { 
        name: 'Staking', 
        address: '', // TBD - needs actual address from deployment
        verified: false 
      }
    ],
    aristotle: [
      { 
        name: 'OINIO', 
        address: '', // TBD - awaiting deployment
        verified: false 
      },
      { 
        name: 'SlimRouter', 
        address: '', // TBD - awaiting deployment
        verified: false 
      }
    ]
  };

  useEffect(() => {
    fetchBalances();
    
    // Set up auto-refresh
    const interval = setInterval(fetchBalances, refreshInterval);
    return () => clearInterval(interval);
  }, [polygonRpc, aristotleRpc, refreshInterval]);

  const fetchBalances = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const balances: Record<string, string> = {};
      
      // Fetch Polygon balance (ethers v6 syntax)
      if (TREASURY_ADDRESSES.polygon) {
        const polyProvider = new ethers.JsonRpcProvider(polygonRpc);
        const polyBalance = await polyProvider.getBalance(TREASURY_ADDRESSES.polygon);
        balances.polygon = ethers.formatEther(polyBalance);
      }
      
      // Fetch Aristotle balance (only if address is set)
      if (TREASURY_ADDRESSES.aristotle) {
        const arisProvider = new ethers.JsonRpcProvider(aristotleRpc);
        const arisBalance = await arisProvider.getBalance(TREASURY_ADDRESSES.aristotle);
        balances.aristotle = ethers.formatEther(arisBalance);
      }
      
      setState({
        balances,
        loading: false,
        error: null,
        lastUpdated: new Date()
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setState(prev => ({
        ...prev,
        loading: false,
        error: `Failed to fetch balances: ${errorMessage}`
      }));
      console.error('Treasury balance fetch error:', err);
    }
  };

  const formatTimestamp = (date: Date | null): string => {
    if (!date) return 'Never';
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (state.loading && !state.lastUpdated) {
    return (
      <div className="treasury-widget loading">
        <h3>📦 Sovereign Treasury</h3>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading treasury data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="treasury-widget">
      <div className="treasury-header">
        <h3>📦 Sovereign Treasury</h3>
        <div className="last-updated">
          Last updated: {formatTimestamp(state.lastUpdated)}
        </div>
      </div>

      {state.error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{state.error}</span>
          <button onClick={fetchBalances} className="retry-button">
            Retry
          </button>
        </div>
      )}

      <div className="balances-grid">
        {/* Polygon Treasury */}
        {TREASURY_ADDRESSES.polygon && (
          <div className="balance-card polygon">
            <div className="card-header">
              <h4>Polygon Treasury</h4>
              <span className="network-badge polygon-badge">Polygon</span>
            </div>
            <div className="balance-amount">
              <span className="amount">{state.balances.polygon || '0'}</span>
              <span className="symbol">MATIC</span>
            </div>
            <a 
              href={`https://polygonscan.com/address/${TREASURY_ADDRESSES.polygon}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="explorer-link"
            >
              View on PolygonScan →
            </a>
          </div>
        )}
        
        {/* Aristotle Treasury */}
        {TREASURY_ADDRESSES.aristotle && (
          <div className="balance-card aristotle">
            <div className="card-header">
              <h4>Aristotle Treasury</h4>
              <span className="network-badge aristotle-badge">0G</span>
            </div>
            <div className="balance-amount">
              <span className="amount">{state.balances.aristotle || '0'}</span>
              <span className="symbol">0G</span>
            </div>
            <a 
              href={`https://explorer.aristotle.0g.ai/address/${TREASURY_ADDRESSES.aristotle}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="explorer-link"
            >
              View on Explorer →
            </a>
          </div>
        )}
      </div>
      
      <div className="contracts-section">
        <h4>Contract Verification Status</h4>
        <div className="contracts-table-wrapper">
          <table className="contracts-table">
            <thead>
              <tr>
                <th>Network</th>
                <th>Contract</th>
                <th>Status</th>
                <th>Explorer</th>
              </tr>
            </thead>
            <tbody>
              {CONTRACTS.polygon.map(contract => (
                contract.address && (
                  <tr key={`poly-${contract.name}`}>
                    <td>
                      <span className="network-badge polygon-badge">Polygon</span>
                    </td>
                    <td className="contract-name">{contract.name}</td>
                    <td>
                      <span className={`status-badge ${contract.verified ? 'verified' : 'pending'}`}>
                        {contract.verified ? '✅ Verified' : '⏳ Pending'}
                      </span>
                    </td>
                    <td>
                      <a 
                        href={`https://polygonscan.com/address/${contract.address}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="explorer-link"
                      >
                        View →
                      </a>
                    </td>
                  </tr>
                )
              ))}
              {CONTRACTS.aristotle.map(contract => (
                contract.address && (
                  <tr key={`aris-${contract.name}`}>
                    <td>
                      <span className="network-badge aristotle-badge">0G</span>
                    </td>
                    <td className="contract-name">{contract.name}</td>
                    <td>
                      <span className={`status-badge ${contract.verified ? 'verified' : 'pending'}`}>
                        {contract.verified ? '✅ Verified' : '⏳ Pending'}
                      </span>
                    </td>
                    <td>
                      <a 
                        href={`https://explorer.aristotle.0g.ai/address/${contract.address}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="explorer-link"
                      >
                        View →
                      </a>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <button 
        onClick={fetchBalances} 
        className="refresh-button"
        disabled={state.loading}
      >
        {state.loading ? '🔄 Refreshing...' : '🔄 Refresh Data'}
      </button>
    </div>
  );
};

export default TreasuryWidget;
