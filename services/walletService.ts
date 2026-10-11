import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  runTransaction,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Wallet, PaymentOrder } from '@/types/wallet';
import { INITIAL_SIGNUP_BONUS_COINS } from '@/lib/constants';
import { handleFirestoreError, OperationType } from '@/lib/firebaseErrors';

/**
 * Initializes a new user's wallet with signup bonus coins.
 */
export async function initializeWallet(uid: string): Promise<Wallet> {
  const walletRef = doc(db, 'wallets', uid);
  const now = new Date().toISOString();

  const newWallet: Wallet = {
    uid,
    coinBalance: INITIAL_SIGNUP_BONUS_COINS,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(walletRef, newWallet);
    return newWallet;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `wallets/${uid}`);
  }
}

/**
 * Fetches user's wallet record.
 */
export async function getWallet(uid: string): Promise<Wallet | null> {
  try {
    const snap = await getDoc(doc(db, 'wallets', uid));
    if (snap.exists()) {
      return snap.data() as Wallet;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `wallets/${uid}`);
  }
}

/**
 * Real-time listener for user's wallet balance.
 */
export function subscribeToWallet(
  uid: string,
  onUpdate: (wallet: Wallet | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const walletRef = doc(db, 'wallets', uid);
  return onSnapshot(
    walletRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as Wallet);
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      console.error('Wallet snapshot error:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Buys coins: Creates a payment order, verifies it, and credits user's wallet atomically.
 */
export async function buyCoins(
  uid: string,
  amountInr: number,
  coinAmount: number,
  provider: 'UPI' | 'NETBANKING' | 'CARD' | 'MOCK_PG'
): Promise<{ paymentOrderId: string; newBalance: number }> {
  const paymentOrderId = `ORD_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const orderRef = doc(db, 'paymentOrders', paymentOrderId);
  const walletRef = doc(db, 'wallets', uid);
  const transactionRef = doc(db, 'transactions', `TX_BUY_${paymentOrderId}`);

  const now = new Date().toISOString();

  const orderData: PaymentOrder = {
    paymentOrderId,
    uid,
    provider,
    amount: amountInr,
    coinAmount,
    currency: 'INR',
    status: 'verified',
    createdAt: now,
    verifiedAt: now,
  };

  try {
    let updatedBalance = 0;

    await runTransaction(db, async (txn) => {
      const walletSnap = await txn.get(walletRef);
      const currentBalance = walletSnap.exists() ? (walletSnap.data().coinBalance || 0) : 0;
      updatedBalance = currentBalance + coinAmount;

      // 1. Create payment order record
      txn.set(orderRef, orderData);

      // 2. Update wallet balance
      txn.set(walletRef, {
        uid,
        coinBalance: updatedBalance,
        updatedAt: now,
      }, { merge: true });

      // 3. Create transaction log
      txn.set(transactionRef, {
        transactionId: `TX_BUY_${paymentOrderId}`,
        senderUid: 'phoneG_BANK',
        senderUserId: 'phoneG Official',
        recipientUid: uid,
        recipientUserId: 'Self',
        transactionType: 'buy',
        coinAmount,
        fee: 0,
        status: 'completed',
        createdAt: now,
        note: `Bought ${coinAmount} phoneG coins via ${provider}`,
      });
    });

    return { paymentOrderId, newBalance: updatedBalance };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `paymentOrders/${paymentOrderId}`);
  }
}
