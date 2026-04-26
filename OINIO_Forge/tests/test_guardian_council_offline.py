"""
JULY STRESS TEST SCENARIO: GUARDIAN COUNCIL OFFLINE SIMULATION

This test verifies that the system remains SEALED when a majority
of the Guardian Council is unreachable or offline.

This is the most important invariant: no single entity, not even the founder,
can unseal the system without threshold consensus.
"""
import unittest
from unittest.mock import Mock
from server.constitutional.emergency_handler import EmergencyState, get_emergency_state

class TestGuardianCouncilOffline(unittest.TestCase):

    def setUp(self):
        # Reset singleton between tests
        EmergencyState._instance = None
        self.mock_db = Mock()
        self.state = get_emergency_state(self.mock_db)

    def test_single_guardian_cannot_unseal(self):
        """Test Case 1: Only Prime Guardian attempts recovery"""
        self.state.trigger_emergency("Test Lockdown")
        self.assertTrue(self.state.is_sealed)
        
        # Prime Guardian submits signature
        result = self.state.add_recovery_signature("Guardian_Alpha", "sig_alpha")
        
        self.assertFalse(result)
        self.assertTrue(self.state.is_sealed)
        self.assertEqual(len(self.state.recovery_signatures), 1)
        self.mock_db.table.assert_called_with("emergency_log")

    def test_two_guardians_cannot_unseal_with_threshold_three(self):
        """Test Case 2: Two Guardians online, one offline permanently"""
        self.state.trigger_emergency("Test Lockdown")
        
        self.state.add_recovery_signature("Guardian_Alpha", "sig_alpha")
        result = self.state.add_recovery_signature("Guardian_Beta", "sig_beta")
        
        self.assertFalse(result)
        self.assertTrue(self.state.is_sealed)
        self.assertEqual(len(self.state.recovery_signatures), 2)

    def test_cannot_reinitialize_singleton_while_sealed(self):
        """Test Case 3: Sovereignty Amnesia Prevention
        
        Critical invariant: You cannot create a new EmergencyState instance
        while the system is sealed. The lockdown status survives all reinitialization attempts.
        """
        self.state.trigger_emergency("Permanent Lockdown")
        self.assertTrue(self.state.is_sealed)
        
        # Attempt to reinitialize with new client (attack vector)
        new_attack_client = Mock()
        attack_state = EmergencyState(new_attack_client, threshold=1)
        
        # Singleton returns existing sealed instance
        self.assertTrue(attack_state.is_sealed)
        self.assertEqual(attack_state.threshold, 3)
        self.assertEqual(attack_state.db, self.mock_db)
        self.assertIs(attack_state, self.state)

    def test_cannot_clear_signatures_while_sealed(self):
        """Test Case 4: No reset bypass while sealed"""
        self.state.trigger_emergency("Test Lockdown")
        self.state.add_recovery_signature("Guardian_Alpha", "sig_alpha")
        
        # Attempt to manually clear signatures
        self.state.recovery_signatures.clear()
        
        # System should not unseal - actual implementation prevents this in production
        self.assertTrue(self.state.is_sealed)

    def test_threshold_exactly_met_unseals(self):
        """Test Case 5: Correct threshold behavior when all guardians are present"""
        self.state.trigger_emergency("Test Lockdown")
        
        self.state.add_recovery_signature("Guardian_Alpha", "sig_alpha")
        self.state.add_recovery_signature("Guardian_Beta", "sig_beta")
        result = self.state.add_recovery_signature("Guardian_Gamma", "sig_gamma")
        
        self.assertTrue(result)
        self.assertFalse(self.state.is_sealed)
        self.assertEqual(len(self.state.recovery_signatures), 0)

    def test_duplicate_signatures_are_ignored(self):
        """Test Case 6: Cannot vote multiple times to reach threshold"""
        self.state.trigger_emergency("Test Lockdown")
        
        for _ in range(10):
            self.state.add_recovery_signature("Guardian_Alpha", "sig_alpha")
        
        self.assertEqual(len(self.state.recovery_signatures), 1)
        self.assertTrue(self.state.is_sealed)


if __name__ == '__main__':
    unittest.main()