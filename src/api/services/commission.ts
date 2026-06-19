import { apiClient } from '../client';
import API_CONFIG from '../config';

export interface CommissionDueStatus {
  amountDue: number;
  totalCommissionCharged: number;
  totalCommissionCleared: number;
  commissionDueAt: string | null;
  daysLeft: number | null;
  isPaymentOverdue: boolean;
  hasPendingSubmission: boolean;
  pendingPayment: CommissionPayment | null;
}

export interface CommissionPayment {
  id: string;
  workerId: string;
  amount: number;
  proofImageUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  dueDate: string;
  periodStart: string;
  periodEnd: string;
  submittedAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
}

export interface AdminPendingPayment extends CommissionPayment {
  worker: {
    id: string;
    walletBalance: number;
    user: { fullName: string; phoneNumber: string; profilePicUrl?: string };
  };
}

export async function getCommissionDue(workerId: string): Promise<CommissionDueStatus> {
  return apiClient.get<CommissionDueStatus>(API_CONFIG.ENDPOINTS.COMMISSION_DUE(workerId));
}

export async function submitCommissionProof(
  workerId: string,
  proofImageUrl: string,
): Promise<CommissionPayment> {
  return apiClient.post<CommissionPayment>(API_CONFIG.ENDPOINTS.COMMISSION_PAY(workerId), {
    proofImageUrl,
  });
}

export async function getWorkerCommissionPayments(
  workerId: string,
  skip = 0,
  take = 20,
): Promise<{ data: CommissionPayment[]; total: number }> {
  const url = `${API_CONFIG.ENDPOINTS.COMMISSION_PAYMENTS(workerId)}?skip=${skip}&take=${take}`;
  return apiClient.get<{ data: CommissionPayment[]; total: number }>(url);
}

export async function getAdminPendingPayments(
  skip = 0,
  take = 20,
): Promise<{ data: AdminPendingPayment[]; total: number }> {
  const url = `${API_CONFIG.ENDPOINTS.COMMISSION_ADMIN_PENDING}?skip=${skip}&take=${take}`;
  return apiClient.get<{ data: AdminPendingPayment[]; total: number }>(url);
}

export async function approveCommissionPayment(
  paymentId: string,
): Promise<{ success: boolean }> {
  return apiClient.post<{ success: boolean }>(
    API_CONFIG.ENDPOINTS.COMMISSION_ADMIN_APPROVE(paymentId),
    {},
  );
}

export async function rejectCommissionPayment(
  paymentId: string,
  reason: string,
): Promise<{ success: boolean }> {
  return apiClient.post<{ success: boolean }>(
    API_CONFIG.ENDPOINTS.COMMISSION_ADMIN_REJECT(paymentId),
    { reason },
  );
}
