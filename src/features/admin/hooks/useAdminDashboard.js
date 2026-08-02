import { useState, useMemo } from 'react';
import { useAdminUsers } from './useAdminUsers';
import { useAdminVolunteers } from './useAdminVolunteers';
import { useAdminDonations } from './useAdminDonations';
import { useAdminEvents } from './useAdminEvents';
import { useAdminCertificates } from './useAdminCertificates';
import { useAdminRegistrations } from './useAdminRegistrations';
import { useAdminNotifications } from './useAdminNotifications';
import { computeAdminTotals } from '../utils/analytics';

/**
 * 【logic 层｜hooks】Admin 后台总编排 Hook（后续轮次接口基准，签名不得变更）。
 * 聚合各领域 Hook，并派生统计指标与模拟器动作。
 *
 * @returns {{
 *   activeTab: string,
 *   setActiveTab: import('react').Dispatch<import('react').SetStateAction<string>>,
 *   users: { list: Array, toggleRole: (id: string) => Promise<void> },
 *   volunteers: { list: Array, approve: (id: string) => void, reject: (id: string) => void },
 *   donations: { list: Array },
 *   events: { list: Array, newEvent: object, setNewEvent: Function, addEvent: Function, remove: (id: string) => void },
 *   registrations: { list: Array, remove: Function, markAttended: (reg: object) => Promise<void> },
 *   certificates: {
 *     list: Array, addCertificate: Function, selected: object|null, isModalOpen: boolean,
 *     view: Function, viewForRegistration: Function, closeModal: () => void,
 *     sigImage: string, stampImage: string,
 *     uploadSignature: Function, uploadStamp: Function, resetAssets: () => void
 *   },
 *   notifications: { list: Array, selected: object|null, select: Function, clear: () => void },
 *   stats: {
 *     totals: {
 *       donationsSum: number, volunteersCount: number, eventsCount: number,
 *       usersCount: number, beneficiariesCount: number, treesCount: number, mealsCount: number
 *     },
 *     simulate: { foodDrive: () => void, treeDrive: () => void, healthCamp: () => void, corporateGrant: () => void }
 *   }
 * }}
 */
export function useAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const users = useAdminUsers();
  const volunteers = useAdminVolunteers();
  const donations = useAdminDonations();
  const events = useAdminEvents();
  const certificates = useAdminCertificates();
  const registrations = useAdminRegistrations({
    addCertificate: certificates.addCertificate,
    sigImage: certificates.sigImage,
    stampImage: certificates.stampImage,
  });
  const notifications = useAdminNotifications(activeTab);

  // 实时统计模拟器偏移量（纯本地 UI 状态，不持久化）
  const [mealsOffset, setMealsOffset] = useState(0);
  const [treesOffset, setTreesOffset] = useState(0);
  const [beneficiariesOffset, setBeneficiariesOffset] = useState(0);
  const [donationsOffset, setDonationsOffset] = useState(0);

  // 派生统计仅在源数据或偏移量变化时重算（纯函数见 utils/analytics.js）
  const totals = useMemo(() => computeAdminTotals({
    donations: donations.list,
    volunteers: volunteers.list,
    events: events.list,
    users: users.list,
    offsets: {
      meals: mealsOffset,
      trees: treesOffset,
      beneficiaries: beneficiariesOffset,
      donations: donationsOffset,
    },
  }), [donations.list, volunteers.list, events.list, users.list, mealsOffset, treesOffset, beneficiariesOffset, donationsOffset]);

  const simulate = useMemo(() => ({
    foodDrive: () => {
      setMealsOffset(prev => prev + 500);
      setBeneficiariesOffset(prev => prev + 120);
      alert('Simulated Ground Food Drive: +500 Meals Served, +120 Beneficiaries Helped!');
    },
    treeDrive: () => {
      setTreesOffset(prev => prev + 100);
      setBeneficiariesOffset(prev => prev + 30);
      alert('Simulated Tree Plantation Drive: +100 Trees Planted, +30 Beneficiaries Helped!');
    },
    healthCamp: () => {
      setBeneficiariesOffset(prev => prev + 250);
      alert('Simulated Health Camp Drive: +250 Beneficiaries Helped!');
    },
    corporateGrant: () => {
      setDonationsOffset(prev => prev + 25000);
      alert('Simulated Corporate Grant Received: +₹25,000 Total Donations!');
    },
  }), []);

  const stats = useMemo(() => ({ totals, simulate }), [totals, simulate]);

  return {
    activeTab,
    setActiveTab,
    users,
    volunteers,
    donations,
    events,
    registrations,
    certificates,
    notifications,
    stats,
  };
}
