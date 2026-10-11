import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  generateUniqueUserId,
  createUserProfile,
  resolveIdentifierToEmail,
} from './userService';
import { submitKycRecord } from './kycService';
import { initializeWallet } from './walletService';
import { uploadKycDocument } from './storageService';
import { UserProfile, UserPrivateDetails } from '@/types/user';

export interface RegistrationFormData {
  // Step 1: Personal Details
  firstName: string;
  lastName: string;
  mobileNumber: string;
  gmailId: string;
  password: string;

  // Step 2: KYC Details
  panNumber: string;
  panFile?: File | null;
  aadhaarNumber: string;
  aadhaarFrontFile?: File | null;
  aadhaarBackFile?: File | null;
  profilePhotoFile?: File | null;

  // Step 3: Address Details
  fullAddress: string;
  state: string;
  district: string;
  pinCode: string;
  city: string;
}

export interface RegistrationSuccessResult {
  uid: string;
  userId: string; // e.g. PL18753
  email: string;
  firstName: string;
  lastName: string;
  profile: UserProfile;
}

export async function registerUser(data: RegistrationFormData): Promise<RegistrationSuccessResult> {
  const cleanEmail = data.gmailId.trim().toLowerCase();

  // 1. Create Firebase Auth account
  const authUserCredential = await createUserWithEmailAndPassword(auth, cleanEmail, data.password);
  const uid = authUserCredential.user.uid;

  // Update Auth display name
  await updateProfile(authUserCredential.user, {
    displayName: `${data.firstName} ${data.lastName}`,
  });

  // 2. Generate Unique Public User ID (PL + 5 digits)
  const publicUserId = await generateUniqueUserId();

  // 3. Upload KYC & Profile documents if provided
  let profilePhotoPath = '';
  let profilePhotoUrl = '';
  let panDocumentPath = '';
  let panDocumentUrl = '';
  let aadhaarFrontPath = '';
  let aadhaarFrontUrl = '';
  let aadhaarBackPath = '';
  let aadhaarBackUrl = '';

  if (data.profilePhotoFile) {
    const res = await uploadKycDocument(uid, 'profile', data.profilePhotoFile);
    profilePhotoPath = res.path;
    profilePhotoUrl = res.url;
  }

  if (data.panFile) {
    const res = await uploadKycDocument(uid, 'pan', data.panFile);
    panDocumentPath = res.path;
    panDocumentUrl = res.url;
  }

  if (data.aadhaarFrontFile) {
    const res = await uploadKycDocument(uid, 'aadhaarFront', data.aadhaarFrontFile);
    aadhaarFrontPath = res.path;
    aadhaarFrontUrl = res.url;
  }

  if (data.aadhaarBackFile) {
    const res = await uploadKycDocument(uid, 'aadhaarBack', data.aadhaarBackFile);
    aadhaarBackPath = res.path;
    aadhaarBackUrl = res.url;
  }

  // 4. Create User Profile & Address Private Details
  const privateDetails: UserPrivateDetails = {
    address: data.fullAddress,
    state: data.state,
    district: data.district,
    pinCode: data.pinCode,
    city: data.city,
    consentAccepted: true,
    updatedAt: new Date().toISOString(),
  };

  const userProfile = await createUserProfile(
    uid,
    publicUserId,
    {
      firstName: data.firstName,
      lastName: data.lastName,
      mobileNumber: data.mobileNumber,
      email: cleanEmail,
      profilePhotoPath,
      profilePhotoUrl,
      registrationStatus: 'completed',
      accountStatus: 'active',
      kycStatus: 'under_review',
    },
    privateDetails
  );

  // 5. Create KYC Record
  await submitKycRecord({
    uid,
    panNumber: data.panNumber.toUpperCase(),
    aadhaarNumber: data.aadhaarNumber.replace(/\s+/g, ''),
    panDocumentPath,
    panDocumentUrl,
    aadhaarFrontPath,
    aadhaarFrontUrl,
    aadhaarBackPath,
    aadhaarBackUrl,
    kycStatus: 'under_review',
    submittedAt: new Date().toISOString(),
  });

  // 6. Initialize Wallet with Welcome Bonus Coins (500 coins)
  await initializeWallet(uid);

  return {
    uid,
    userId: publicUserId,
    email: cleanEmail,
    firstName: data.firstName,
    lastName: data.lastName,
    profile: userProfile,
  };
}

export async function loginWithUserIdOrEmail(identifier: string, password: string) {
  const email = await resolveIdentifierToEmail(identifier);
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export async function sendPasswordReset(emailOrUserId: string) {
  const email = await resolveIdentifierToEmail(emailOrUserId);
  await sendPasswordResetEmail(auth, email);
}
