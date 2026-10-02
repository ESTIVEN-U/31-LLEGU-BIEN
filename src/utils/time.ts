/**
 * Utilidades para manejo de fechas, tiempos y avisos en "Llegué Bien".
 * 
 * ⚠️ PUNTOS DONDE COMÚNMENTE SE COMETEN ERRORES:
 * 1. Comparar cadenas ISO como "2026-10-02T16:00:00" directamente con operadores mayor/menor,
 *    o hacer parseos con `new Date("YYYY-MM-DD")` que asumen UTC en unos navegadores y hora local en otros.
 *    -> Solución: Usamos siempre enteros de época (timestamps numéricos en milisegundos).
 * 2. Asumir que el tiempo restante siempre es positivo: si el estudiante se demora más de lo previsto,
 *    restar `estimated - now` da un número negativo. Si no se maneja, la UI muestra "-15 minutos restantes"
 *    o valores NaN en lugar de alertar con claridad sobre un retraso.
 * 3. Enlaces `wa.me/` o `tel:` con números que tienen espacios, guiones o signos '+' mal codificados:
 *    deben sanitizarse removiendo caracteres no numéricos salvo el '+' inicial o codificarse debidamente.
 */

/**
 * Formatea una hora en formato HH:MM (24 horas local)
 */
export function formatTimeHHMM(timestamp: number): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return '--:--';
  }
}

/**
 * Calcula la diferencia en minutos entre el momento actual y el tiempo estimado.
 * Retorna:
 * - isOverdue: true si ya pasó la hora estimada
 * - minutes: cantidad absoluta de minutos (redondeada al techo)
 * - formattedText: descripción legible en español
 */
export function getRemainingTimeDetails(estimatedArrival: number, now: number = Date.now()): {
  isOverdue: boolean;
  minutes: number;
  formattedText: string;
} {
  const diffMs = estimatedArrival - now;
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 0) {
    const overdueMinutes = Math.abs(diffMinutes);
    return {
      isOverdue: true,
      minutes: overdueMinutes,
      formattedText: overdueMinutes === 1 ? 'Demorado 1 minuto' : `Demorado ${overdueMinutes} minutos`,
    };
  }

  if (diffMinutes === 0) {
    return {
      isOverdue: false,
      minutes: 0,
      formattedText: 'Llegando ahora',
    };
  }

  return {
    isOverdue: false,
    minutes: diffMinutes,
    formattedText: diffMinutes === 1 ? 'Falta 1 minuto' : `Faltan ${diffMinutes} minutos`,
  };
}

/**
 * Limpia un número telefónico para links `tel:` o `https://wa.me/`
 * Remueve espacios, guiones y paréntesis para evitar que la app de mensajería falle.
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Genera el enlace de WhatsApp con un mensaje predefinido en español.
 */
export function buildWhatsAppLink(phone: string, text: string): string {
  const cleaned = cleanPhoneNumber(phone).replace(/^\+/, '');
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
}
