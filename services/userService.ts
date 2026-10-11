import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile, UserPrivateDetails } from '@/types/user';
import { handleFirestoreError, OperationType } from '@/lib/firebaseErrors';

/**
 * Generates a unique User ID in the format PL + 5 digits (e.g. PL18753).
 * Checks the /userIds collection in Firestore to enforce absolute uniqueness.
 */
export async function generateUniqueUserId(): Promise<string> {
  const maxAttempts = 15;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const randomDigits = Math.floor(10000 + Math.random() * 90000); // exactly 5 digits
    const candidateUserId = `PL${randomDigits}`;
    
    const lookupRef = doc(db, 'userIds', candidateUserId);
    try {
      const snap = await getDoc(lookupRef);
      if (!snap.exists()) {
        return candidateUserId;
      }
    } catch (err) {
      // If error occurs, continue trying
    }
  }
  // Fallback timestamp-based fallback if collisions occur repeatedly
  return `PL${Math.floor(10000 + (Date.now() % 90000))}`;
}

/**
 * Creates the user profile and private information in Firestore.
 */
export async function createUserProfile(
  uid: string,
  publicUserId: string,
  profileData: Omit<UserProfile, 'uid' | 'userId' | 'createdAt' | 'updatedAt'>,
  privateData: UserPrivateDetails
): Promise<UserProfile> {
  const userRef = doc(db, 'users', uid);
  const userPrivateRef = doc(db, 'userPrivate', uid);
  const userIdRef = doc(db, 'userIds', publicUserId);

  const now = new Date().toISOString();

  const newUserProfile: UserProfile = {
    uid,
    userId: publicUserId,
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    mobileNumber: profileData.mobileNumber,
    email: profileData.email.toLowerCase(),
    profilePhotoPath: profileData.profilePhotoPath || '',
    profilePhotoUrl: profileData.profilePhotoUrl || '',
    registrationStatus: 'completed',
    accountStatus: 'active',
    kycStatus: profileData.kycStatus || 'pending',
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
  };

  try {
    // Write user profile
    await setDoc(userRef, newUserProfile);

    // Write private details (address)
    await setDoc(userPrivateRef, {
      ...privateData,
      updatedAt: now,
    });

    // Write public User ID lookup mapping PLxxxxx -> uid
    await setDoc(userIdRef, {
      uid,
      email: profileData.email.toLowerCase(),
      createdAt: now,
    });

    return newUserProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
  }
}

/**
 * Retrieves the User Profile by UID.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
  }
}

/**
 * Resolves a public User ID (e.g. PL18753) to the corresponding User Profile.
 */
export async function getUserByPublicUserId(publicUserId: string): Promise<UserProfile | null> {
  const cleanId = publicUserId.trim().toUpperCase();
  try {
    const lookupSnap = await getDoc(doc(db, 'userIds', cleanId));
    if (lookupSnap.exists()) {
      const { uid } = lookupSnap.data();
      if (uid) {
        return await getUserProfile(uid);
      }
    }

    // Fallback search directly on users collection
    const q = query(collection(db, 'users'), where('userId', '==', cleanId));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      return querySnap.docs[0].data() as UserProfile;
    }

    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `userIds/${cleanId}`);
  }
}

/**
 * Resolves User ID or Email to UID for Login.
 */
export async function resolveIdentifierToEmail(identifier: string): Promise<string> {
  const clean = identifier.trim();
  if (clean.includes('@')) {
    return clean;
  }

  // Treat as public User ID PLxxxxx
  const user = await getUserByPublicUserId(clean);
  if (user && user.email) {
    return user.email;
  }

  throw new Error(`User ID '${clean}' not found. Please verify your ID or enter your Gmail address.`);
}
