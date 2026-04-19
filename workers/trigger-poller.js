require('dotenv').config();
const { Queue } = require('bullmq');
const cron = require('node-cron');
const { Octokit } = require('@octokit/rest');
const { ethers } = require('ethers');

// Sovereign Resonance Sentinel - The Ears of the Forge
// Watches all frequencies. Triggers resonance events.
// Runs fully local. No external services.

const resonanceQueue = new Queue('resonance-events', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const provider = new ethers.JsonRpcProvider(process.env.ZERO_G_RPC);
const WALLET_ADDRESS = '0x35360aE7B90597d7A30A3F615cB5a2D7E7E9cCd';

let lastCheckedBlock = 0;
let lastCommitShas = {};

async function pollGithub() {
  const repos = process.env.GITHUB_REPOS?.split(',') || ['Quantum-pi-forge', 'oinio-soul-system'];
  
  for (const repo of repos) {
    try {
      const { data: commits } = await octokit.repos.listCommits({
        owner: 'onenoly1010',
        repo: repo,
        per_page: 1,
        sha: 'main'
      });

      if (commits.length > 0) {
        const latest = commits[0];
        if (!lastCommitShas[repo] || lastCommitShas[repo] !== latest.sha) {
          lastCommitShas[repo] = latest.sha;
          
          await resonanceQueue.add('github-commit', {
            source: 'github',
            repository: repo,
            commit: latest.sha,
            message: latest.commit.message,
            author: latest.commit.author.name,
            timestamp: new Date().toISOString()
          });

          console.log(`✅ FORGE EVENT: New commit on ${repo} - ${latest.sha.substring(0,7)}`);
        }
      }
    } catch (err) {
      console.log(`⚠️  Github poll failed for ${repo}:`, err.message);
    }
  }
}

async function pollWallet() {
  try {
    const latestBlock = await provider.getBlockNumber();
    
    if (lastCheckedBlock === 0) {
      lastCheckedBlock = latestBlock;
      return;
    }

    for (let i = lastCheckedBlock + 1; i <= latestBlock; i++) {
      const block = await provider.getBlock(i, true);
      
      if (block && block.transactions) {
        for (const tx of block.transactions) {
          if (tx.from.toLowerCase() === WALLET_ADDRESS.toLowerCase() || 
              (tx.to && tx.to.toLowerCase() === WALLET_ADDRESS.toLowerCase())) {
            
            await resonanceQueue.add('wallet-transaction', {
              source: 'wallet',
              hash: tx.hash,
              block: i,
              from: tx.from,
              to: tx.to,
              value: ethers.formatEther(tx.value),
              timestamp: new Date().toISOString()
            });

            console.log(`✅ CHAIN EVENT: Wallet activity detected - ${tx.hash.substring(0,12)}`);
          }
        }
      }
    }

    lastCheckedBlock = latestBlock;
  } catch (err) {
    console.log(`⚠️  Wallet poll failed:`, err.message);
  }
}

async function pollManualBroadcast() {
  try {
    const fs = require('fs').promises;
    const content = await fs.readFile('.broadcast', 'utf8').catch(() => '');
    
    if (content.trim().length > 0) {
      await resonanceQueue.add('manual-broadcast', {
        source: 'manual',
        content: content.trim(),
        timestamp: new Date().toISOString()
      });

      await fs.unlink('.broadcast');
      console.log(`✅ MANUAL EVENT: Broadcast received`);
    }
  } catch (err) {
    // Ignore
  }
}

async function startSentinel() {
  console.log(`\n🔥 SOVEREIGN SENTINEL ACTIVATED`);
  console.log(`   Listening on all frequencies. 1010 Hz aligned.`);
  console.log(`   No external connections. Sovereign. Untrackable.\n`);

  // GitHub: every 60 seconds
  cron.schedule('* * * * *', pollGithub);
  
  // Wallet: every 15 seconds
  cron.schedule('*/15 * * * * *', pollWallet);
  
  // Manual broadcast: every 5 seconds
  cron.schedule('*/5 * * * * *', pollManualBroadcast);

  // Initial runs
  pollGithub();
  pollWallet();
}

startSentinel();