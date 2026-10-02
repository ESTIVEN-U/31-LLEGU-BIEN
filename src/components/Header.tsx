import React from 'react';
import { ShieldCheck, MapPin, Users } from 'lucide-react';

interface HeaderProps {
  activeTab: 'trip' | 'contacts';
  onSelectTab: (tab: 'trip' | 'contacts') => void;
  contactCount: number;
  hasActiveTrip: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  contactCount,
  hasActiveTrip,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Marca de la app */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
              Llegué Bien
            </h1>
            <p className="text-[11px] text-slate-400">Seguridad para estudiantes</p>
          </div>
        </div>

        {/* Selector de pestañas móvil con hitboxes cómodos (>=44px) */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/50">
          <button
            type="button"
            onClick={() => onSelectTab('trip')}
            className={`min-h-[38px] px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'trip'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Viaje</span>
            {hasActiveTrip && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('contacts')}
            className={`min-h-[38px] px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'contacts'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Contactos</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === 'contacts'
                  ? 'bg-slate-950/20 text-slate-950 font-bold'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {contactCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
