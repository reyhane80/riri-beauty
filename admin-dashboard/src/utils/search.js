import { toEnglishDigits } from './format'

/** یکسان‌سازی متن برای جستجو: حروف عربی، ارقام، فاصله مجازی و حروف بزرگ */
export const normalize = (value = '') =>
  toEnglishDigits(value)
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/‌/g, ' ')
    .toLowerCase()
    .trim()
