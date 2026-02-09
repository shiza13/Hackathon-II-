// src/lib/utils.ts
// General utility functions for the application

/**
 * Formats a date string to a more readable format
 * @param dateString - Date string to format
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, locale: string = 'en-US'): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Generates a random ID string
 * @param length - Length of the ID to generate (default: 8)
 * @returns Random ID string
 */
export const generateId = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Debounces a function to prevent it from being called too frequently
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(func: T, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Validates an email address
 * @param email - Email string to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password strength
 * @param password - Password string to validate
 * @param minLength - Minimum length requirement (default: 8)
 * @returns Boolean indicating if password meets requirements
 */
export const isValidPassword = (password: string, minLength: number = 8): boolean => {
  if (password.length < minLength) {
    return false;
  }

  // Check for at least one uppercase letter, one lowercase letter, and one number
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  return hasUpperCase && hasLowerCase && hasNumbers;
};

/**
 * Capitalizes the first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Converts a string to title case
 * @param str - String to convert
 * @returns Title case string
 */
export const toTitleCase = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

/**
 * Truncates a string to a specified length
 * @param str - String to truncate
 * @param maxLength - Maximum length of the string
 * @param suffix - Suffix to add if truncated (default: '...')
 * @returns Truncated string
 */
export const truncate = (str: string, maxLength: number, suffix: string = '...'): string => {
  if (!str || str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength) + suffix;
};

/**
 * Removes leading and trailing whitespace from a string
 * @param str - String to trim
 * @returns Trimmed string
 */
export const trimWhitespace = (str: string): string => {
  return str.trim();
};

/**
 * Formats a number with commas as thousands separators
 * @param num - Number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Calculates the difference in days between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days between the dates
 */
export const daysDifference = (date1: Date, date2: Date): number => {
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

/**
 * Checks if a date is in the past
 * @param date - Date to check
 * @returns Boolean indicating if date is in the past
 */
export const isPastDate = (date: string | Date): boolean => {
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  return checkDate < new Date();
};

/**
 * Deep clone an object
 * @param obj - Object to clone
 * @returns Cloned object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Checks if two objects are equal by comparing their JSON representations
 * @param obj1 - First object
 * @param obj2 - Second object
 * @returns Boolean indicating if objects are equal
 */
export const isEqual = (obj1: any, obj2: any): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

/**
 * Sleep function that returns a promise
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after the specified time
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Sanitizes a string for safe use in HTML
 * @param str - String to sanitize
 * @returns Sanitized string
 */
export const sanitizeHtml = (str: string): string => {
  if (!str) return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

/**
 * Generates a random color in hex format
 * @returns Hex color string
 */
export const generateRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/**
 * Groups an array of objects by a specified key
 * @param array - Array to group
 * @param key - Key to group by
 * @returns Object with grouped arrays
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

/**
 * Combines multiple class names into a single string
 * @param classes - Class names to combine
 * @returns Combined class string
 */
export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};