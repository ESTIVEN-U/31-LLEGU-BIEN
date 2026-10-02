import React, { useState } from 'react';
import { UserPlus, Trash2, Phone, User, MessageCircle, AlertCircle, PhoneCall } from 'lucide-react';
import { EmergencyContact } from '../types';
import { cleanPhoneNumber, buildWhatsAppLink } from '../utils/time';

interface EmergencyContactsProps {
  contacts: EmergencyContact[];
  onAddContact: (name: string, phone: string) => void;
  onDeleteContact: (id: string) => void;
}

export const EmergencyContacts: React.FC<EmergencyContactsProps> = ({
  contacts,
  onAddContact,
  onDeleteContact,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(contacts.length === 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = name.trim();
    const rawPhone = phone.trim();

    // ⚠️ ERROR COMÚN 1: Validar únicamente con `length > 0` sin revisar caracteres numéricos reales.
    // Un contacto con teléfono "---" o "( )" pasaría la validación pero fallaría completamente
    // al intentar disparar una llamada o abrir WhatsApp en una situación real.
    const digitsOnly = rawPhone.replace(/\D/g, '');

    if (!cleanName) {
      setError('Escribe el nombre del contacto (ej: Mamá, Papá, Hermana, Amigo).');
      return;
    }

    if (digitsOnly.length < 6) {
      setError('Ingresa un número de teléfono válido con al menos 6 dígitos.');
      return;
    }

    setError(null);
    onAddContact(cleanName, rawPhone);
    setName('');
    setPhone('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Encabezado descriptivo */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-5">
        <h2 className="text-base font-bold text-white mb-1">Contactos de emergencia</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Personas a las que podrás avisar con un toque cuando comiences tu viaje o cuando llegues a
          salvo.
        </p>

        {/* Botón para abrir el formulario si está plegado */}
        {!showAddForm && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="mt-3 w-full min-h-[46px] rounded-xl bg-slate-700 hover:bg-slate-650 active:scale-[0.98] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>Agregar nuevo contacto</span>
          </button>
        )}

        {/* Formulario de agregar contacto */}
        {showAddForm && (
          <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-slate-700/60 space-y-3">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-300 mb-1">
                Nombre o parentesco
              </label>
              <div className="relative">
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Ej: Mamá, Lucas, Tía Laura"
                  className="w-full h-11 px-3 pl-9 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label htmlFor="contact-phone" className="block text-xs font-semibold text-slate-300 mb-1">
                Teléfono móvil / WhatsApp
              </label>
              <div className="relative">
                <input
                  id="contact-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Ej: +54 9 11 2345 6789 o 1123456789"
                  className="w-full h-11 px-3 pl-9 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                />
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Tip: Incluye código de país y de área para compatibilidad directa con WhatsApp.
              </p>
            </div>

            {error && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 min-h-[46px] rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Guardar contacto</span>
              </button>

              {contacts.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setError(null);
                  }}
                  className="min-h-[46px] px-4 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Lista de contactos guardados */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Contactos guardados ({contacts.length})
          </span>
        </div>

        {contacts.length === 0 ? (
          <div className="bg-slate-800/30 border border-dashed border-slate-700/80 rounded-2xl p-6 text-center text-xs text-slate-400">
            No tienes contactos de emergencia guardados todavía. Agrega al menos uno para poder
            notificarle con un solo toque.
          </div>
        ) : (
          contacts.map((contact) => {
            const cleanPhone = cleanPhoneNumber(contact.phone);
            const testWhatsApp = buildWhatsAppLink(
              contact.phone,
              'Hola, te agregué como contacto de emergencia en la app Llegué Bien para avisarte cuando esté en viaje.'
            );

            return (
              <div
                key={contact.id}
                className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-3.5 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{contact.name}</p>
                  <p className="text-xs text-slate-400 tabular-nums">{contact.phone}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Botón llamada directa */}
                  <a
                    href={`tel:${cleanPhone}`}
                    title="Llamar"
                    className="min-w-[40px] min-h-[40px] rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>

                  {/* Botón WhatsApp */}
                  <a
                    href={testWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Enviar WhatsApp"
                    className="min-w-[40px] min-h-[40px] rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  {/* Botón eliminar */}
                  <button
                    type="button"
                    onClick={() => onDeleteContact(contact.id)}
                    title="Eliminar contacto"
                    className="min-w-[40px] min-h-[40px] rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
