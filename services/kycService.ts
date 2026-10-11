import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { KycRecord } from '@/types/kyc';
import { handleFirestoreError, OperationType } from '@/lib/firebaseErrors';

export async function submitKycRecord(kycData: KycRecord): Promise<void> {
  const ref = doc(db, 'kycRecords', kycData.uid);
  try {
    await setDoc(ref, {
      ...kycData,
      submittedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `kycRecords/${kycData.uid}`);
  }
}

export async function getKycRecord(uid: string): Promise<KycRecord | null> {
  try {
    const snap = await getDoc(doc(db, 'kycRecords', uid));
    if (snap.exists()) {
      return snap.data() as KycRecord;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `kycRecords/${uid}`);
  }
}
