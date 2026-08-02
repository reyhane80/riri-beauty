import { Link } from 'react-router-dom';
import { categories } from '../data/categories';
import { useLanguage } from '../i18n/LanguageContext';

export default function Footer() {
  const { t, l } = useLanguage();

  return (
    <footer className="mt-16 border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-2xl">💗</span>
            <span className="text-lg font-bold text-rose-600">{t('brand.name')}</span>
          </div>
          <p className="text-sm leading-6 text-stone-500">{t('footer.about')}</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-stone-800">{t('footer.categories')}</h3>
          <ul className="flex flex-col gap-2 text-sm text-stone-500">
            {categories.slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link to={`/products?category=${c.slug}`} className="hover:text-rose-600">
                  {l(c.name)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-stone-800">{t('footer.customerService')}</h3>
          <ul className="flex flex-col gap-2 text-sm text-stone-500">
            <li>
              <Link to="/products" className="hover:text-rose-600">
                {t('header.allProducts')}
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-rose-600">
                {t('header.cart')}
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-rose-600">
                {t('footer.trackOrder')}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-stone-800">{t('footer.contact')}</h3>
          <ul className="flex flex-col gap-2 text-sm text-stone-500">
            <li>{t('footer.address')}</li>
            <li className="text-start">
              <span dir="ltr">021-91234567</span>
            </li>
            <li className="text-start">
              <span dir="ltr">support@riribeauty.ir</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-200 py-4 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} {t('brand.name')}. {t('footer.rights')}
      </div>
    </footer>
  );
}
