'use client';

import React, { useState } from 'react';
import { AppInput } from '../common/AppInput';
import { AppButton } from '../common/AppButton';
import { INDIAN_STATES_DISTRICTS } from '@/lib/constants';
import { validatePinCode } from '@/lib/validators';
import { MapPin, ArrowLeft, CheckCircle } from 'lucide-react';

export interface Step3Data {
  fullAddress: string;
  state: string;
  district: string;
  pinCode: string;
  city: string;
}

interface AddressDetailsFormProps {
  initialData: Step3Data;
  onSubmit: (data: Step3Data) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const AddressDetailsForm: React.FC<AddressDetailsFormProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Step3Data>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof Step3Data, string>>>({});

  const stateList = Object.keys(INDIAN_STATES_DISTRICTS);
  const districtList = formData.state ? INDIAN_STATES_DISTRICTS[formData.state] || [] : [];

  const handleChange = (field: keyof Step3Data, value: string) => {
    if (field === 'state') {
      setFormData((prev) => ({ ...prev, state: value, district: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof Step3Data, string>> = {};

    if (!formData.fullAddress.trim()) errs.fullAddress = 'Address is required';
    if (!formData.state) errs.state = 'Please select a State';
    if (!formData.district) errs.district = 'Please select a District';

    if (!formData.pinCode.trim()) {
      errs.pinCode = 'PIN Code is required';
    } else if (!validatePinCode(formData.pinCode)) {
      errs.pinCode = 'Must be a 6-digit Indian PIN Code';
    }

    if (!formData.city.trim()) errs.city = 'City/Town is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="border-b border-gray-100 pb-2">
        <h3 className="text-base font-bold text-[#20244F]">Step 3: Address Details</h3>
        <p className="text-xs text-gray-500">Provide your official residential address</p>
      </div>

      <AppInput
        label="Your Full Address"
        placeholder="House No, Street, Landmark"
        value={formData.fullAddress}
        onChange={(e) => handleChange('fullAddress', e.target.value)}
        error={errors.fullAddress}
        leftIcon={<MapPin className="w-4 h-4" />}
      />

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-[#20244F] uppercase tracking-wider">
          State
        </label>
        <select
          value={formData.state}
          onChange={(e) => handleChange('state', e.target.value)}
          className={`w-full bg-white border ${
            errors.state ? 'border-red-500' : 'border-[#D8D8D8]'
          } text-[#20244F] rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-[#397EF5]/20 focus:border-[#397EF5]`}
        >
          <option value="">Select State</option>
          {stateList.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
        {errors.state && <p className="text-xs text-red-500 pl-1">{errors.state}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-[#20244F] uppercase tracking-wider">
          District
        </label>
        <select
          value={formData.district}
          onChange={(e) => handleChange('district', e.target.value)}
          disabled={!formData.state}
          className={`w-full bg-white border ${
            errors.district ? 'border-red-500' : 'border-[#D8D8D8]'
          } text-[#20244F] rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-[#397EF5]/20 focus:border-[#397EF5] disabled:bg-gray-100`}
        >
          <option value="">
            {formData.state ? 'Select District' : 'First Select State'}
          </option>
          {districtList.map((dst) => (
            <option key={dst} value={dst}>
              {dst}
            </option>
          ))}
        </select>
        {errors.district && <p className="text-xs text-red-500 pl-1">{errors.district}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <AppInput
          label="PIN Code"
          placeholder="6 digits"
          maxLength={6}
          value={formData.pinCode}
          onChange={(e) => handleChange('pinCode', e.target.value.replace(/\D/g, ''))}
          error={errors.pinCode}
        />

        <AppInput
          label="City / Town"
          placeholder="City"
          value={formData.city}
          onChange={(e) => handleChange('city', e.target.value)}
          error={errors.city}
        />
      </div>

      <div className="pt-3 flex space-x-3">
        <AppButton
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
          icon={<ArrowLeft className="w-4 h-4" />}
          className="w-1/3"
        >
          BACK
        </AppButton>

        <AppButton
          type="submit"
          variant="primary"
          isLoading={isLoading}
          icon={<CheckCircle className="w-4 h-4" />}
          className="w-2/3"
        >
          CONFIRM & CREATE ACCOUNT
        </AppButton>
      </div>
    </form>
  );
};
