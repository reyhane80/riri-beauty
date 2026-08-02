import type { Category } from '../types';

export const categories: Category[] = [
  { id: 'c1', name: { fa: 'مراقبت پوست', en: 'Skincare' }, slug: 'skincare', emoji: '🧴' },
  { id: 'c2', name: { fa: 'آرایش صورت', en: 'Face Makeup' }, slug: 'face', emoji: '💄' },
  { id: 'c3', name: { fa: 'آرایش چشم و ابرو', en: 'Eye & Brow' }, slug: 'eye', emoji: '👁️' },
  { id: 'c4', name: { fa: 'آرایش لب', en: 'Lip Makeup' }, slug: 'lip', emoji: '💋' },
  { id: 'c5', name: { fa: 'عطر و ادکلن', en: 'Fragrance' }, slug: 'fragrance', emoji: '🌸' },
  { id: 'c6', name: { fa: 'مراقبت مو', en: 'Hair Care' }, slug: 'hair', emoji: '💇‍♀️' },
  { id: 'c7', name: { fa: 'ابزار آرایشی', en: 'Beauty Tools' }, slug: 'tools', emoji: '🖌️' },
  { id: 'c8', name: { fa: 'مراقبت بدن', en: 'Body Care' }, slug: 'body', emoji: '🧼' },
];
