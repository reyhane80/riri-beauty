import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCartStore } from '../store/cartStore';
import { useLanguage } from '../i18n/LanguageContext';
import { formatPrice } from '../utils/format';

const FREE_SHIPPING_THRESHOLD = 1000000;
const SHIPPING_FEE = 45000;

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const { t, l, lang } = useLanguage();

  const rows = items
    .map((item) => ({ item, product: products.find((p) => p.id === item.productId) }))
    .filter((r) => r.product);

  const subtotal = rows.reduce((sum, r) => sum + r.product!.price * r.item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  if (rows.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-24 text-center">
        <span className="text-6xl">🛍️</span>
        <h1 className="text-xl font-bold text-stone-800">{t('cart.emptyTitle')}</h1>
        <p className="text-stone-500">{t('cart.emptySubtitle')}</p>
        <Link
          to="/products"
          className="mt-2 rounded-full bg-rose-600 px-6 py-3 font-medium text-white hover:bg-rose-700"
        >
          {t('common.viewProducts')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 animate-fade-in">
      <h1 className="mb-6 text-2xl font-bold text-stone-800">{t('cart.title')}</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
          {rows.map(({ item, product }) => (
            <div key={item.productId} className="flex items-center gap-4 p-4">
              <Link
                to={`/products/${product!.id}`}
                className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${product!.gradient} text-3xl`}
              >
                {product!.icon}
              </Link>
              <div className="min-w-0 flex-1">
                <Link to={`/products/${product!.id}`} className="line-clamp-1 font-medium text-stone-800 hover:text-rose-600">
                  {l(product!.name)}
                </Link>
                <p className="text-xs text-stone-400">{l(product!.brand)}</p>
                <p className="mt-1 text-sm font-bold text-stone-800">
                  {formatPrice(product!.price, lang)} {t('common.toman')}
                </p>
              </div>

              <div className="flex items-center rounded-full border border-stone-200">
                <button
                  onClick={() => setQuantity(item.productId, item.quantity - 1)}
                  className="px-3 py-1 text-lg text-stone-600"
                  aria-label={t('cart.decrease')}
                >
                  −
                </button>
                <span className="w-6 text-center text-sm">{item.quantity}</span>
                <button
                  onClick={() => setQuantity(item.productId, item.quantity + 1)}
                  className="px-3 py-1 text-lg text-stone-600"
                  aria-label={t('cart.increase')}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(item.productId)}
                className="p-2 text-stone-400 hover:text-red-500"
                aria-label={t('cart.remove')}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <aside className="w-full shrink-0 rounded-2xl border border-stone-200 bg-white p-5 lg:w-80">
          <h2 className="mb-4 text-lg font-bold text-stone-800">{t('cart.orderSummary')}</h2>
          <div className="flex justify-between py-1 text-sm text-stone-600">
            <span>{t('cart.subtotal')}</span>
            <span>
              {formatPrice(subtotal, lang)} {t('common.toman')}
            </span>
          </div>
          <div className="flex justify-between py-1 text-sm text-stone-600">
            <span>{t('cart.shipping')}</span>
            <span>{shipping === 0 ? t('common.free') : `${formatPrice(shipping, lang)} ${t('common.toman')}`}</span>
          </div>
          <hr className="my-3 border-stone-200" />
          <div className="flex justify-between py-1 font-bold text-stone-800">
            <span>{t('cart.total')}</span>
            <span>
              {formatPrice(total, lang)} {t('common.toman')}
            </span>
          </div>
          <Link
            to="/checkout"
            className="mt-4 block rounded-full bg-rose-600 py-3 text-center font-medium text-white transition hover:bg-rose-700"
          >
            {t('cart.checkout')}
          </Link>
        </aside>
      </div>
    </div>
  );
}
