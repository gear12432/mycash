export function validateEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
}

export function validateMobile(mobile: string): boolean {
  // 10 digit Indian mobile number starting with 6-9
  const re = /^[6-9]\d{9}$/;
  return re.test(mobile.trim());
}

export function validatePan(pan: string): boolean {
  // PAN format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)
  const re = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return re.test(pan.trim().toUpperCase());
}

export function validateAadhaar(aadhaar: string): boolean {
  // 12 digits
  const cleanAadhaar = aadhaar.replace(/\s+/g, '');
  const re = /^[0-9]{12}$/;
  return re.test(cleanAadhaar);
}

export function validatePinCode(pin: string): boolean {
  // 6 digits
  const re = /^[1-9][0-9]{5}$/;
  return re.test(pin.trim());
}

export function validateUserId(userId: string): boolean {
  // PL + 5 digits e.g. PL18753
  const re = /^PL[0-9]{5}$/i;
  return re.test(userId.trim());
}

export function checkPasswordStrength(password: string): {
  isValid: boolean;
  score: number; // 0-4
  feedback: string;
} {
  if (!password) {
    return { isValid: false, score: 0, feedback: 'Password is required' };
  }
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  let feedback = 'Very weak';
  if (score === 1) feedback = 'Weak';
  else if (score === 2) feedback = 'Fair';
  else if (score === 3) feedback = 'Good';
  else if (score === 4) feedback = 'Strong';

  return {
    isValid: password.length >= 6,
    score,
    feedback,
  };
}
