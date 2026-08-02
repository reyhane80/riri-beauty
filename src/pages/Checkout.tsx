import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useLanguage } from '../i18n/LanguageContext';
import { formatPrice } from '../utils/format';

const SHIPPING_FEE = 45000;
const FREE_SHIPPING_THRESHOLD = 1000000;

export default function Checkout() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const user = useAuthStore((s) => s.user);
  const placeOrder = useAuthStore((s) => s.placeOrder);
  const { t, l, lang } = useLanguage();

  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [payment, setPayment] = useState<'online' | 'cod'>('online');
  const [submitting, setSubmitting] = useState(false);

  const rows = items
    .map((item) => ({ item, product: products.find((p) => p.id === item.productId) }))
    .filter((r) => r.product);
  const subtotal = rows.reduce((sum, r) => sum + r.product!.price * r.item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
        <span className="text-5xl">🔒</span>
        <h1 className="text-xl font-bold text-stone-800">{t('checkout.loginFirstTitle')}</h1>
        <p className="text-stone-500">{t('checkout.loginFirstSubtitle')}</p>
        <Link
          to="/login"
          state={{ redirectTo: '/checkout' }}
          className="mt-2 rounded-full bg-rose-600 px-6 py-3 font-medium text-white hover:bg-rose-700"
        >
          {t('header.loginRegister')}
        </Link>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="text-stone-500">{t('checkout.cartEmpty')}</p>
        <Link to="/products" className="mt-4 inline-block text-rose-600 hover:underline">
          {t('common.viewProducts')}
        </Link>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim() || !postalCode.trim()) return;
    setSubmitting(true);
    const order = placeOrder({
      items: rows.map((r) => ({ productId: r.product!.id, quantity: r.item.quantity, price: r.product!.price })),
      total,
      address: `${address.trim()} - ${t('checkout.postalCode')}: ${postalCode.trim()}`,
    });
    clearCart();
    setSubmitting(false);
    navigate('/profile', { state: { justOrdered: order?.id } });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 animate-fade-in">
      <h1 className="mb-6 text-2xl font-bold text-stone-800">{t('checkout.title')}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-6">
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="mb-4 font-bold text-stone-800">{t('checkout.shippingAddress')}</h2>
            <div className="mb-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-stone-500">{t('checkout.receiverName')}</label>
                <input
                  defaultValue={user.fullName}
                  readOnly
                  className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-stone-500">{t('checkout.phone')}</label>
                <input
                  defaultValue={user.phone}
                  readOnly
                  className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-xs text-stone-500">{t('checkout.fullAddress')}</label>
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder={t('checkout.addressPlaceholder')}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-rose-400"
              />
            </div>
            <div className="sm:w-1/2">
              <label className="mb-1 block text-xs text-stone-500">{t('checkout.postalCode')}</label>
              <input
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                inputMode="numeric"
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-rose-400"
                dir="ltr"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="mb-4 font-bold text-stone-800">{t('checkout.paymentMethod')}</h2>
            <div className="flex flex-col gap-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 p-3 has-[:checked]:border-rose-400 has-[:checked]:bg-rose-50">
                <input
                  type="radio"
                  name="payment"
                  checked={payment === 'online'}
                  onChange={() => setPayment('online')}
                  className="accent-rose-500"
                />
                <span className="text-sm text-stone-700">{t('checkout.payOnline')}</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 p-3 has-[:checked]:border-rose-400 has-[:checked]:bg-rose-50">
                <input
                  type="radio"
                  name="payment"
                  checked={payment === 'cod'}
                  onChange={() => setPayment('cod')}
                  className="accent-rose-500"
                />
                <span className="text-sm text-stone-700">{t('checkout.payOnDelivery')}</span>
              </label>
            </div>
            <p className="mt-3 text-xs text-stone-400">{t('checkout.demoNote')}</p>
          </div>
        </div>

        <aside className="w-full shrink-0 rounded-2xl border border-stone-200 bg-white p-5 lg:w-80">
          <h2 className="mb-4 text-lg font-bold text-stone-800">{t('cart.orderSummary')}</h2>
          <div className="mb-3 max-h-56 space-y-2 overflow-y-auto">
            {rows.map(({ item, product }) => (
              <div key={item.productId} className="flex justify-between text-sm text-stone-600">
                <span className="line-clamp-1">
                  {l(product!.name)} × {item.quantity}
                </span>
                <span className="shrink-0">{formatPrice(product!.price * item.quantity, lang)}</span>
              </div>
            ))}
          </div>
          <hr className="my-3 border-stone-200" />
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
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 w-full rounded-full bg-rose-600 py-3 font-medium text-white transition hover:bg-rose-700 disabled:opacity-60"
          >
            {submitting ? t('checkout.submitting') : t('checkout.submit')}
          </button>
        </aside>
      </form>
    </div>
  );
}
