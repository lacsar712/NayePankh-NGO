// logic: pure, side-effect free dashboard metric calculations.
// Safe to unit test; no React, Firebase or localStorage imports allowed.
export const ANALYTICS_BASELINES = Object.freeze({
  DONATION_BASE: 1245000,
  VOLUNTEERS_BASE: 2480,
  EVENTS_BASE: 9,
  USERS_BASE: 3840,
  BENEFICIARIES_BASE: 15200,
  BENEFICIARIES_PER_DONATION: 12,
  BENEFICIARIES_PER_VOLUNTEER: 15,
  TREES_BASE: 4200,
  MEALS_BASE: 8500,
});

export const SIMULATOR_STEPS = Object.freeze({
  FOOD_DRIVE_MEALS: 500,
  FOOD_DRIVE_BENEFICIARIES: 120,
  TREE_PLANTING_TREES: 100,
  TREE_PLANTING_BENEFICIARIES: 30,
  HEALTH_CAMP_BENEFICIARIES: 250,
  CORPORATE_GRANT_AMOUNT: 25000,
});

export const sumDonationAmounts = (donations) =>
  (donations || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

export const computeDashboardStats = ({
  donations,
  volunteers,
  events,
  users,
  offsets,
}) => {
  const {
    mealsServedOffset = 0,
    treesPlantedOffset = 0,
    beneficiariesOffset = 0,
    simulatedDonationsOffset = 0,
  } = offsets || {};

  return {
    totalDonationSum:
      sumDonationAmounts(donations) +
      ANALYTICS_BASELINES.DONATION_BASE +
      simulatedDonationsOffset,
    totalVolunteersCount:
      (volunteers ? volunteers.length : 0) + ANALYTICS_BASELINES.VOLUNTEERS_BASE,
    totalEventsCount:
      (events ? events.length : 0) + ANALYTICS_BASELINES.EVENTS_BASE,
    totalBeneficiariesCount:
      ANALYTICS_BASELINES.BENEFICIARIES_BASE +
      beneficiariesOffset +
      (donations ? donations.length : 0) *
        ANALYTICS_BASELINES.BENEFICIARIES_PER_DONATION +
      (volunteers ? volunteers.length : 0) *
        ANALYTICS_BASELINES.BENEFICIARIES_PER_VOLUNTEER,
    totalTreesCount: ANALYTICS_BASELINES.TREES_BASE + treesPlantedOffset,
    totalMealsCount: ANALYTICS_BASELINES.MEALS_BASE + mealsServedOffset,
    usersCount:
      (users ? users.length : 0) + ANALYTICS_BASELINES.USERS_BASE,
  };
};

export const computeVolunteerStatusBreakdown = (volunteers) => {
  const breakdown = { approved: 0, rejected: 0, pending: 0 };
  (volunteers || []).forEach((v) => {
    if (Object.prototype.hasOwnProperty.call(breakdown, v.status)) {
      breakdown[v.status] += 1;
    } else {
      breakdown.pending += 1;
    }
  });
  return breakdown;
};
