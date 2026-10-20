import { computed, reactive, ref } from 'vue'

/**
 * مدیریت ساده فرم و اعتبارسنجی.
 * @param {object} initialValues مقادیر اولیه فیلدها
 * @param {object} rules قوانین هر فیلد به صورت آرایه‌ای از توابع validator
 */
export function useForm(initialValues, rules = {}) {
  const values = reactive({ ...initialValues })
  const errors = reactive({})
  const touched = reactive({})
  const submitting = ref(false)

  const validateField = (field) => {
    const fieldRules = rules[field] ?? []
    for (const rule of fieldRules) {
      const result = rule(values[field], values)
      if (result !== true) {
        errors[field] = result
        return false
      }
    }
    delete errors[field]
    return true
  }

  const validate = () => {
    Object.keys(rules).forEach((field) => {
      touched[field] = true
      validateField(field)
    })
    return Object.keys(errors).length === 0
  }

  /** پس از اولین blur، خطاها هنگام تایپ به‌روز می‌شوند */
  const touch = (field) => {
    touched[field] = true
    validateField(field)
  }

  const onInput = (field) => {
    if (touched[field]) validateField(field)
  }

  const setValues = (newValues) => Object.assign(values, newValues)

  const setError = (field, message) => {
    touched[field] = true
    errors[field] = message
  }

  const handleSubmit = (callback) => async () => {
    if (!validate()) return
    submitting.value = true
    try {
      await callback({ ...values })
    } finally {
      submitting.value = false
    }
  }

  const isValid = computed(() => Object.keys(errors).length === 0)

  return { values, errors, touched, submitting, isValid, touch, onInput, validate, setValues, setError, handleSubmit }
}
