import React from 'react';

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
  checked,
  onChange,
  error,
}) => {
  return (
    <div className="space-y-1">
      <label className="flex items-start space-x-2.5 cursor-pointer text-left">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 w-4 h-4 text-[#397EF5] rounded border-gray-300 focus:ring-[#397EF5]"
        />
        <span className="text-xs text-gray-600 leading-tight">
          I agree to the{' '}
          <span className="text-[#397EF5] font-semibold hover:underline">
            Terms & Conditions
          </span>{' '}
          and Privacy Policy of phoneG.
        </span>
      </label>
      {error && <p className="text-xs text-red-500 pl-6">{error}</p>}
    </div>
  );
};
