/**
 * Resonance Worker API
 * Fetches live 0G Aristotle block height and system metadata from KV
 */

interface Env {
  SOUL_METADATA: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { env } = context;

  try {
    // Fetch current block height from 0G Aristotle
    const blockResponse = await fetch('https://evmrpc.0g.ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1
      })
    });

    const blockData = await blockResponse.json();
    const blockHex = blockData.result || '0x0';
    const blockNumber = parseInt(blockHex, 16);

    // Fetch system birth from KV
    const systemBirth = await env.SOUL_METADATA.get('system:birth') || '2026-04-04T21:22:44Z';

    // Calculate coherence (hours since birth)
    const birthTime = new Date(systemBirth).getTime();
    const now = Date.now();
    const coherenceHours = Math.floor((now - birthTime) / (1000 * 60 * 60));

    return new Response(JSON.stringify({
      blockHeight: blockNumber,
      blockHex,
      systemBirth,
      coherenceHours,
      network: '0G Aristotle Mainnet',
      chainId: 16661,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to fetch resonance data',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};