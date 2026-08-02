import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { categories } from '../data/categories';
import { useLanguage } from '../i18n/LanguageContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const user = useAuthStore((s) => s.user);
  const { t, l, toggleLang } = useLanguage();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate(query.trim() ? `/products?q=${encodeURIComponent(query.trim())}` : '/products');
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-cream-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <button
          className="rounded-lg p-2 text-2xl md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={t('header.menu')}
        >
          ☰
        </button>

        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="text-2xl">💗</span>
          <span className="text-lg font-bold text-rose-600">{t('brand.name')}</span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm text-stone-600 md:flex">
          <Link to="/products" className="hover:text-rose-600">
            {t('header.allProducts')}
          </Link>
          {categories.slice(0, 5).map((c) => (
            <Link key={c.id} to={`/products?category=${c.slug}`} className="hover:text-rose-600">
              {l(c.name)}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="ms-auto hidden max-w-sm flex-1 items-center md:flex">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder={t('header.searchPlaceholder')}
            className="w-full rounded-full border border-stone-200 bg-white px-4 py-2 text-sm outline-none focus:border-rose-400"
          />
        </form>

        <div className="ms-auto flex items-center gap-3 md:ms-0">
          <button
            onClick={toggleLang}
            className="rounded-full border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:border-rose-300 hover:text-rose-600"
            aria-label={t('header.switchLanguage')}
          >
            {t('header.switchLanguage')}
          </button>
          <Link
            to={user ? '/profile' : '/login'}
            className="hidden items-center gap-1 rounded-full p-2 text-xl hover:bg-stone-100 sm:flex"
            aria-label={t('header.account')}
            title={user ? user.fullName : t('header.login')}
          >
            👤
          </Link>
          <Link to="/cart" className="relative rounded-full p-2 text-xl hover:bg-stone-100" aria-label={t('header.cart')}>
            🛍️
            {cartCount > 0 && (
              <span className="absolute -end-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-stone-200 bg-white px-4 py-3 md:hidden">
          <form onSubmit={handleSearch} className="mb-3 flex">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder={t('header.searchPlaceholder')}
              className="w-full rounded-full border border-stone-200 px-4 py-2 text-sm outline-none focus:border-rose-400"
            />
          </form>
          <nav className="flex flex-col gap-3 text-sm text-stone-600">
            <Link to="/products" onClick={() => setMenuOpen(false)}>
              {t('header.allProducts')}
            </Link>
            {categories.map((c) => (
              <Link key={c.id} to={`/products?category=${c.slug}`} onClick={() => setMenuOpen(false)}>
                {c.emoji} {l(c.name)}
              </Link>
            ))}
            <Link to={user ? '/profile' : '/login'} onClick={() => setMenuOpen(false)}>
              👤 {user ? t('header.account') : t('header.loginRegister')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
