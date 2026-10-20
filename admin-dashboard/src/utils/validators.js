import { toEnglishDigits } from './format'

// هر قانون یک تابع است که در صورت خطا پیام فارسی و در غیر این صورت true برمی‌گرداند

export const required = (message = 'این فیلد الزامی است') => (value) =>
  (value !== null && value !== undefined && String(value).trim() !== '') || message

export const minLength = (min, message) => (value) =>
  !value || String(value).trim().length >= min || message || `حداقل ${min} کاراکتر وارد کنید`

export const maxLength = (max, message) => (value) =>
  !value || String(value).trim().length <= max || message || `حداکثر ${max} کاراکتر مجاز است`

export const email = (message = 'ایمیل وارد شده معتبر نیست') => (value) =>
  !value || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim()) || message

export const iranMobile = (message = 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود') => (value) =>
  !value || /^09\d{9}$/.test(toEnglishDigits(value).trim()) || message

export const persianText = (message = 'لطفاً از حروف فارسی استفاده کنید') => (value) =>
  !value || /^[؀-ۿ‌\s]+$/.test(String(value).trim()) || message

export const oneOf = (options, message = 'یک گزینه را انتخاب کنید') => (value) =>
  options.includes(value) || message
