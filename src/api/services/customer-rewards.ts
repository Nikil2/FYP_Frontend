import { apiClient } from '../client';
import API_CONFIG from '../config';

export interface RewardSummary {
  rewardPoints: number;
  totalPointsEarned: number;
  referralCode: string | null;
  totalReferrals: number;
  totalSpent: number;
  totalBookings: number;
  thisMonthSpent: number;
  spendingByCategory: Record<string, number>;
}

export interface PointTransaction {
  id: string;
  customerId: string;
  type:
    | 'EARN_BOOKING'
    | 'EARN_COMPLETION'
    | 'EARN_REVIEW'
    | 'EARN_REFERRAL'
    | 'ADMIN_ADJUSTMENT';
  points: number;
  balanceAfter: number;
  bookingId: string | null;
  description: string;
  createdAt: string;
}

export async function getRewardSummary(userId: string): Promise<RewardSummary> {
  return apiClient.get<RewardSummary>(API_CONFIG.ENDPOINTS.CUSTOMER_REWARDS_SUMMARY(userId));
}

export async function getPointTransactions(
  userId: string,
  skip = 0,
  take = 50,
): Promise<{ data: PointTransaction[]; total: number }> {
  const url = `${API_CONFIG.ENDPOINTS.CUSTOMER_REWARDS_TRANSACTIONS(userId)}?skip=${skip}&take=${take}`;
  return apiClient.get<{ data: PointTransaction[]; total: number }>(url);
}
