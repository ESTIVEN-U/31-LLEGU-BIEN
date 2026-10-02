/**
 * Utilidades de almacenamiento local seguro para "Llegué Bien".
 * 
 * ⚠️ PUNTOS DONDE COMÚNMENTE SE COMETEN ERRORES:
 * 1. Acceder a `window.localStorage` directamente en entornos donde está deshabilitado
 *    (modo incógnito estricto de iOS Safari, iframes con cookies bloqueadas o cuotas llenas)
 *    provoca excepciones no capturadas `DOMException: SecurityError` o `QuotaExceededError`.
 * 2. Hacer `JSON.parse()` sin bloque try/catch: si el usuario tiene datos viejos, incompletos
 *    o corrompidos, la app entera se rompe con pantalla en blanco al inicializar.
 */

export function safeGetItem<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return fallback;
    }
    const item = window.localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (error) {
    // ⚠️ Evitamos romper la aplicación si hay datos corruptos o permisos bloqueados
    console.warn(`[Llegué Bien] No se pudo leer la clave "${key}" de localStorage:`, error);
    return fallback;
  }
}

export function safeSetItem<T>(key: string, value: T): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    // ⚠️ Si la cuota de almacenamiento se excede o está bloqueado, se captura aquí
    console.warn(`[Llegué Bien] No se pudo guardar la clave "${key}" en localStorage:`, error);
    return false;
  }
}

export function safeRemoveItem(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn(`[Llegué Bien] No se pudo eliminar la clave "${key}" de localStorage:`, error);
  }
}
