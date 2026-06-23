// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FeeCollector} from "./FeeCollector.sol";
import {LegacyVault} from "./LegacyVault.sol";
import {PioneerRewards} from "./PioneerRewards.sol";
import {OperationalTreasury} from "./OperationalTreasury.sol";

/**
 * @title YieldRouterFactory
 * @notice Atomic CREATE deployment for yield-routing contracts.
 *
 * Resolves the circular constructor dependency between receivers needing
 * FeeCollector's address and FeeCollector needing receiver addresses.
 *
 * Strategy: Accept the precomputed FeeCollector address as a parameter.
 * This address is deterministically computable offline:
 *   cast compute-address --nonce 3 <FACTORY_ADDR>
 *
 * Deployment order (nonce → contract):
 *   0 → LegacyVault(predictedFC)
 *   1 → PioneerRewards(predictedFC)
 *   2 → OperationalTreasury(predictedFC, guardians[])
 *   3 → FeeCollector(LV, PR, OT, guardian)
 *
 * @dev Factory retains NO ownership, admin, upgrade, or rescue authority.
 */
contract YieldRouterFactory {
    event DeploymentComplete(
        address feeCollector,
        address legacyVault,
        address pioneerRewards,
        address operationalTreasury
    );

    error AlreadyDeployed();
    error GuardianArrayRequired();
    error ZeroGuardianAddress();

    bool public deployed;
    address public feeCollector;
    address public legacyVault;
    address public pioneerRewards;
    address public operationalTreasury;

    /**
     * @notice Deploy all four yield-routing contracts atomically.
     *
     * @param _predictedFeeCollector  Precomputed FeeCollector address.
     *   Compute with: cast compute-address --nonce 3 <THIS_FACTORY_ADDR>
     * @param _guardian               FeeCollector owner
     * @param _guardians              OperationalTreasury guardians (min 1)
     */
    function deployAll(
        address _predictedFeeCollector,
        address _guardian,
        address[] calldata _guardians
    ) external {
        if (deployed) revert AlreadyDeployed();
        if (_guardian == address(0)) revert ZeroGuardianAddress();
        if (_guardians.length == 0) revert GuardianArrayRequired();

        // 1. LegacyVault (nonce 0)
        LegacyVault lv = new LegacyVault(_predictedFeeCollector);
        legacyVault = address(lv);

        // 2. PioneerRewards (nonce 1)
        PioneerRewards pr = new PioneerRewards(_predictedFeeCollector);
        pioneerRewards = address(pr);

        // 3. OperationalTreasury (nonce 2)
        OperationalTreasury ot = new OperationalTreasury(_predictedFeeCollector, _guardians);
        operationalTreasury = address(ot);

        // 4. FeeCollector (nonce 3) — lands at precisely _predictedFeeCollector
        FeeCollector fc = new FeeCollector(
            address(lv),
            address(pr),
            address(ot),
            _guardian
        );
        feeCollector = address(fc);

        deployed = true;
        emit DeploymentComplete(address(fc), address(lv), address(pr), address(ot));
    }
}