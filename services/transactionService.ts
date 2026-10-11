import {
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  runTransaction,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Transaction } from '@/types/transaction';
import { TRANSACTION_FEE_PERCENTAGE, MIN_TRANSACTION_FEE } from '@/lib/constants';
import { handleFirestoreError, OperationType } from '@/lib/firebaseErrors';

/**
 * Calculates transaction fee based on coin amount.
 */
export function calculateTransactionFee(coinAmount: number): number {
  const calculatedFee = (coinAmount * TRANSACTION_FEE_PERCENTAGE) / 100;
  return Math.max(MIN_TRANSACTION_FEE, Math.round(calculatedFee * 100) / 100);
}

/**
 * Sends coins from sender to recipient using an atomic Firestore transaction.
 */
export async function sendCoins(
  senderUid: string,
  senderUserId: string,
  senderName: string,
  recipientUid: string,
  recipientUserId: string,
  recipientName: string,
  coinAmount: number,
  note: string = ''
): Promise<{ transactionId: string; fee: number }> {
  if (senderUid === recipientUid) {
    throw new Error('You cannot send coins to yourself.');
  }

  if (coinAmount <= 0) {
    throw new Error('Transaction amount must be greater than zero.');
  }

  const fee = calculateTransactionFee(coinAmount);
  const totalDeduction = coinAmount + fee;

  const senderWalletRef = doc(db, 'wallets', senderUid);
  const recipientWalletRef = doc(db, 'wallets', recipientUid);
  const txId = `TX_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
  const transactionRef = doc(db, 'transactions', txId);
  const now = new Date().toISOString();

  try {
    await runTransaction(db, async (txn) => {
      const senderWalletSnap = await txn.get(senderWalletRef);
      if (!senderWalletSnap.exists()) {
        throw new Error('Sender wallet not found.');
      }

      const senderBalance = senderWalletSnap.data().coinBalance || 0;
      if (senderBalance < totalDeduction) {
        throw new Error(`Insufficient balance. You need ${totalDeduction} coins (${coinAmount} coins + ${fee} fee), but have ${senderBalance} coins.`);
      }

      const recipientWalletSnap = await txn.get(recipientWalletRef);
      const recipientBalance = recipientWalletSnap.exists()
        ? (recipientWalletSnap.data().coinBalance || 0)
        : 0;

      // Deduct from sender
      txn.set(senderWalletRef, {
        uid: senderUid,
        coinBalance: senderBalance - totalDeduction,
        updatedAt: now,
      }, { merge: true });

      // Add to recipient
      txn.set(recipientWalletRef, {
        uid: recipientUid,
        coinBalance: recipientBalance + coinAmount,
        updatedAt: now,
      }, { merge: true });

      // Create transaction log
      const newTx: Transaction = {
        transactionId: txId,
        senderUid,
        senderUserId,
        senderName,
        recipientUid,
        recipientUserId,
        recipientName,
        transactionType: 'send',
        coinAmount,
        fee,
        status: 'completed',
        createdAt: now,
        idempotencyKey: `IDEM_${txId}`,
        note: note || `Transfer to ${recipientUserId}`,
      };

      txn.set(transactionRef, newTx);
    });

    return { transactionId: txId, fee };
  } catch (error) {
    if (error instanceof Error && error.message.includes('Insufficient balance')) {
      throw error;
    }
    handleFirestoreError(error, OperationType.WRITE, `transactions/${txId}`);
  }
}

/**
 * Real-time listener for user's transaction history (where user is sender or recipient).
 */
export function subscribeToUserTransactions(
  uid: string,
  onUpdate: (transactions: Transaction[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const transactionsCol = collection(db, 'transactions');
  
  // Realtime snapshot listener on sender transactions
  const qSender = query(
    transactionsCol,
    where('senderUid', '==', uid)
  );

  const qRecipient = query(
    transactionsCol,
    where('recipientUid', '==', uid)
  );

  let senderTxs: Transaction[] = [];
  let recipientTxs: Transaction[] = [];

  const mergeAndNotify = () => {
    const map = new Map<string, Transaction>();
    [...senderTxs, ...recipientTxs].forEach(tx => map.set(tx.transactionId, tx));
    const combined = Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    onUpdate(combined);
  };

  const unsub1 = onSnapshot(
    qSender,
    (snap) => {
      senderTxs = snap.docs.map(doc => doc.data() as Transaction);
      mergeAndNotify();
    },
    (err) => {
      console.error('Sender transaction snapshot error:', err);
      if (onError) onError(err);
    }
  );

  const unsub2 = onSnapshot(
    qRecipient,
    (snap) => {
      recipientTxs = snap.docs.map(doc => doc.data() as Transaction);
      mergeAndNotify();
    },
    (err) => {
      console.error('Recipient transaction snapshot error:', err);
      if (onError) onError(err);
    }
  );

  return () => {
    unsub1();
    unsub2();
  };
}
