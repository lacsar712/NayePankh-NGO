// Admin logic layer — analytics pure functions
// Derives the dashboard's aggregate counters + chart-ready datasets from raw
// domain data + simulator offsets. Side-effect free so they can be memoized in
// components/hooks and unit tested independently. Constants match the original
// monolith exactly.

const BASE_DONATIONS = 1245000;
const BASE_VOLUNTEERS = 2480;
const BASE_EVENTS = 9;
const BASE_BENEFICIARIES = 15200;
const BASE_TREES = 4200;
const BASE_MEALS = 8500;
const BASE_USERS = 3840;

// Annual milestone targets used by the "Social Impact Targets" progress bars.
const TARGET_BENEFICIARIES = 20000;
const TARGET_TREES = 5000;
const TARGET_MEALS = 10000;

// Historical monthly donation ledger (Jan–May); the final point is live.
const DONATION_TREND_HISTORY = [180000, 220000, 195000, 260000, 290000];
const DONATION_TREND_CEILING = 1500000;

export function computeAdminStats({ donations, volunteers, events, users, offsets }) {
  const {
    meals = 0,
    trees = 0,
    beneficiaries = 0,
    simulatedDonations = 0,
  } = offsets || {};

  const totalDonationSum =
    donations.reduce((acc, curr) => acc + curr.amount, 0) + BASE_DONATIONS + simulatedDonations;

  return {
    totalDonationSum,
    totalVolunteersCount: volunteers.length + BASE_VOLUNTEERS,
    totalEventsCount: events.length + BASE_EVENTS,
    totalBeneficiariesCount:
      BASE_BENEFICIARIES + beneficiaries + donations.length * 12 + volunteers.length * 15,
    totalTreesCount: BASE_TREES + trees,
    totalMealsCount: BASE_MEALS + meals,
    totalUsersCount: users.length + BASE_USERS,
  };
}

// Percent (0–100) helper, clamped.
function pct(value, target) {
  return Math.min(100, (value / target) * 100);
}

/** Progress-bar percentages for the "Social Impact Targets" panel. */
export function computeTargetProgress(stats) {
  return {
    beneficiaries: pct(stats.totalBeneficiariesCount, TARGET_BENEFICIARIES),
    trees: pct(stats.totalTreesCount, TARGET_TREES),
    meals: pct(stats.totalMealsCount, TARGET_MEALS),
    targets: { beneficiaries: TARGET_BENEFICIARIES, trees: TARGET_TREES, meals: TARGET_MEALS },
  };
}

/**
 * Chart geometry for the donation revenue trend SVG.
 * Returns the six [x, y] points, plus ready-to-use line & area path strings so
 * the SVG component stays declarative and free of inline arithmetic.
 */
export function computeDonationTrend(totalDonationSum) {
  const xs = [50, 130, 210, 290, 370, 450];
  const baseY = 180;
  const scale = 140;
  const values = [...DONATION_TREND_HISTORY, Math.min(DONATION_TREND_CEILING, totalDonationSum)];

  const points = values.map((v, i) => [xs[i], baseY - (v / DONATION_TREND_CEILING) * scale]);
  const linePath = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x},${y}`).join(' ');
  const areaPath = `M ${xs[0]},${baseY} ${linePath.replace('M', 'L')} L ${xs[xs.length - 1]},${baseY} Z`;

  return { points, linePath, areaPath };
}

/** Volunteer status distribution (pending / approved / rejected counts + total). */
export function computeVolunteerDistribution(volunteers) {
  const distribution = { pending: 0, approved: 0, rejected: 0 };
  volunteers.forEach((v) => {
    if (v.status in distribution) distribution[v.status] += 1;
  });
  return { ...distribution, total: volunteers.length };
}
