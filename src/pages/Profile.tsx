import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { products } from '../data/products';
import { formatDate, formatPrice } from '../utils/format';
import { useLanguage } from '../i18n/LanguageContext';
import type { OrderStatus } from '../types';

const statusStyles: Record<OrderStatus, string> = {
  processing: 'bg-amber-100 text-amber-700',
  shipped: 'bg-sky-100 text-sky-700',
  delivered: 'bg-emerald-100 text-emerald-700',
};

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const orders = useAuthStore((s) => s.orders);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const justOrdered = (location.state as { justOrdered?: string } | null)?.justOrdered;
  const { t, l, lang } = useLanguage();

  if (!user) return <Navigate to="/login" replace />;

  const myOrders = orders.filter((o) => o.userId === user.id);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 animate-fade-in">
      {justOrdered && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
          ✅ {t('profile.orderPlaced', { id: justOrdered })}
        </div>
      )}

      <div className="mb-8 flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-2xl">
            👤
          </span>
          <div>
            <h1 className="font-bold text-stone-800">{user.fullName}</h1>
            <p className="text-start text-sm text-stone-500">
              <span dir="ltr">{user.email}</span>
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-600 hover:border-red-300 hover:text-red-500"
        >
          {t('profile.logout')}
        </button>
      </div>

      <h2 className="mb-4 text-lg font-bold text-stone-800">{t('profile.orderHistory')}</h2>

      {myOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 py-16 text-center text-stone-500">
          {t('profile.noOrders')}
        </div>
      ) : (
        <div className="space-y-4">
          {myOrders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-stone-200 bg-white p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-sm font-bold text-stone-800" dir="ltr">
                    {order.id}
                  </span>
                  <span className="ms-3 text-xs text-stone-400">{formatDate(order.date, lang)}</span>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.status]}`}>
                  {t(`order.status.${order.status}`)}
                </span>
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
                {order.items.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  if (!product) return null;
                  return (
                    <span
                      key={item.productId}
                      className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${product.gradient} text-xl`}
                      title={`${l(product.name)} × ${item.quantity}`}
                    >
                      {product.icon}
                    </span>
                  );
                })}
              </div>

              <div className="flex justify-between text-sm text-stone-600">
                <span>{order.address}</span>
                <span className="font-bold text-stone-800">
                  {formatPrice(order.total, lang)} {t('common.toman')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
