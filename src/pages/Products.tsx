import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import { categories } from '../data/categories';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../i18n/LanguageContext';
import { formatPrice } from '../utils/format';

type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'rating';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') ?? '';
  const query = searchParams.get('q') ?? '';
  const { t, l, lang } = useLanguage();

  const [sort, setSort] = useState<SortOption>('popular');
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [onlyInStock, setOnlyInStock] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice);
    if (activeCategory) list = list.filter((p) => p.categorySlug === activeCategory);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.fa.toLowerCase().includes(q) ||
          p.name.en.toLowerCase().includes(q) ||
          p.brand.fa.toLowerCase().includes(q) ||
          p.brand.en.toLowerCase().includes(q),
      );
    }
    if (onlyInStock) list = list.filter((p) => p.inStock);

    switch (sort) {
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...list].sort((a, b) => b.rating - a.rating);
      default:
        return list;
    }
  }, [activeCategory, query, sort, maxPrice, onlyInStock]);

  function setCategory(slug: string) {
    const next = new URLSearchParams(searchParams);
    if (slug) next.set('category', slug);
    else next.delete('category');
    setSearchParams(next);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold text-stone-800">
        {query ? t('products.searchResultsFor', { query }) : t('products.allProducts')}
      </h1>
      <p className="mb-6 text-sm text-stone-500">{t('products.count', { count: filtered.length })}</p>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="w-full shrink-0 md:w-56">
          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-bold text-stone-800">{t('products.category')}</h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <button
                  onClick={() => setCategory('')}
                  className={`hover:text-rose-600 ${!activeCategory ? 'font-bold text-rose-600' : 'text-stone-600'}`}
                >
                  {t('products.all')}
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setCategory(c.slug)}
                    className={`hover:text-rose-600 ${activeCategory === c.slug ? 'font-bold text-rose-600' : 'text-stone-600'}`}
                  >
                    {c.emoji} {l(c.name)}
                  </button>
                </li>
              ))}
            </ul>

            <hr className="my-4 border-stone-200" />

            <h3 className="mb-3 text-sm font-bold text-stone-800">{t('products.maxPrice')}</h3>
            <input
              type="range"
              min={50000}
              max={1000000}
              step={10000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
            <p className="text-xs text-stone-500">{t('products.upTo', { price: formatPrice(maxPrice, lang) })}</p>

            <hr className="my-4 border-stone-200" />

            <label className="flex items-center gap-2 text-sm text-stone-600">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="accent-rose-500"
              />
              {t('products.onlyInStock')}
            </label>
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-4 flex justify-end">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm outline-none focus:border-rose-400"
            >
              <option value="popular">{t('products.sort.popular')}</option>
              <option value="price-asc">{t('products.sort.priceAsc')}</option>
              <option value="price-desc">{t('products.sort.priceDesc')}</option>
              <option value="rating">{t('products.sort.rating')}</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-stone-300 py-20 text-center">
              <span className="text-4xl">🔍</span>
              <p className="text-stone-500">{t('products.empty')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
