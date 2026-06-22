# Foundry Dependency Layout Repair v1

Repairs the local Foundry dependency layout expected by contracts/remappings.txt.

Dependency repair result:
- openzeppelin_version=v5.0.2
- forge_build_exit_code=0
- contracts/lib/forge-std/src/Script.sol=true
- contracts/lib/openzeppelin-contracts/contracts/access/Ownable.sol=true
- contracts/lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol=true
- contracts/lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol=true
- contracts/lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol=true

Import repair:
- OINIOModelRegistry.sol imports @openzeppelin/contracts/utils/ReentrancyGuard.sol for OpenZeppelin v5 compatibility.

No wallet action, private key use, signing, broadcast, deploy, staking, minting, participant growth, or live execution is performed by this repair.
