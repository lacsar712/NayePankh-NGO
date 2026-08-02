import { useState, useEffect, useCallback } from 'react';
import { isConfigured } from '../../../firebase/config';
import {
  fetchRegistrations,
  persistRegistrations,
  deleteRegistrationRemote,
  markAttendedRemote,
} from '../services/registrationsService';

/**
 * 【logic 层｜hooks】报名域 Hook。
 * @param {{
 *   addCertificate: (certData: object) => Promise<object>,
 *   sigImage: string,
 *   stampImage: string
 * }} deps 由编排 Hook 注入（markAttended 需要签发证书并带上品牌资产）
 * @returns {{
 *   list: Array,
 *   remove: (id: string|number) => Promise<void>,
 *   markAttended: (reg: object) => Promise<void>
 * }}
 */
export function useAdminRegistrations({ addCertificate, sigImage, stampImage }) {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetchRegistrations().then(list => {
      if (!cancelled) setRegistrations(list);
    });
    return () => { cancelled = true; };
  }, []);

  const remove = useCallback(async (id) => {
    if (isConfigured) {
      const ok = await deleteRegistrationRemote(id);
      if (ok) {
        setRegistrations(prev => prev.filter(r => r.id !== id));
      }
    } else {
      // 行为保持：本地模式支持按 id 或行索引删除
      const filtered = registrations.filter((r, idx) => r.id !== id && idx !== id);
      setRegistrations(filtered);
      persistRegistrations(filtered);
    }
  }, [registrations]);

  const markAttended = useCallback(async (reg) => {
    const certId = 'CERT-EVT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const formattedDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    await markAttendedRemote(reg.id);

    const updated = registrations.map(r =>
      (r.id === reg.id || (r.eventId === reg.eventId && r.email === reg.email))
        ? { ...r, status: 'attended' }
        : r
    );
    setRegistrations(updated);
    persistRegistrations(updated);

    await addCertificate({
      certificateId: certId,
      userId: reg.userId || 'guest',
      name: reg.name,
      email: reg.email,
      eventId: reg.eventId,
      eventTitle: reg.eventTitle || 'NayePankh Campaign Drive',
      date: formattedDate,
      hours: 6,
      signatureUrl: sigImage || '',
      stampUrl: stampImage || '',
    });

    alert(`Success! ${reg.name} has been marked as attended. Certificate ${certId} generated.`);
  }, [registrations, addCertificate, sigImage, stampImage]);

  return { list: registrations, remove, markAttended };
}
