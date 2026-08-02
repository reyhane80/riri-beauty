import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <span className="text-6xl">💔</span>
      <h1 className="text-2xl font-bold text-stone-800">{t('notFound.title')}</h1>
      <Link to="/" className="mt-2 rounded-full bg-rose-600 px-6 py-3 font-medium text-white hover:bg-rose-700">
        {t('common.backHome')}
      </Link>
    </div>
  );
}
