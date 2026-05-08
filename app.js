let provider;
let signer;
let contract;
let currentAccount;

const confirmedGuardians = new Map();
const optimisticGuardians = new Map();
let lastScannedBlock = 32567000;
let isSyncing = false;

const FORGE_CONFIG = {
    address: "",
    deploymentBlock: 32570000,
    rpcUrl: "https://evmrpc.0g.ai",
    chainId: "0x4115",
    chainName: "0G Aristotle Mainnet",
    abi: [
        "function register() external",
        "function isGuardian(address) external view returns (bool)",
        "function guardianCount() external view returns (uint256)",
        "event GuardianActivated(address indexed guardian, uint256 timestamp)"
    ]
};

// Add 0G network configuration
async function add0GNetwork() {
    if (!window.ethereum) return;
    try {
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (currentChainId && currentChainId.toLowerCase() === FORGE_CONFIG.chainId.toLowerCase()) return;

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: FORGE_CONFIG.chainId }]
            });
            return;
        } catch (switchError) {
            if (switchError.code !== 4902) throw switchError;
        }

        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: FORGE_CONFIG.chainId,
                chainName: FORGE_CONFIG.chainName,
                rpcUrls: [FORGE_CONFIG.rpcUrl],
                nativeCurrency: {
                    name: "0G",
                    symbol: "0G",
                    decimals: 18
                },
                blockExplorerUrls: ["https://chainscan.0g.ai"]
            }]
        });
    } catch (e) {
        console.log("Network add failed or already exists");
    }
}

// ✅ LOCAL AI INTEGRATION - SOVEREIGN FORGE
async function generateEthicalApp(prompt) {
    const status = document.getElementById('status');
    status.innerText = "🔨 Forge is heating up... (Local Inference)";

    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama3.2',
                prompt: `You are the Quantum Pi Forge Ethical Auditor. Build and verify AI applications against the OINIO Sovereign Standards.

USER REQUEST: ${prompt}

RESPONSE FORMAT:
1.  Ethical Assessment
2.  Compliance Verification
3.  Generated Code Implementation
4.  Guardian Consensus Check
`,
                stream: false,
                temperature: 0.3,
                options: {
                    num_ctx: 8192
                }
            })
        });

        if (!response.ok) {
            throw new Error("Local Ollama instance not responding");
        }

        const data = await response.json();
        renderResult(data.response);
        status.innerText = "✅ Forge operation completed successfully";

    } catch (error) {
        status.innerText = "❌ Error: Ensure your Local Forge (Ollama) is running with OLLAMA_ORIGINS=\"*\"";
        console.error("Forge connection error:", error);
    }
}

async function runEthicalAudit(code) {
    return await generateEthicalApp(`PERFORM FULL ETHICAL AUDIT ON THIS CODE: ${code}`);
}

function renderResult(content) {
    const outputContainer = document.getElementById('app-output');
    outputContainer.innerHTML = `<pre class="font-mono text-sm p-4 bg-black/50 rounded overflow-auto max-h-96">${content}</pre>`;
}

// ✅ WALLET CONNECTION
async function connectWallet() {
    if (!window.ethereum) {
        document.getElementById('errorMsg').textContent = "MetaMask or Web3 wallet required";
        document.getElementById('errorMsg').classList.add('visible');
        return;
    }

    try {
        await add0GNetwork();

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        currentAccount = accounts[0];

        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        contract = FORGE_CONFIG.address
            ? new ethers.Contract(FORGE_CONFIG.address, FORGE_CONFIG.abi, signer)
            : null;

        document.getElementById('registerBtn').textContent = `Connected: ${currentAccount.slice(0,6)}...${currentAccount.slice(-4)}`;
        document.getElementById('errorMsg').classList.remove('visible');

        updateGuardianCount();
        startBlockSync();

    } catch (error) {
        document.getElementById('errorMsg').textContent = error.message;
        document.getElementById('errorMsg').classList.add('visible');
    }
}

async function registerGuardian() {
    if (!contract) {
        document.getElementById('errorMsg').textContent = "Guardian registry address is not configured yet.";
        document.getElementById('errorMsg').classList.add('visible');
        return;
    }

    try {
        document.getElementById('registerBtn').disabled = true;
        document.getElementById('registerBtn').textContent = "Registering...";

        const tx = await contract.register();
        await tx.wait();

        optimisticGuardians.set(currentAccount, Date.now());
        updateGuardianList();

        document.getElementById('registerBtn').textContent = "✅ Registered as Guardian";

    } catch (error) {
        document.getElementById('errorMsg').textContent = error.message;
        document.getElementById('errorMsg').classList.add('visible');
        document.getElementById('registerBtn').disabled = false;
        document.getElementById('registerBtn').textContent = "Register as Guardian";
    }
}

async function updateGuardianCount() {
    if (!contract) return;
    const count = await contract.guardianCount();
    document.getElementById('guardianCount').textContent = count.toString();
}

async function startBlockSync() {
    if (isSyncing) return;
    isSyncing = true;

    const syncIndicator = document.getElementById('syncIndicator');
    syncIndicator.classList.add('syncing');

    while (true) {
        try {
            const latestBlock = await provider.getBlockNumber();

            if (latestBlock > lastScannedBlock) {
                const logs = await provider.getLogs({
                    address: FORGE_CONFIG.address,
                    fromBlock: lastScannedBlock + 1,
                    toBlock: latestBlock
                });

                logs.forEach(log => {
                    const parsed = contract.interface.parseLog(log);
                    if (parsed.name === "GuardianActivated") {
                        const [guardian, timestamp] = parsed.args;
                        confirmedGuardians.set(guardian.toLowerCase(), Number(timestamp));
                        optimisticGuardians.delete(guardian.toLowerCase());
                    }
                });

                lastScannedBlock = latestBlock;
                updateGuardianList();
                updateGuardianCount();
            }

            syncIndicator.classList.remove('syncing');
            isSyncing = false;
            break;

        } catch (e) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

function updateGuardianList() {
    const list = document.getElementById('guardianList');
    list.innerHTML = '';

    const allGuardians = new Map([...confirmedGuardians, ...optimisticGuardians]);

    for (const [address, timestamp] of allGuardians) {
        const isPending = optimisticGuardians.has(address);
        const guardianEl = document.createElement('div');
        guardianEl.className = `guardian ${isPending ? 'pending' : ''}`;
        guardianEl.innerHTML = `
            <span>${address}</span>
            <span class="status ${isPending ? 'pending' : ''}">${isPending ? 'PENDING' : 'ACTIVE'}</span>
        `;
        list.appendChild(guardianEl);
    }
}

document.getElementById('registerBtn').addEventListener('click', () => {
    if (!currentAccount) {
        connectWallet();
    } else {
        registerGuardian();
    }
});

// Initialize
// Auto update block counter
async function updateBlockHeight() {
    try {
        const readProvider = new ethers.JsonRpcProvider(FORGE_CONFIG.rpcUrl);
        const block = await readProvider.getBlockNumber();
        document.getElementById('blockHeight').textContent = block.toLocaleString();

        const remaining = 32570000 - block;
        document.getElementById('blocksRemaining').textContent = remaining > 0 ? remaining.toLocaleString() : "ACTIVATED";

        setTimeout(updateBlockHeight, 60000);
    } catch(e) {}
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                currentAccount = null;
                document.getElementById('registerBtn').textContent = "Connect Wallet";
            }
        });
    }
    updateBlockHeight();
});
