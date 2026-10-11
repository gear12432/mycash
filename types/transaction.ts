export interface Transaction {
  transactionId: string;
  senderUid: string;
  senderUserId?: string;
  senderName?: string;
  recipientUid: string;
  recipientUserId?: string;
  recipientName?: string;
  transactionType: 'buy' | 'send' | 'receive' | 'bonus';
  coinAmount: number;
  fee: number;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  idempotencyKey?: string;
  note?: string;
}
