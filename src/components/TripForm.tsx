import React, { useState } from 'react';
import { Navigation, Clock, Home, School, Briefcase, BookOpen, AlertCircle } from 'lucide-react';
import { formatTimeHHMM } from '../utils/time';

interface TripFormProps {
  onStartTrip: (destination: string, minutes: number) => void;
  hasContacts: boolean;
  onGoToContacts: () => void;
}

const QUICK_DESTINATIONS = [
  { label: 'Mi casa', icon: Home },
  { label: 'Instituto', icon: School },
  { label: 'Biblioteca', icon: BookOpen },
  { label: 'Trabajo', icon: Briefcase },
];

const PRESET_MINUTES = [15, 30, 45, 60];

export const TripForm: React.FC<TripFormProps> = ({
  onStartTrip,
  hasContacts,
  onGoToContacts,
}) => {
  const [destination, setDestination] = useState('');
  const [minutes, setMinutes] = useState(30);
  const [error, setError] = useState<string | null>(null);

  // ⚠️ ERROR COMÚN: Calcular la hora estimada de llegada estáticamente en el estado inicial
  // del componente. Si el usuario deja la pantalla abierta 10 minutos antes de presionar "Iniciar",
  // la hora estimada quedaría en el pasado. Se debe proyectar siempre en base al momento presente (`Date.now()`).
  const estimatedTimestamp = Date.now() + minutes * 60 * 1000;
  const estimatedTimeFormatted = formatTimeHHMM(estimatedTimestamp);

  const handleSubmit = (e: React.FormEvent) => {
    // ⚠️ ERROR COMÚN: Olvidar `e.preventDefault()`, lo que causa que el formulario recargue la página en móviles
    e.preventDefault();

    const cleanDest = destination.trim();
    if (!cleanDest) {
      setError('Por favor indica hacia dónde vas (ej: Mi casa).');
      return;
    }

    if (minutes <= 0 || isNaN(minutes)) {
      setError('La duración estimada debe ser mayor a 0 minutos.');
      return;
    }

    setError(null);
    onStartTrip(cleanDest, minutes);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Alerta si no tiene contactos de emergencia registrados */}
      {!hasContacts && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200">
            <span className="font-semibold text-amber-300">Aún no agregaste contactos:</span> Podrás
            avisarles con 1 toque por WhatsApp o SMS cuando salgas o cuando llegues.{' '}
            <button
              type="button"
              onClick={onGoToContacts}
              className="text-amber-400 underline font-semibold hover:text-amber-300 inline"
            >
              Agregar contactos ahora
            </button>
          </div>
        </div>
      )}

      {/* 1. Destino */}
      <div className="bg-slate-850 bg-slate-800/60 border border-slate-700/60 rounded-3xl p-5 shadow-sm">
        <label htmlFor="destination-input" className="block text-sm font-semibold text-slate-200 mb-2">
          ¿A dónde vas?
        </label>

        <div className="relative">
          <input
            id="destination-input"
            type="text"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Ej: Mi casa, Instituto 45, etc."
            className="w-full h-13 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-base"
            autoComplete="off"
          />
        </div>

        {/* Atajos rápidos para destino */}
        <div className="mt-3">
          <p className="text-xs text-slate-400 mb-2">Destinos frecuentes:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_DESTINATIONS.map((item) => {
              const Icon = item.icon;
              const isSelected = destination === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setDestination(item.label);
                    if (error) setError(null);
                  }}
                  className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                      : 'bg-slate-900/70 border-slate-700/80 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Hora estimada de llegada */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Tiempo estimado de llegada</span>
          </label>
          <span className="text-xs text-slate-400">
            Llegada aprox:{' '}
            <strong className="text-emerald-400 font-semibold">{estimatedTimeFormatted}</strong>
          </span>
        </div>

        {/* Botones de duración preestablecida */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {PRESET_MINUTES.map((mins) => (
            <button
              key={mins}
              type="button"
              onClick={() => setMinutes(mins)}
              className={`min-h-[46px] rounded-xl text-sm font-bold border transition-all active:scale-95 flex flex-col items-center justify-center ${
                minutes === mins
                  ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              <span>{mins}</span>
              <span className="text-[10px] font-normal opacity-80 leading-none">min</span>
            </button>
          ))}
        </div>

        {/* Control fino de minutos */}
        <div className="flex items-center justify-between bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-700/80">
          <span className="text-xs text-slate-400">Personalizar duración:</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={minutes <= 5}
              onClick={() => setMinutes((m) => Math.max(5, m - 5))}
              className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-bold hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
            >
              -
            </button>
            <span className="text-sm font-bold text-white min-w-[50px] text-center">
              {minutes} min
            </span>
            <button
              type="button"
              disabled={minutes >= 240}
              onClick={() => setMinutes((m) => Math.min(240, m + 5))}
              className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-bold hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Botón principal de inicio de viaje (Thumb Zone amigable, >48px altura) */}
      <button
        type="submit"
        className="w-full min-h-[52px] rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
      >
        <Navigation className="w-5 h-5" />
        <span>Iniciar viaje</span>
      </button>
    </form>
  );
};
