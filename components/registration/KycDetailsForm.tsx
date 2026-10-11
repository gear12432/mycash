'use client';

import React, { useState } from 'react';
import { AppInput } from '../common/AppInput';
import { DocumentUpload } from './DocumentUpload';
import { AppButton } from '../common/AppButton';
import { validatePan, validateAadhaar } from '@/lib/validators';
import { ArrowLeft, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';

export interface Step2Data {
  panNumber: string;
  panFile: File | null;
  aadhaarNumber: string;
  aadhaarFrontFile: File | null;
  aadhaarBackFile: File | null;
  profilePhotoFile: File | null;
}

interface KycDetailsFormProps {
  initialData: Step2Data;
  onNext: (data: Step2Data) => void;
  onBack: () => void;
}

export const KycDetailsForm: React.FC<KycDetailsFormProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const [formData, setFormData] = useState<Step2Data>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof Step2Data, string>>>({});

  const handleChange = (field: keyof Step2Data, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof Step2Data, string>> = {};

    if (!formData.panNumber.trim()) {
      errs.panNumber = 'PAN number is required';
    } else if (!validatePan(formData.panNumber)) {
      errs.panNumber = 'Invalid PAN format (e.g. ABCDE1234F)';
    }

    if (!formData.panFile) {
      errs.panFile = 'Please upload a photo of your PAN card';
    }

    if (!formData.aadhaarNumber.trim()) {
      errs.aadhaarNumber = 'Aadhaar number is required';
    } else if (!validateAadhaar(formData.aadhaarNumber)) {
      errs.aadhaarNumber = 'Aadhaar must be a 12-digit number';
    }

    if (!formData.aadhaarFrontFile) {
      errs.aadhaarFrontFile = 'Please upload Aadhaar Front photo';
    }

    if (!formData.aadhaarBackFile) {
      errs.aadhaarBackFile = 'Please upload Aadhaar Back photo';
    }

    if (!formData.profilePhotoFile) {
      errs.profilePhotoFile = 'Please upload your profile photo';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="border-b border-gray-100 pb-2">
        <h3 className="text-base font-bold text-[#20244F]">Step 2: KYC Details</h3>
        <p className="text-xs text-gray-500">Provide official identity documents for verification</p>
      </div>

      <AppInput
        label="PAN Card Number"
        placeholder="ABCDE1234F"
        maxLength={10}
        value={formData.panNumber}
        onChange={(e) => handleChange('panNumber', e.target.value.toUpperCase())}
        error={errors.panNumber}
        leftIcon={<CreditCard className="w-4 h-4" />}
      />

      <DocumentUpload
        label="PAN Card Photo"
        file={formData.panFile}
        onChange={(file) => handleChange('panFile', file)}
        error={errors.panFile}
      />

      <AppInput
        label="Aadhaar Card Number"
        placeholder="12-digit Aadhaar Number"
        maxLength={12}
        value={formData.aadhaarNumber}
        onChange={(e) => handleChange('aadhaarNumber', e.target.value.replace(/\D/g, ''))}
        error={errors.aadhaarNumber}
        leftIcon={<ShieldCheck className="w-4 h-4" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <DocumentUpload
          label="Aadhaar Front Photo"
          file={formData.aadhaarFrontFile}
          onChange={(file) => handleChange('aadhaarFrontFile', file)}
          error={errors.aadhaarFrontFile}
        />
        <DocumentUpload
          label="Aadhaar Back Photo"
          file={formData.aadhaarBackFile}
          onChange={(file) => handleChange('aadhaarBackFile', file)}
          error={errors.aadhaarBackFile}
        />
      </div>

      <DocumentUpload
        label="Your Profile Photo / Selfie"
        file={formData.profilePhotoFile}
        onChange={(file) => handleChange('profilePhotoFile', file)}
        error={errors.profilePhotoFile}
      />

      <div className="pt-3 flex space-x-3">
        <AppButton
          type="button"
          variant="outline"
          onClick={onBack}
          icon={<ArrowLeft className="w-4 h-4" />}
          className="w-1/3"
        >
          BACK
        </AppButton>
        <AppButton
          type="submit"
          variant="primary"
          icon={<ArrowRight className="w-4 h-4" />}
          className="w-2/3"
        >
          ADDRESS DETAILS
        </AppButton>
      </div>
    </form>
  );
};
