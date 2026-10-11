export interface Wallet {
  uid: string;
  coinBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentOrder {
  paymentOrderId: string;
  uid: string;
  provider: 'UPI' | 'NETBANKING' | 'CARD' | 'MOCK_PG';
  amount: number; // In INR
  coinAmount: number; // phoneG coins
  currency: string;
  status: 'created' | 'verified' | 'failed';
  createdAt: string;
  verifiedAt?: string;
  paymentDetails?: Record<string, any>;
}
