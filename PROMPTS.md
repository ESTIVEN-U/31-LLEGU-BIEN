# Bitácora de prompts

## P0 · Prompt cero

**Prompt textual:**
```
ROL: Sos un desarrollador senior de aplicaciones web.

CONTEXTO: Estoy construyendo una app llamada LLEGUÉ BIEN para estudiantes que
viajan solos al instituto o a su casa.
El problema que resuelve es: avisar que uno llegó se olvida justo cuando más
importa.

TAREA: Generá la primera versión funcional, con estas tres funciones y nada más:
1. Iniciar un viaje con destino y hora estimada de llegada.
2. Guardar contactos de emergencia (nombre y teléfono).
3. Un botón «Llegué» que cierra el viaje.

RESTRICCIONES: en español, sin librerías de pago, sin login, sin base de datos
en servidor todavía. Que se vea bien en un celular. Código comentado en los
puntos donde alguien vaya a equivocarse.

FORMATO DE SALIDA: los archivos completos, cada uno con su nombre, y al final
una lista de lo que NO hiciste y por qué.

CRITERIO DE ACEPTACIÓN: abro la app, inicio un viaje a «Mi casa» con hora
estimada en 30 minutos, toco «Llegué» y veo el viaje marcado como cerrado, sin
ningún error en la consola.
```

**Qué devolvió:** Una app web llamada Llegué Bien con pestañas Viaje y Contactos, destinos frecuentes y tiempo estimado de llegada.
**Qué acepté:** La estructura general y el diseño.
**Qué corregí a mano:** (escribe aquí si usaste el botón Arreglar)
**Evidencia:** evidencias/E0-inicial.png
**Commit:** (lo ponemos después)<                                                      <  
