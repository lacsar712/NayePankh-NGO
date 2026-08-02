import { STATS_BASELINE } from '../constants/defaults';

/**
 * 【logic 层｜utils】Admin 统计派生纯函数（无 React 依赖，便于测试）。
 * 公式与基线行为保持自原 AdminDashboard 内联实现。
 */

/**
 * 汇总指标。
 * @param {{
 *   donations: Array<{amount: number}>,
 *   volunteers: Array,
 *   events: Array,
 *   users: Array,
 *   offsets: { meals: number, trees: number, beneficiaries: number, donations: number }
 * }} input
 * @returns {{
 *   donationsSum: number, volunteersCount: number, eventsCount: number, usersCount: number,
 *   beneficiariesCount: number, treesCount: number, mealsCount: number
 * }}
 */
export function computeAdminTotals({ donations, volunteers, events, users, offsets }) {
  return {
    donationsSum:
      donations.reduce((acc, curr) => acc + curr.amount, 0) + STATS_BASELINE.DONATIONS + offsets.donations,
    volunteersCount: volunteers.length + STATS_BASELINE.VOLUNTEERS,
    eventsCount: events.length + STATS_BASELINE.EVENTS,
    usersCount: users.length + STATS_BASELINE.USERS,
    beneficiariesCount:
      STATS_BASELINE.BENEFICIARIES + offsets.beneficiaries + donations.length * 12 + volunteers.length * 15,
    treesCount: STATS_BASELINE.TREES + offsets.trees,
    mealsCount: STATS_BASELINE.MEALS + offsets.meals,
  };
}

/** 趋势图固定月度台账（Jan-May，原硬编码于 SVG path 中） */
const TREND_MONTHLY_LEDGER = [180000, 220000, 195000, 260000, 290000];
const TREND_MAX = 1500000;

/**
 * 捐赠增长趋势图几何数据（viewBox 500x200 坐标系）。
 * @param {number} donationsSum 当前捐赠总额（Jun 数据点，封顶 TREND_MAX）
 * @returns {{
 *   points: Array<{x: number, y: number}>,
 *   linePath: string,
 *   areaPath: string
 * }}
 */
export function buildDonationTrend(donationsSum) {
  const values = [...TREND_MONTHLY_LEDGER, Math.min(TREND_MAX, donationsSum)];
  const points = values.map((v, i) => ({
    x: 50 + i * 80,
    y: 180 - (v / TREND_MAX) * 140,
  }));
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  const areaPath = `M 50,180 L ${points.map(p => `${p.x},${p.y}`).join(' L ')} L 450,180 Z`;
  return { points, linePath, areaPath };
}
