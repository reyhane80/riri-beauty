import { Link } from 'react-router-dom';
import { categories } from '../data/categories';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../i18n/LanguageContext';

export default function Home() {
  const { t, l, dir } = useLanguage();
  const bestSellers = products.filter((p) => p.badges?.includes('bestseller')).slice(0, 8);
  const newArrivals = products.filter((p) => p.badges?.includes('new')).slice(0, 4);
  const deals = products.filter((p) => p.oldPrice).slice(0, 4);

  const features = [
    { icon: '🚚', title: t('home.feature.shipping.title'), desc: t('home.feature.shipping.desc') },
    { icon: '💯', title: t('home.feature.original.title'), desc: t('home.feature.original.desc') },
    { icon: '↩️', title: t('home.feature.return.title'), desc: t('home.feature.return.desc') },
  ];

  return (
    <div className="animate-fade-in">
      <section
        className={`${
          dir === 'rtl' ? 'bg-gradient-to-l' : 'bg-gradient-to-r'
        } from-rose-100 via-rose-50 to-cream-50`}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-14 md:flex-row-reverse">
          <div className="flex h-56 w-56 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-200 to-orange-200 text-8xl shadow-inner md:h-72 md:w-72">
            💄
          </div>
          <div className="text-center md:text-start">
            <span className="mb-3 inline-block rounded-full bg-rose-200/70 px-4 py-1 text-sm font-medium text-rose-700">
              {t('home.freeShippingBanner')}
            </span>
            <h1 className="text-3xl font-extrabold leading-relaxed text-stone-800 md:text-5xl">
              {t('home.heroTitle1')} <span className="text-rose-600">{t('brand.name')}</span>{' '}
              {t('home.heroTitle2')}
            </h1>
            <p className="mx-auto mt-4 max-w-md text-stone-500 md:mx-0">{t('home.heroSubtitle')}</p>
            <Link
              to="/products"
              className="mt-6 inline-block rounded-full bg-rose-600 px-8 py-3 font-medium text-white transition hover:bg-rose-700"
            >
              {t('common.viewProducts')}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-6 text-xl font-bold text-stone-800">{t('home.categories')}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/products?category=${c.slug}`}
              className="flex flex-col items-center gap-2 rounded-2xl border border-stone-200 bg-white p-4 text-center transition hover:-translate-y-1 hover:border-rose-300 hover:shadow-md"
            >
              <span className="text-3xl">{c.emoji}</span>
              <span className="text-xs font-medium text-stone-600">{l(c.name)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-800">{t('home.bestSellers')}</h2>
          <Link to="/products" className="text-sm text-rose-600 hover:underline">
            {t('common.viewAll')}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {deals.length > 0 && (
        <section className="bg-amber-50 py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-stone-800">{t('home.deals')}</h2>
              <Link to="/products" className="text-sm text-rose-600 hover:underline">
                {t('common.viewAll')}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {deals.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-stone-800">{t('home.newArrivals')}</h2>
            <Link to="/products" className="text-sm text-rose-600 hover:underline">
              {t('common.viewAll')}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5">
              <span className="text-3xl">{f.icon}</span>
              <div>
                <h3 className="font-bold text-stone-800">{f.title}</h3>
                <p className="text-sm text-stone-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
