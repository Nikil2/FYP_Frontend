/**
 * Bonus & Wallet API Service
 * Worker rewards: tier progress, bonus history, and wallet top-up.
 */

import { apiClient } from '../client';
import API_CONFIG from '../config';

export type WorkerTier = 'NONE' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface BonusProgress {
  workerId: string;
  totalJobsCompleted: number;
  currentTier: WorkerTier;
  walletBalance: number | string;
  bonusWindow: {
    size: number;
    jobsInWindow: number;
    jobsToNextBonus: number;
    progressPercent: number;
  };
  nextTier: { tier: WorkerTier; jobsRemaining: number } | null;
  eligibility: {
    rating: number;
    minRating: number;
    ratingOk: boolean;
    hasActiveFraud: boolean;
    isBonusSuspended: boolean;
  };
}

export interface BonusRecord {
  id: string;
  tier: WorkerTier;
  windowIndex: number;
  commissionCollected: string;
  cashbackRate: string;
  bonusAmount: string;
  status: 'PENDING' | 'PAID' | 'REJECTED';
  reason?: string | null;
  createdAt: string;
}

export interface WalletSummary {
  workerId: string;
  balance: number | string;
  availableBalance: number | string;
  totalEarnings: number | string;
  thisMonthEarnings: number | string;
  totalCommissionPaid: number | string;
  totalBonusEarned: number | string;
}

export interface WalletTransaction {
  id: string;
  type:
    | 'COMMISSION_DEBIT'
    | 'BONUS_CREDIT'
    | 'TOPUP_CREDIT'
    | 'WITHDRAWAL_DEBIT'
    | 'ADJUSTMENT';
  amount: string;
  balanceAfter: string;
  description: string;
  bookingId?: string | null;
  bonusId?: string | null;
  createdAt: string;
}

function unwrap<T>(res: T | { data?: T }): T {
  if (res && typeof res === 'object' && 'data' in (res as Record<string, unknown>)) {
    const wrapped = res as { data?: T };
    if (typeof wrapped.data !== 'undefined') return wrapped.data as T;
  }
  return res as T;
}

export async function getBonusProgress(workerId: string): Promise<BonusProgress> {
  const res = await apiClient.get<BonusProgress | { data?: BonusProgress }>(
    API_CONFIG.ENDPOINTS.BONUS_PROGRESS(workerId),
  );
  return unwrap(res);
}

export async function getBonusHistory(
  workerId: string,
): Promise<{ data: BonusRecord[]; total: number }> {
  const res = await apiClient.get<{ data: BonusRecord[]; total: number }>(
    API_CONFIG.ENDPOINTS.BONUS_HISTORY(workerId),
  );
  const payload = unwrap(res) as { data?: BonusRecord[]; total?: number };
  return { data: payload.data ?? [], total: payload.total ?? 0 };
}

export async function getWalletSummary(workerId: string): Promise<WalletSummary> {
  const res = await apiClient.get<WalletSummary | { data?: WalletSummary }>(
    API_CONFIG.ENDPOINTS.WALLET_SUMMARY(workerId),
  );
  return unwrap(res);
}

export async function getWalletTransactions(
  workerId: string,
): Promise<WalletTransaction[]> {
  const res = await apiClient.get<
    { data: WalletTransaction[] } | WalletTransaction[]
  >(API_CONFIG.ENDPOINTS.WALLET_TRANSACTIONS(workerId));
  const payload = unwrap(res) as { data?: WalletTransaction[] } | WalletTransaction[];
  if (Array.isArray(payload)) return payload;
  return payload.data ?? [];
}

export async function topupWallet(
  workerId: string,
  amount: number,
): Promise<{ workerId: string; amountAdded: number; balance: string }> {
  const res = await apiClient.post(API_CONFIG.ENDPOINTS.WALLET_TOPUP(workerId), {
    amount,
  });
  return unwrap(res) as { workerId: string; amountAdded: number; balance: string };
}

export const TIER_META: Record<WorkerTier, { label: string; labelUr: string; color: string; emoji: string }> = {
  NONE: { label: 'New', labelUr: 'نیا', color: '#9CA3AF', emoji: '🌱' },
  BRONZE: { label: 'Bronze', labelUr: 'برانز', color: '#CD7F32', emoji: '🥉' },
  SILVER: { label: 'Silver', labelUr: 'سلور', color: '#9CA3AF', emoji: '🥈' },
  GOLD: { label: 'Gold', labelUr: 'گولڈ', color: '#D4AF37', emoji: '🥇' },
  PLATINUM: { label: 'Platinum', labelUr: 'پلاٹینم', color: '#5B8DEF', emoji: '💎' },
};
