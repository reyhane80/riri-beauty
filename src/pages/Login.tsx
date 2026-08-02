import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLanguage } from '../i18n/LanguageContext';

type LocationState = { redirectTo?: string } | null;

export default function Login() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as LocationState)?.redirectTo ?? '/profile';
  const { t } = useLanguage();

  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const result =
      mode === 'login' ? login(email, password) : register(fullName, email, phone, password);
    if (!result.ok) {
      setError(result.errorKey ? t(result.errorKey) : t('login.genericError'));
      return;
    }
    navigate(redirectTo);
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 animate-fade-in">
      <div className="mb-6 flex justify-center gap-2 text-3xl">💗</div>

      <div className="mb-6 flex rounded-full bg-stone-100 p-1 text-sm">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`flex-1 rounded-full py-2 font-medium transition ${
            mode === 'login' ? 'bg-white text-rose-600 shadow' : 'text-stone-500'
          }`}
        >
          {t('login.login')}
        </button>
        <button
          type="button"
          onClick={() => setMode('register')}
          className={`flex-1 rounded-full py-2 font-medium transition ${
            mode === 'register' ? 'bg-white text-rose-600 shadow' : 'text-stone-500'
          }`}
        >
          {t('login.register')}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-6">
        {mode === 'register' && (
          <div>
            <label className="mb-1 block text-xs text-stone-500">{t('login.fullName')}</label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-rose-400"
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs text-stone-500">{t('login.email')}</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            dir="ltr"
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-rose-400"
          />
        </div>

        {mode === 'register' && (
          <div>
            <label className="mb-1 block text-xs text-stone-500">{t('login.phone')}</label>
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              dir="ltr"
              inputMode="numeric"
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-rose-400"
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs text-stone-500">{t('login.password')}</label>
          <input
            required
            minLength={4}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            dir="ltr"
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-rose-400"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          className="mt-2 rounded-full bg-rose-600 py-3 font-medium text-white transition hover:bg-rose-700"
        >
          {mode === 'login' ? t('login.submitLogin') : t('login.submitRegister')}
        </button>
      </form>

      <Link to="/" className="mt-4 text-center text-sm text-stone-400 hover:text-rose-600">
        {t('common.backHome')}
      </Link>
    </div>
  );
}
