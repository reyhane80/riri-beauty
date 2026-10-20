import { useEffect, useState, useCallback } from 'react';

interface CurrencyItem {
  key: string;
  value: number;
  label_fa: string;
  label_en: string;
  change?: number;
}

type Tab = 'currency' | 'crypto';

// Which API keys belong to gold/coin category (shown in ارز و طلا tab)
const GOLD_KEYS = new Set([
  'gold_18', 'gold_24', 'gold_gram_18', 'gold_gram_24',
  'sekke', 'sekke_emami', 'sekke_bahar', 'nim_sekke', 'rob_sekke',
  'mesghal', 'germe_tala', 'ons',
]);

// Crypto keys (shown in ارز دیجیتال tab)
const CRYPTO_KEYS = new Set([
  'btc', 'eth', 'usdt', 'bnb', 'xrp', 'ada', 'sol', 'doge',
  'dot', 'matic', 'ltc', 'trx', 'link', 'avax', 'uni',
  'bitcoin', 'ethereum', 'tether',
]);

function isCrypto(key: string, label_en: string): boolean {
  const k = key.toLowerCase();
  const l = label_en.toLowerCase();
  return CRYPTO_KEYS.has(k) || l.includes('bitcoin') || l.includes('ethereum') ||
    l.includes('coin') && !l.includes('gold');
}

function isGold(key: string, label_fa: string): boolean {
  const k = key.toLowerCase();
  return GOLD_KEYS.has(k) || label_fa.includes('طلا') || label_fa.includes('سکه') ||
    label_fa.includes('مثقال') || label_fa.includes('اونس');
}

const FLAG_MAP: Record<string, string> = {
  usd: '🇺🇸', eur: '🇪🇺', gbp: '🇬🇧', try: '🇹🇷',
  aed: '🇦🇪', cad: '🇨🇦', aud: '🇦🇺', chf: '🇨🇭',
  jpy: '🇯🇵', cny: '🇨🇳', rub: '🇷🇺', kwd: '🇰🇼',
  iqd: '🇮🇶', afn: '🇦🇫', azn: '🇦🇿', tmm: '🇹🇲',
  tmn: '🇹🇲', amd: '🇦🇲',
};

const GOLD_EMOJI: Record<string, string> = {
  gold_18: '🏅', gold_gram_18: '🏅',
  gold_24: '🥇', gold_gram_24: '🥇',
  sekke: '🪙', sekke_emami: '🪙', sekke_bahar: '🪙',
  nim_sekke: '🪙', rob_sekke: '🪙',
  mesghal: '⚖️', ons: '📦',
};

const CRYPTO_EMOJI: Record<string, string> = {
  btc: '₿', bitcoin: '₿',
  eth: 'Ξ', ethereum: 'Ξ',
  usdt: '💵', tether: '💵',
  bnb: '🔶', xrp: '🔷', sol: '☀️', doge: '🐕',
};

function formatNumber(n: number): string {
  return n.toLocaleString('fa-IR');
}

function getIcon(item: CurrencyItem): string {
  const k = item.key.toLowerCase();
  if (FLAG_MAP[k]) return FLAG_MAP[k];
  if (GOLD_EMOJI[k]) return GOLD_EMOJI[k];
  if (CRYPTO_EMOJI[k]) return CRYPTO_EMOJI[k];
  return '💱';
}

export default function CurrencyMiniApp() {
  const [data, setData] = useState<CurrencyItem[]>([]);
  const [prevData, setPrevData] = useState<Record<string, number>>({});
  const [tab, setTab] = useState<Tab>('currency');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('https://sheydateam.ir/api/sheyda/hamarz/v2/get');
      if (!res.ok) throw new Error('خطا در دریافت اطلاعات');
      const json = await res.json();

      const items: CurrencyItem[] = [];
      const raw = json.data ?? json;

      for (const [key, val] of Object.entries(raw)) {
        const v = val as { value?: number; label_fa?: string; label_en?: string; change?: number };
        if (typeof v?.value !== 'number') continue;
        items.push({
          key,
          value: v.value,
          label_fa: v.label_fa ?? key,
          label_en: v.label_en ?? key,
          change: v.change,
        });
      }

      setPrevData(prev => {
        const next: Record<string, number> = {};
        for (const item of items) next[item.key] = prev[item.key] ?? item.value;
        return next;
      });

      setData(items);
      setLastUpdate(new Date());
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 30_000);
    return () => clearInterval(id);
  }, [fetchData]);

  const currencyItems = data.filter(
    item => !isCrypto(item.key, item.label_en) && !isGold(item.key, item.label_fa)
  );
  const goldItems = data.filter(item => isGold(item.key, item.label_fa));
  const cryptoItems = data.filter(item => isCrypto(item.key, item.label_en));

  const displayItems = tab === 'currency'
    ? [...currencyItems, ...goldItems]
    : cryptoItems;

  const now = lastUpdate
    ? lastUpdate.toLocaleDateString('fa-IR') + ' ' + lastUpdate.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 flex flex-col font-[Vazirmatn,sans-serif]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <span className="text-sm font-bold text-gray-800">نرخ ارز و طلا</span>
        <button
          onClick={fetchData}
          className="text-xs text-blue-500 flex items-center gap-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
          </svg>
          بروزرسانی
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-3 py-3">
        {loading && (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-400">در حال دریافت...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-red-500 text-sm">{error}</div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 gap-3">
            {displayItems.map(item => {
              const prev = prevData[item.key];
              const change = item.change ?? (prev !== undefined ? item.value - prev : 0);
              const isUp = change > 0;

              return (
                <div
                  key={item.key}
                  className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col gap-2 min-h-[110px]"
                >
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-sm font-medium text-gray-700 leading-tight text-right">
                      {item.label_fa}
                    </span>
                    <span className="text-2xl leading-none">{getIcon(item)}</span>
                  </div>

                  <div className="mt-auto">
                    {change !== 0 && (
                      <div className={`text-xs font-medium mb-1 flex items-center gap-0.5 justify-end ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                        {isUp ? '↑' : '↓'}
                        {formatNumber(Math.abs(change))}
                      </div>
                    )}
                    <div className="flex items-baseline gap-1 justify-end">
                      <span className="text-[10px] text-gray-400">تومان</span>
                      <span className="text-base font-bold text-gray-900 tabular-nums">
                        {formatNumber(item.value)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer watermark */}
        {!loading && (
          <div className="flex items-center justify-between mt-4 px-1 pb-2">
            <span className="text-[10px] text-gray-400">{now}</span>
            <span className="text-[10px] text-gray-400">@CoinPJbot</span>
          </div>
        )}
      </div>

      {/* Bottom tabs */}
      <div className="bg-white border-t border-gray-200 flex">
        <button
          onClick={() => setTab('crypto')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            tab === 'crypto' ? 'text-blue-500 border-t-2 border-blue-500' : 'text-gray-500'
          }`}
        >
          ارزدیجیتال
        </button>
        <button
          onClick={() => setTab('currency')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            tab === 'currency' ? 'text-blue-500 border-t-2 border-blue-500' : 'text-gray-500'
          }`}
        >
          ارز و طلا
        </button>
      </div>
    </div>
  );
}
