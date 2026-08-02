// Logic (pure functions): dashboard KPI computation, SVG trend path generation,
// target progress, and per-tab data requirements. No React, no side effects.
import { TAB_IDS } from '../constants/tabs';

export const DASHBOARD_BASELINES = {
  DONATION_BASE: 1245000,
  VOLUNTEER_BASE: 2480,
  EVENT_BASE: 9,
  BENEFICIARY_BASE: 15200,
  TREES_BASE: 4200,
  MEALS_BASE: 8500,
  USER_BASE: 3840,
  BENEFICIARY_PER_DONATION: 12,
  BENEFICIARY_PER_VOLUNTEER: 15,
};

export const IMPACT_TARGETS = {
  BENEFICIARIES: 20000,
  TREES: 5000,
  MEALS: 10000,
};

export const DONATION_TREND_MAX = 1500000;

const MONTHLY_DONATION_POINTS = [180000, 220000, 195000, 260000, 290000];

export const sumDonations = (donations) =>
  donations.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

export const clampPercent = (value, target) =>
  Math.min(100, Math.max(0, (value / target) * 100));

export function computeDashboardStats({
  donations,
  volunteers,
  events,
  usersCount,
  offsets = {},
}) {
  const donationSum = sumDonations(donations);
  const {
    simulatedDonationsOffset = 0,
    beneficiariesOffset = 0,
    treesPlantedOffset = 0,
    mealsServedOffset = 0,
  } = offsets;

  const totalDonationSum =
    donationSum + DASHBOARD_BASELINES.DONATION_BASE + simulatedDonationsOffset;

  return {
    totalDonationSum,
    donationSum,
    totalVolunteersCount: volunteers.length + DASHBOARD_BASELINES.VOLUNTEER_BASE,
    totalEventsCount: events.length + DASHBOARD_BASELINES.EVENT_BASE,
    totalBeneficiariesCount:
      DASHBOARD_BASELINES.BENEFICIARY_BASE +
      beneficiariesOffset +
      donations.length * DASHBOARD_BASELINES.BENEFICIARY_PER_DONATION +
      volunteers.length * DASHBOARD_BASELINES.BENEFICIARY_PER_VOLUNTEER,
    totalTreesCount: DASHBOARD_BASELINES.TREES_BASE + treesPlantedOffset,
    totalMealsCount: DASHBOARD_BASELINES.MEALS_BASE + mealsServedOffset,
    totalUsersCount: usersCount + DASHBOARD_BASELINES.USER_BASE,
  };
}

export function computeVolunteerStatusDistribution(volunteers) {
  return volunteers.reduce(
    (acc, v) => {
      if (v.status === 'approved') acc.approved += 1;
      else if (v.status === 'rejected') acc.rejected += 1;
      else acc.pending += 1;
      return acc;
    },
    { pending: 0, approved: 0, rejected: 0 }
  );
}

const yToSvg = (value) => 180 - (value / DONATION_TREND_MAX) * 140;

export function computeDonationTrend(totalDonationSum) {
  const lastValue = Math.min(DONATION_TREND_MAX, totalDonationSum);
  const points = [...MONTHLY_DONATION_POINTS, lastValue];
  const xCoords = [50, 130, 210, 290, 370, 450];

  const linePoints = points
    .map((val, i) => `${xCoords[i]},${yToSvg(val)}`)
    .join(' ');

  const areaPath = `M 50,180 L ${linePoints} L 450,180 Z`;
  const linePath = `M ${linePoints}`;
  const dots = points.map((val, i) => ({
    cx: xCoords[i],
    cy: yToSvg(val),
  }));

  return { areaPath, linePath, dots };
}

export function computeTargetProgress(stats) {
  return [
    {
      key: 'beneficiaries',
      label: 'Beneficiaries Helped',
      current: stats.totalBeneficiariesCount,
      target: IMPACT_TARGETS.BENEFICIARIES,
      color: 'bg-rose-500',
    },
    {
      key: 'trees',
      label: 'Trees Planted',
      current: stats.totalTreesCount,
      target: IMPACT_TARGETS.TREES,
      color: 'bg-emerald-500',
    },
    {
      key: 'meals',
      label: 'Meals Served',
      current: stats.totalMealsCount,
      target: IMPACT_TARGETS.MEALS,
      color: 'bg-amber-500',
    },
  ].map((item) => ({
    ...item,
    percent: clampPercent(item.current, item.target),
  }));
}

export const TAB_DATA_REQUIREMENTS = {
  [TAB_IDS.OVERVIEW]: {
    users: true,
    volunteers: true,
    donations: true,
    events: false,
    registrations: false,
    certificates: false,
    notifications: false,
  },
  [TAB_IDS.ANALYTICS]: {
    users: true,
    volunteers: true,
    donations: true,
    events: true,
    registrations: false,
    certificates: false,
    notifications: false,
  },
  [TAB_IDS.USERS]: {
    users: true,
  },
  [TAB_IDS.VOLUNTEERS]: {
    volunteers: true,
  },
  [TAB_IDS.DONATIONS]: {
    donations: true,
  },
  [TAB_IDS.EVENTS]: {
    events: true,
  },
  [TAB_IDS.REGISTRATIONS]: {
    registrations: true,
  },
  [TAB_IDS.CERTIFICATES]: {
    certificates: true,
  },
  [TAB_IDS.AI_ASSISTANT]: {
    volunteers: true,
  },
  [TAB_IDS.NOTIFICATIONS]: {
    notifications: true,
  },
};

export function isDataNeededForTab(domain, activeTab) {
  const req = TAB_DATA_REQUIREMENTS[activeTab];
  if (!req) return false;
  return req[domain] === true;
}
