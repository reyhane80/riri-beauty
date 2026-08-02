import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { products } from '../data/products';
import { formatPrice } from '../utils/format';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useLanguage } from '../i18n/LanguageContext';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);
  const { t, l, lang } = useLanguage();

  const addItem = useCartStore((s) => s.addItem);
  const wishlisted = useWishlistStore((s) => s.has(product?.id ?? ''));
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="mb-4 text-stone-600">{t('product.notFound')}</p>
        <Link to="/products" className="text-rose-600 hover:underline">
          {t('product.backToProducts')}
        </Link>
      </div>
    );
  }

  const related = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  function handleAddToCart() {
    if (!product) return;
    addItem(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="mb-6 text-sm text-stone-500 hover:text-rose-600">
        {t('common.back')}
      </button>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div
          className={`flex h-80 items-center justify-center rounded-3xl bg-gradient-to-br ${product.gradient} text-[8rem] md:h-[26rem]`}
        >
          {product.icon}
        </div>

        <div>
          <span className="text-sm text-stone-400">{l(product.brand)}</span>
          <h1 className="mb-2 mt-1 text-2xl font-bold text-stone-800">{l(product.name)}</h1>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />

          <div className="my-5 flex items-baseline gap-3">
            {product.oldPrice && (
              <span className="text-stone-400 line-through">
                {formatPrice(product.oldPrice, lang)} {t('common.toman')}
              </span>
            )}
            <span className="text-3xl font-extrabold text-stone-800">{formatPrice(product.price, lang)}</span>
            <span className="text-stone-500">{t('common.toman')}</span>
          </div>

          <p className="mb-6 leading-7 text-stone-600">{l(product.description)}</p>

          {product.colors && (
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-bold text-stone-800">{t('product.color')}</h3>
              <div className="flex gap-2">
                {product.colors.map((color, i) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(i)}
                    style={{ backgroundColor: color }}
                    aria-label={t('product.colorN', { n: i + 1 })}
                    className={`h-9 w-9 rounded-full border-2 transition ${
                      selectedColor === i ? 'border-rose-500 scale-110' : 'border-white shadow'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mb-6 flex items-center gap-4">
            <span className="text-sm font-bold text-stone-800">{t('product.quantity')}</span>
            <div className="flex items-center rounded-full border border-stone-200">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1.5 text-lg text-stone-600"
              >
                −
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1.5 text-lg text-stone-600"
              >
                +
              </button>
            </div>
            {!product.inStock && <span className="text-sm text-red-500">{t('common.outOfStock')}</span>}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 rounded-full bg-rose-600 px-6 py-3 font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              {added ? t('product.addedToCart') : t('product.addToCartFull')}
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="rounded-full border border-stone-200 px-4 text-xl"
              aria-label={t('product.addToWishlist')}
            >
              <span className={wishlisted ? 'text-rose-500' : 'text-stone-300'}>{wishlisted ? '♥' : '♡'}</span>
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-stone-800">{t('product.related')}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
