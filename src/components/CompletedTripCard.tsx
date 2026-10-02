import React from 'react';
import { CheckCircle2, MapPin, Clock, RotateCcw, Share2 } from 'lucide-react';
import { Trip, EmergencyContact } from '../types';
import { formatTimeHHMM, buildWhatsAppLink } from '../utils/time';

interface CompletedTripCardProps {
  trip: Trip;
  contacts: EmergencyContact[];
  onNewTrip: () => void;
}

export const CompletedTripCard: React.FC<CompletedTripCardProps> = ({
  trip,
  contacts,
  onNewTrip,
}) => {
  const completedAt = trip.completedAt || Date.now();
  const completedTimeFormatted = formatTimeHHMM(completedAt);
  const startedTimeFormatted = formatTimeHHMM(trip.startedAt);

  // Cálculo de duración real del viaje en minutos
  const durationMinutes = Math.max(1, Math.round((completedAt - trip.startedAt) / 60000));

  // Mensaje para notificar a los contactos de emergencia
  const arrivalMessage = `¡Hola! Ya llegué bien a "${trip.destination}" (a las ${completedTimeFormatted}). Todo en orden.`;

  return (
    <div className="space-y-4">
      {/* Tarjeta de estado de viaje cerrado */}
      <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-3xl p-6 text-center shadow-lg shadow-emerald-950/20">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 text-emerald-400">
          <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
        </div>

        {/* Criterio de aceptación explícito: "veo el viaje marcado como cerrado" */}
        <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
          Viaje cerrado
        </div>

        <h2 className="text-2xl font-bold text-white mb-1">¡Llegaste a tu destino!</h2>
        <p className="text-sm text-slate-300 flex items-center justify-center gap-1.5 mb-5">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <strong className="text-white">{trip.destination}</strong>
        </p>

        {/* Resumen del viaje cerrado */}
        <div className="grid grid-cols-3 gap-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-3 text-left">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Salida</p>
            <p className="text-sm font-bold text-white tabular-nums">{startedTimeFormatted}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Llegada</p>
            <p className="text-sm font-bold text-emerald-400 tabular-nums">
              {completedTimeFormatted}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Duración</p>
            <p className="text-sm font-bold text-white tabular-nums">{durationMinutes} min</p>
          </div>
        </div>
      </div>

      {/* Avisar a contactos de emergencia que llegó bien */}
      {contacts.length > 0 && (
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
          <p className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>Avisar que llegaste bien a tus contactos:</span>
          </p>
          <div className="space-y-2">
            {contacts.map((contact) => (
              <a
                key={contact.id}
                href={buildWhatsAppLink(contact.phone, arrivalMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700/80 text-xs text-white transition-all active:scale-[0.99]"
              >
                <div className="text-left">
                  <span className="font-semibold block">{contact.name}</span>
                  <span className="text-[11px] text-slate-400">{contact.phone}</span>
                </div>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-semibold text-xs border border-emerald-500/30">
                  Enviar WhatsApp
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Botón para iniciar un nuevo viaje */}
      <button
        type="button"
        onClick={onNewTrip}
        className="w-full min-h-[50px] rounded-2xl bg-slate-800 hover:bg-slate-750 active:scale-[0.98] text-slate-200 font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Iniciar otro viaje</span>
      </button>
    </div>
  );
};
