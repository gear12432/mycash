export interface KycRecord {
  uid: string;
  panNumber: string;
  aadhaarNumber: string;
  panDocumentPath?: string;
  panDocumentUrl?: string;
  aadhaarFrontPath?: string;
  aadhaarFrontUrl?: string;
  aadhaarBackPath?: string;
  aadhaarBackUrl?: string;
  kycStatus: 'pending' | 'under_review' | 'verified' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}
