// services/api/payments.api.ts
// Payments API Service

import { PaymentVerification, WebhookPayload } from '@/types/api';
import { apiClient } from '../api.client';

// ============================================================================
// Payments Endpoints
// ============================================================================

export const paymentsApi = {
  /**
   * Verify payment by Tap charge ID
   * GET /api/payments/verify/{charge_id}/
   */
  verifyPayment: async (chargeId: string): Promise<PaymentVerification> => {
    return apiClient.get<PaymentVerification>(`/payments/verify/${chargeId}/`);
  },

  /**
   * Payment webhook (called by Tap, not by client directly)
   * POST /api/payments/webhook/
   */
  webhook: async (payload: WebhookPayload): Promise<{ status: string }> => {
    return apiClient.post<{ status: string }>('/payments/webhook/', payload);
  },
};

export default paymentsApi;
