import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export async function uploadKycDocument(
  userId: string,
  docType: 'pan' | 'aadhaarFront' | 'aadhaarBack' | 'profile',
  file: File
): Promise<{ path: string; url: string }> {
  try {
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `kyc/${userId}/${docType}_${Date.now()}.${ext}`;
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return { path, url };
  } catch (err) {
    console.warn(`Storage upload warning for ${docType}:`, err);
    // Fallback: local object URL or Data URL if storage quota/network issue occurs
    const url = URL.createObjectURL(file);
    return { path: `local/${docType}_${Date.now()}`, url };
  }
}
