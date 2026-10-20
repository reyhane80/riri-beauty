// دسترسی امن به localStorage (در حالت خصوصی مرورگر ممکن است خطا بدهد)
export function readStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeStorage(key, value) {
  try {
    if (value === null || value === undefined) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ذخیره‌سازی در دسترس نیست؛ داده فقط در حافظه می‌ماند
  }
}
