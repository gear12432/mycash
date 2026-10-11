'use client';

import React, { useState } from 'react';
import { AppHeader } from '@/components/common/AppHeader';
import { RegistrationStepper } from '@/components/registration/RegistrationStepper';
import { PersonalDetailsForm, Step1Data } from '@/components/registration/PersonalDetailsForm';
import { KycDetailsForm, Step2Data } from '@/components/registration/KycDetailsForm';
import { AddressDetailsForm, Step3Data } from '@/components/registration/AddressDetailsForm';
import { RegistrationSuccessModal } from '@/components/registration/RegistrationSuccessModal';
import { registerUser, RegistrationSuccessResult } from '@/services/authService';
import { ToastMessage } from '@/components/common/ToastMessage';
import { LoadingOverlay } from '@/components/common/LoadingOverlay';

interface RegisterPageProps {
  onBackToLogin: () => void;
  onRegistrationComplete: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onBackToLogin,
  onRegistrationComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [step1Data, setStep1Data] = useState<Step1Data>({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    gmailId: '',
    password: '',
    confirmPassword: '',
  });

  const [step2Data, setStep2Data] = useState<Step2Data>({
    panNumber: '',
    panFile: null,
    aadhaarNumber: '',
    aadhaarFrontFile: null,
    aadhaarBackFile: null,
    profilePhotoFile: null,
  });

  const [step3Data, setStep3Data] = useState<Step3Data>({
    fullAddress: '',
    state: '',
    district: '',
    pinCode: '',
    city: '',
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; msg: string } | null>(null);
  const [successResult, setSuccessResult] = useState<RegistrationSuccessResult | null>(null);

  const handleStep1Next = (data: Step1Data) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const handleStep2Next = (data: Step2Data) => {
    setStep2Data(data);
    setCurrentStep(3);
  };

  const handleStep3Submit = async (data: Step3Data) => {
    setStep3Data(data);
    setSubmitting(true);

    try {
      const result = await registerUser({
        ...step1Data,
        ...step2Data,
        ...data,
      });

      setSuccessResult(result);
    } catch (err: any) {
      console.error('Registration error:', err);
      const msg = err.message || 'Account creation failed. Please try again.';
      setToast({ type: 'error', msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#191F2C] text-white flex flex-col justify-between max-w-md mx-auto shadow-2xl">
      {toast && (
        <ToastMessage
          type={toast.type}
          message={toast.msg}
          onClose={() => setToast(null)}
        />
      )}

      <LoadingOverlay
        isLoading={submitting}
        message="Creating your phoneG account & generating PL User ID..."
      />

      <AppHeader
        title="Create Account"
        showBack
        onBack={() => {
          if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
          } else {
            onBackToLogin();
          }
        }}
      />

      <RegistrationStepper currentStep={currentStep} />

      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="w-full bg-white rounded-2xl shadow-xl p-5 border border-gray-100 text-[#20244F]">
          {currentStep === 1 && (
            <PersonalDetailsForm
              initialData={step1Data}
              onNext={handleStep1Next}
              onBackToLogin={onBackToLogin}
            />
          )}

          {currentStep === 2 && (
            <KycDetailsForm
              initialData={step2Data}
              onNext={handleStep2Next}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <AddressDetailsForm
              initialData={step3Data}
              onSubmit={handleStep3Submit}
              onBack={() => setCurrentStep(2)}
              isLoading={submitting}
            />
          )}
        </div>
      </div>

      {successResult && (
        <RegistrationSuccessModal
          isOpen={!!successResult}
          userId={successResult.userId}
          uid={successResult.uid}
          userName={`${successResult.firstName} ${successResult.lastName}`}
          onContinueToHome={onRegistrationComplete}
        />
      )}
    </div>
  );
};

export default RegisterPage;
