import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, MapPin, Send, AlertTriangle, ChevronRight } from 'lucide-react';
import { Trip, EmergencyContact } from '../types';
import { formatTimeHHMM, getRemainingTimeDetails, buildWhatsAppLink } from '../utils/time';

interface ActiveTripCardProps {
  trip: Trip;
  onFinishTrip: () => void;
  contacts: EmergencyContact[];
}

export const ActiveTripCard: React.FC<ActiveTripCardProps> = ({
  trip,
  onFinishTrip,
  contacts,
}) => {
  const [now, setNow] = useState(Date.now());
  const [showShareOptions, setShowShareOptions] = useState(false);

  // ⚠️ ERROR COMÚN 1: No retornar la función de limpieza `clearInterval(intervalId)`.
  // Si no se limpia, cada vez que el componente se monte o cambie de props se creará un intervalo
  // nuevo en segundo plano, consumiendo batería del teléfono y provocando fugas de memoria.
  //
  // ⚠️ ERROR COMÚN 2: Decrementar un contador relativo (`secondsLeft--`).
  // En smartphones, cuando el estudiante bloquea la pantalla o cambia de app, los timers de JavaScript
  // se pausan o ralentizan (background throttle). Si usamos un contador decreciente, al desbloquear el teléfono
  // el tiempo se habrá "congelado". Comparando `Date.now()` contra el timestamp guardado `trip.estimatedArrival`
  // garantizamos que el cálculo sea 100% exacto aun tras bloquear la pantalla.
  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const remaining = getRemainingTimeDetails(trip.estimatedArrival, now);
  const startTime = formatTimeHHMM(trip.startedAt);
  const estimatedTime = formatTimeHHMM(trip.estimatedArrival);

  // Mensaje para notificar inicio de viaje por WhatsApp a un contacto
  const startTripShareText = `Hola, inicié mi viaje hacia "${trip.destination}". Mi hora estimada de llegada es a las ${estimatedTime} (${trip.estimatedMinutes} min aprox). Te aviso apenas llegue.`;

  return (
    <div className="space-y-4">
      {/* Tarjeta de estado de viaje en curso */}
      <div
        className={`rounded-3xl p-5 border transition-colors ${
          remaining.isOverdue
            ? 'bg-rose-950/40 border-rose-500/50'
            : 'bg-slate-800/80 border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                remaining.isOverdue ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-pulse'
              }`}
            />
            <span
              className={`text-xs font-bold tracking-wider uppercase ${
                remaining.isOverdue ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {remaining.isOverdue ? 'Viaje demorado' : 'Viaje en curso'}
            </span>
          </div>
          <span className="text-xs text-slate-400">Iniciado a las {startTime}</span>
        </div>

        {/* Destino grande y legible */}
        <div className="mb-5">
          <p className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Destino</span>
          </p>
          <h2 className="text-2xl font-bold text-white tracking-tight break-words">
            {trip.destination}
          </h2>
        </div>

        {/* Métricas de tiempo */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
            <p className="text-[11px] text-slate-400 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Llegada estimada</span>
            </p>
            <p className="text-lg font-bold text-white tabular-nums">{estimatedTime}</p>
          </div>

          <div
            className={`p-3 rounded-2xl border ${
              remaining.isOverdue
                ? 'bg-rose-900/30 border-rose-600/40 text-rose-200'
                : 'bg-slate-900/80 border-slate-800 text-slate-100'
            }`}
          >
            <p className="text-[11px] text-slate-400 mb-1">
              {remaining.isOverdue ? 'Estado' : 'Cuenta regresiva'}
            </p>
            <p
              className={`text-lg font-bold tabular-nums flex items-center gap-1 ${
                remaining.isOverdue ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {remaining.isOverdue && <AlertTriangle className="w-4 h-4 shrink-0" />}
              <span>{remaining.formattedText}</span>
            </p>
          </div>
        </div>

        {remaining.isOverdue && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-300 mb-2">
            Pasaste la hora prevista de llegada. Si ya estás en destino, presiona{' '}
            <strong>«Llegué»</strong>. Si necesitas ayuda, avisa a tus contactos abajo.
          </div>
        )}
      </div>

      {/* ⚠️ FUNCIÓN 3: BOTÓN «LLEGUÉ»
          Diseñado para máxima ergonomía táctil en el teléfono móvil:
          - Altura generosa (60px)
          - Alto contraste (fondo verde esmeralda brillante, texto oscuro legible)
          - Feedback visual inmediato al toque */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onFinishTrip}
          className="w-full min-h-[64px] rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.97] text-slate-950 font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/25 transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
          <span>¡Llegué!</span>
        </button>
        <p className="text-center text-[11px] text-slate-400 mt-2">
          Presiona aquí apenas llegues a tu destino para cerrar el viaje.
        </p>
      </div>

      {/* Opciones para avisar a contactos que el viaje empezó */}
      {contacts.length > 0 && (
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4">
          <button
            type="button"
            onClick={() => setShowShareOptions((prev) => !prev)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>Avisar a contactos que vas en camino ({contacts.length})</span>
            </span>
            <ChevronRight
              className={`w-4 h-4 transition-transform ${showShareOptions ? 'rotate-90' : ''}`}
            />
          </button>

          {showShareOptions && (
            <div className="mt-3 pt-3 border-t border-slate-700/60 space-y-2">
              <p className="text-[11px] text-slate-400">
                Toca para enviar mensaje prearmado por WhatsApp:
              </p>
              {contacts.map((contact) => (
                <a
                  key={contact.id}
                  href={buildWhatsAppLink(contact.phone, startTripShareText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700/70 text-xs text-white transition-colors"
                >
                  <span className="font-medium">{contact.name}</span>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    Enviar WhatsApp &rarr;
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
