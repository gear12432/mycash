export interface UserProfile {
  uid: string;
  userId: string; // e.g. PL18753
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  profilePhotoPath?: string;
  profilePhotoUrl?: string;
  registrationStatus: 'draft' | 'completed';
  accountStatus: 'active' | 'suspended' | 'pending';
  kycStatus: 'pending' | 'under_review' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UserPrivateDetails {
  address: string;
  state: string;
  district: string;
  pinCode: string;
  city: string;
  consentAccepted: boolean;
  updatedAt: string;
}

export interface UserIdMapping {
  publicUserId: string;
  uid: string;
  email: string;
  createdAt: string;
}
