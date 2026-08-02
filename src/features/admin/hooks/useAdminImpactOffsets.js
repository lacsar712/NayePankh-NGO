// Admin logic layer — Impact offsets hook
// Holds the "Real-Time Stats Simulator" offsets used by the analytics tab.
import { useState, useCallback, useMemo } from 'react';

export function useAdminImpactOffsets() {
  const [meals, setMeals] = useState(0);
  const [trees, setTrees] = useState(0);
  const [beneficiaries, setBeneficiaries] = useState(0);
  const [simulatedDonations, setSimulatedDonations] = useState(0);

  const simulateFoodDrive = useCallback(() => {
    setMeals((p) => p + 500);
    setBeneficiaries((p) => p + 120);
    alert('Simulated Ground Food Drive: +500 Meals Served, +120 Beneficiaries Helped!');
  }, []);

  const simulateTreePlanting = useCallback(() => {
    setTrees((p) => p + 100);
    setBeneficiaries((p) => p + 30);
    alert('Simulated Tree Plantation Drive: +100 Trees Planted, +30 Beneficiaries Helped!');
  }, []);

  const simulateHealthCamp = useCallback(() => {
    setBeneficiaries((p) => p + 250);
    alert('Simulated Health Camp Drive: +250 Beneficiaries Helped!');
  }, []);

  const simulateCorporateGrant = useCallback(() => {
    setSimulatedDonations((p) => p + 25000);
    alert('Simulated Corporate Grant Received: +₹25,000 Total Donations!');
  }, []);

  const offsets = useMemo(
    () => ({ meals, trees, beneficiaries, simulatedDonations }),
    [meals, trees, beneficiaries, simulatedDonations]
  );

  return {
    offsets,
    simulateFoodDrive,
    simulateTreePlanting,
    simulateHealthCamp,
    simulateCorporateGrant,
  };
}
