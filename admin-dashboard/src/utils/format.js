const numberFormatter = new Intl.NumberFormat('fa-IR')
const compactFormatter = new Intl.NumberFormat('fa-IR', { notation: 'compact', maximumFractionDigits: 1 })
const percentFormatter = new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 1 })
const dateFormatter = new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
const shortDateFormatter = new Intl.DateTimeFormat('fa-IR', { month: 'short', day: 'numeric' })

/** عدد با ارقام فارسی و جداکننده هزارگان */
export const formatNumber = (value) => numberFormatter.format(value ?? 0)

/** نمایش فشرده برای اعداد بزرگ (مثل «۱۸۰ میلیون») */
export const formatCompact = (value) => compactFormatter.format(value ?? 0)

/** مبلغ به تومان */
export const formatPrice = (value) => `${formatNumber(value)} تومان`

export const formatPercent = (value) => `${percentFormatter.format(Math.abs(value))}٪`

/** تاریخ شمسی کامل، مثل «۲۸ مهر ۱۴۰۵» */
export const formatDate = (value) => dateFormatter.format(new Date(value))

export const formatShortDate = (value) => shortDateFormatter.format(new Date(value))

/** تبدیل ارقام فارسی و عربی به انگلیسی (برای ورودی‌های فرم) */
export const toEnglishDigits = (value = '') =>
  String(value)
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))

/** ارقام انگلیسی یک رشته (مثلاً شماره موبایل) را فارسی می‌کند بدون جداکننده */
export const toPersianDigits = (value = '') => String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d])

export const fullName = (user) => `${user.firstName} ${user.lastName}`
