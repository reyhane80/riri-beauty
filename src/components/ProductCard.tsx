import { Link } from 'react-router-dom';
import type { Product, ProductBadge } from '../types';
import { formatPrice } from '../utils/format';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useLanguage } from '../i18n/LanguageContext';
import StarRating from './StarRating';

const badgeStyles: Record<ProductBadge, string> = {
  new: 'bg-sky-500',
  bestseller: 'bg-rose-500',
  sale: 'bg-amber-500',
};

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const wishlisted = useWishlistStore((s) => s.has(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const { t, l, lang } = useLanguage();

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <button
        onClick={() => toggleWishlist(product.id)}
        aria-label={t('product.addToWishlist')}
        className="absolute end-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-lg shadow transition hover:scale-110"
      >
        <span className={wishlisted ? 'text-rose-500' : 'text-stone-300'}>{wishlisted ? '♥' : '♡'}</span>
      </button>

      {product.badges && product.badges.length > 0 && (
        <div className="absolute start-3 top-3 z-10 flex flex-col gap-1">
          {product.badges.map((b) => (
            <span
              key={b}
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium text-white ${badgeStyles[b]}`}
            >
              {t(`badge.${b}`)}
            </span>
          ))}
        </div>
      )}

      <Link to={`/products/${product.id}`} className="block">
        <div
          className={`flex h-44 items-center justify-center bg-gradient-to-br ${product.gradient} text-6xl`}
        >
          {product.icon}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs text-stone-400">{l(product.brand)}</span>
        <Link to={`/products/${product.id}`} className="line-clamp-2 min-h-10 font-medium text-stone-800 hover:text-rose-600">
          {l(product.name)}
        </Link>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-xs text-stone-400 line-through">{formatPrice(product.oldPrice, lang)}</span>
            )}
            <span className="font-bold text-stone-800">
              {formatPrice(product.price, lang)} <span className="text-xs font-normal">{t('common.toman')}</span>
            </span>
          </div>
          <button
            onClick={() => addItem(product.id)}
            disabled={!product.inStock}
            className="rounded-full bg-rose-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {product.inStock ? t('product.addToCart') : t('common.outOfStock')}
          </button>
        </div>
      </div>
    </div>
  );
}
