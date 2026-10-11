'use client';

import React, { useState } from 'react';
import { AppInput } from '../common/AppInput';
import { PasswordInput } from '../auth/PasswordInput';
import { AppButton } from '../common/AppButton';
import {
  validateEmail,
  validateMobile,
  checkPasswordStrength,
} from '@/lib/validators';
import { User, Phone, Mail, ArrowRight } from 'lucide-react';

export interface Step1Data {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  gmailId: string;
  password: string;
  confirmPassword: string;
}

interface PersonalDetailsFormProps {
  initialData: Step1Data;
  onNext: (data: Step1Data) => void;
  onBackToLogin: () => void;
}

export const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
  initialData,
  onNext,
  onBackToLogin,
}) => {
  const [formData, setFormData] = useState<Step1Data>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof Step1Data, string>>>({});

  const handleChange = (field: keyof Step1Data, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof Step1Data, string>> = {};

    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';

    if (!formData.mobileNumber.trim()) {
      errs.mobileNumber = 'Mobile number is required';
    } else if (!validateMobile(formData.mobileNumber)) {
      errs.mobileNumber = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.gmailId.trim()) {
      errs.gmailId = 'Gmail address is required';
    } else if (!validateEmail(formData.gmailId)) {
      errs.gmailId = 'Enter a valid Gmail address (e.g. name@gmail.com)';
    }

    const pwdStrength = checkPasswordStrength(formData.password);
    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (!pwdStrength.isValid) {
      errs.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
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

  const pwdStrength = checkPasswordStrength(formData.password);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="border-b border-gray-100 pb-2">
        <h3 className="text-base font-bold text-[#20244F]">Step 1: Personal Details</h3>
        <p className="text-xs text-gray-500">Enter your basic personal and security info</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <AppInput
          label="First Name"
          placeholder="First name"
          value={formData.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          error={errors.firstName}
          leftIcon={<User className="w-4 h-4" />}
        />
        <AppInput
          label="Last Name"
          placeholder="Last name"
          value={formData.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          error={errors.lastName}
        />
      </div>

      <AppInput
        label="Mobile Number"
        placeholder="10-digit Mobile number"
        maxLength={10}
        type="tel"
        value={formData.mobileNumber}
        onChange={(e) => handleChange('mobileNumber', e.target.value.replace(/\D/g, ''))}
        error={errors.mobileNumber}
        leftIcon={<Phone className="w-4 h-4" />}
      />

      <AppInput
        label="Gmail ID"
        placeholder="yourname@gmail.com"
        type="email"
        value={formData.gmailId}
        onChange={(e) => handleChange('gmailId', e.target.value)}
        error={errors.gmailId}
        leftIcon={<Mail className="w-4 h-4" />}
      />

      <div>
        <PasswordInput
          label="Password"
          placeholder="Create a strong password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          error={errors.password}
        />
        {formData.password && (
          <div className="mt-1 flex items-center space-x-2">
            <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  pwdStrength.score <= 1
                    ? 'bg-red-500 w-1/4'
                    : pwdStrength.score === 2
                    ? 'bg-amber-500 w-2/4'
                    : pwdStrength.score === 3
                    ? 'bg-blue-500 w-3/4'
                    : 'bg-emerald-500 w-full'
                }`}
              />
            </div>
            <span className="text-[10px] text-gray-500 font-medium">
              {pwdStrength.feedback}
            </span>
          </div>
        )}
      </div>

      <PasswordInput
        label="Confirm Password"
        placeholder="Re-enter your password"
        value={formData.confirmPassword}
        onChange={(e) => handleChange('confirmPassword', e.target.value)}
        error={errors.confirmPassword}
      />

      <div className="pt-3 space-y-2">
        <AppButton type="submit" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
          CONTINUE TO KYC DETAILS
        </AppButton>
        <button
          type="button"
          onClick={onBackToLogin}
          className="w-full text-center text-xs text-gray-500 hover:text-[#397EF5] py-2"
        >
          Already registered? Back to Login
        </button>
      </div>
    </form>
  );
};
