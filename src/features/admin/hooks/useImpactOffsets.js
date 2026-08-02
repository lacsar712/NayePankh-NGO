import { useState, useCallback } from 'react';

export function useImpactOffsets() {
  const [mealsServedOffset, setMealsServedOffset] = useState(0);
  const [treesPlantedOffset, setTreesPlantedOffset] = useState(0);
  const [beneficiariesOffset, setBeneficiariesOffset] = useState(0);
  const [simulatedDonationsOffset, setSimulatedDonationsOffset] = useState(0);

  const triggerFoodDrive = useCallback(() => {
    setMealsServedOffset((prev) => prev + 500);
    setBeneficiariesOffset((prev) => prev + 120);
    alert('Simulated Ground Food Drive: +500 Meals Served, +120 Beneficiaries Helped!');
  }, []);

  const triggerTreePlanting = useCallback(() => {
    setTreesPlantedOffset((prev) => prev + 100);
    setBeneficiariesOffset((prev) => prev + 30);
    alert('Simulated Tree Plantation Drive: +100 Trees Planted, +30 Beneficiaries Helped!');
  }, []);

  const triggerHealthCamp = useCallback(() => {
    setBeneficiariesOffset((prev) => prev + 250);
    alert('Simulated Health Camp Drive: +250 Beneficiaries Helped!');
  }, []);

  const triggerCorporateGrant = useCallback(() => {
    setSimulatedDonationsOffset((prev) => prev + 25000);
    alert('Simulated Corporate Grant Received: +₹25,000 Total Donations!');
  }, []);

  return {
    mealsServedOffset,
    treesPlantedOffset,
    beneficiariesOffset,
    simulatedDonationsOffset,
    setMealsServedOffset,
    setTreesPlantedOffset,
    setBeneficiariesOffset,
    setSimulatedDonationsOffset,
    triggerFoodDrive,
    triggerTreePlanting,
    triggerHealthCamp,
    triggerCorporateGrant,
  };
}
