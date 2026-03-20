/**
 * TypeScript type definitions for Treasury components
 */

export interface TreasuryWidgetProps {
  /** RPC endpoint for Polygon network */
  polygonRpc?: string;
  /** RPC endpoint for Aristotle/0G network */
  aristotleRpc?: string;
  /** Treasury contract addresses for each network */
  treasuryAddresses?: TreasuryAddresses;
  /** Auto-refresh interval in milliseconds (default: 300000 = 5 min) */
  refreshInterval?: number;
}

export interface TreasuryAddresses {
  polygon?: string;
  aristotle?: string;
}

export interface ContractInfo {
  name: string;
  address: string;
  verified: boolean;
  explorerUrl?: string;
}

export interface NetworkContracts {
  polygon: ContractInfo[];
  aristotle: ContractInfo[];
}

export interface TreasuryBalance {
  network: string;
  balance: string;
  symbol: string;
  address: string;
  explorerUrl: string;
}

export interface TreasuryState {
  balances: Record<string, string>;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}
