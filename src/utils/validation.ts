// Validation utilities for forms and inputs

/**
 * Email validation
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Phone validation (Indian format)
 */
export const isValidPhone = (phone: string): boolean => {
  // Indian phone numbers: +91 followed by 10 digits
  const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

/**
 * Password validation
 * Minimum 8 characters, at least one uppercase, one lowercase, one number
 */
export const isValidPassword = (password: string): boolean => {
  if (password.length < 8) return false;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  return hasUpperCase && hasLowerCase && hasNumber;
};

/**
 * Get password strength
 */
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 6) return 'weak';

  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength <= 2) return 'weak';
  if (strength <= 3) return 'medium';
  return 'strong';
};

/**
 * Validate template ID
 */
export const isValidTemplateId = (id: string): boolean => {
  // Template IDs should be alphanumeric with underscores
  const templateIdRegex = /^[a-zA-Z0-9_]+$/;
  return templateIdRegex.test(id);
};

/**
 * Validate file size
 */
export const isValidFileSize = (sizeInBytes: number, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return sizeInBytes <= maxSizeBytes;
};

/**
 * Validate image file type
 */
export const isValidImageType = (mimeType: string): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(mimeType.toLowerCase());
};

/**
 * Validate video file type
 */
export const isValidVideoType = (mimeType: string): boolean => {
  const validTypes = ['video/mp4', 'video/quicktime', 'video/x-m4v'];
  return validTypes.includes(mimeType.toLowerCase());
};

/**
 * Sanitize text input
 * Remove special characters that might cause issues
 */
export const sanitizeText = (text: string): string => {
  return text.replace(/[<>]/g, '').trim();
};

/**
 * Validate hex color
 */
export const isValidHexColor = (color: string): boolean => {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
};

export default {
  isValidEmail,
  isValidPhone,
  isValidPassword,
  getPasswordStrength,
  isValidTemplateId,
  isValidFileSize,
  isValidImageType,
  isValidVideoType,
  sanitizeText,
  isValidHexColor,
};
