import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TripForm } from './components/TripForm';
import { ActiveTripCard } from './components/ActiveTripCard';
import { CompletedTripCard } from './components/CompletedTripCard';
import { EmergencyContacts } from './components/EmergencyContacts';
import { Trip, EmergencyContact, STORAGE_KEYS } from './types';
import { safeGetItem, safeSetItem, safeRemoveItem } from './utils/storage';

export default function App() {
  // Estado de navegación activa ('trip' o 'contacts')
  const [activeTab, setActiveTab] = useState<'trip' | 'contacts'>('trip');

  // Estado del viaje activo actual
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(() => {
    return safeGetItem<Trip | null>(STORAGE_KEYS.CURRENT_TRIP, null);
  });

  // Estado del último viaje completado para mostrar la confirmación
  const [lastCompletedTrip, setLastCompletedTrip] = useState<Trip | null>(() => {
    return safeGetItem<Trip | null>(STORAGE_KEYS.LAST_COMPLETED_TRIP, null);
  });

  // Lista de contactos de emergencia guardados
  const [contacts, setContacts] = useState<EmergencyContact[]>(() => {
    return safeGetItem<EmergencyContact[]>(STORAGE_KEYS.CONTACTS, []);
  });

  // Sincronización persistente en localStorage cuando cambian los contactos
  useEffect(() => {
    safeSetItem(STORAGE_KEYS.CONTACTS, contacts);
  }, [contacts]);

  // Sincronización persistente en localStorage cuando cambia el viaje activo
  useEffect(() => {
    if (currentTrip) {
      safeSetItem(STORAGE_KEYS.CURRENT_TRIP, currentTrip);
    } else {
      safeRemoveItem(STORAGE_KEYS.CURRENT_TRIP);
    }
  }, [currentTrip]);

  // Sincronización persistente en localStorage cuando cambia el último viaje completado
  useEffect(() => {
    if (lastCompletedTrip) {
      safeSetItem(STORAGE_KEYS.LAST_COMPLETED_TRIP, lastCompletedTrip);
    }
  }, [lastCompletedTrip]);

  /**
   * 1. INICIAR UN VIAJE CON DESTINO Y HORA ESTIMADA DE LLEGADA
   * 
   * ⚠️ ERROR COMÚN:
   * Calcular `estimatedArrival` sumando milisegundos a una fecha fija en lugar de
   * `Date.now()`. Al momento del submit debe tomarse la hora presente exacta del dispositivo.
   */
  const handleStartTrip = (destination: string, minutes: number) => {
    const startedAt = Date.now();
    const estimatedArrival = startedAt + minutes * 60 * 1000;

    const newTrip: Trip = {
      id: `trip_${startedAt}_${Math.random().toString(36).substring(2, 7)}`,
      destination,
      startedAt,
      estimatedArrival,
      estimatedMinutes: minutes,
      status: 'active',
    };

    // Si había un viaje completado anterior en pantalla, lo reemplazamos por el nuevo viaje activo
    setLastCompletedTrip(null);
    setCurrentTrip(newTrip);
    setActiveTab('trip');
  };

  /**
   * 3. BOTÓN «LLEGUÉ» QUE CIERRA EL VIAJE
   * 
   * ⚠️ ERROR COMÚN:
   * Mutar directamente `currentTrip.status = 'completed'` y luego llamar `setCurrentTrip(currentTrip)`.
   * En React, si la referencia del objeto es idéntica, el reconciliador descarta la actualización
   * y la pantalla no cambia a "Viaje cerrado". Debe crearse una copia inmutable con el nuevo status y timestamp.
   */
  const handleFinishTrip = () => {
    if (!currentTrip) return;

    const completedAt = Date.now();
    const finishedTrip: Trip = {
      ...currentTrip,
      status: 'completed',
      completedAt,
    };

    // Marcamos el viaje cerrado, liberamos el viaje activo y guardamos el registro
    setCurrentTrip(null);
    setLastCompletedTrip(finishedTrip);
  };

  /**
   * Permite volver a la pantalla de inicio de viaje tras ver el viaje cerrado.
   */
  const handleNewTrip = () => {
    setLastCompletedTrip(null);
    setCurrentTrip(null);
  };

  /**
   * 2. GUARDAR CONTACTOS DE EMERGENCIA (NOMBRE Y TELÉFONO)
   * 
   * ⚠️ ERROR COMÚN:
   * No usar `crypto.randomUUID()` o un generador único confiable, provocando colisiones
   * si se agregan contactos rápidamente. Usamos timestamp + sufijo aleatorio.
   */
  const handleAddContact = (name: string, phone: string) => {
    const newContact: EmergencyContact = {
      id: `contact_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      phone,
      createdAt: Date.now(),
    };

    setContacts((prev) => [newContact, ...prev]);
  };

  const handleDeleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Barra superior orientada al contrato visual de AI Studio y mobile first */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        contactCount={contacts.length}
        hasActiveTrip={Boolean(currentTrip && currentTrip.status === 'active')}
      />

      {/* Contenedor central optimizado para celulares (max-w-md, espaciado cómodo de dedos) */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-5 flex flex-col">
        {activeTab === 'trip' ? (
          <div>
            {/* Caso A: Hay un viaje en curso activo */}
            {currentTrip && currentTrip.status === 'active' && (
              <ActiveTripCard
                trip={currentTrip}
                onFinishTrip={handleFinishTrip}
                contacts={contacts}
              />
            )}

            {/* Caso B: El viaje acaba de cerrarse con el botón «Llegué» */}
            {!currentTrip && lastCompletedTrip && (
              <CompletedTripCard
                trip={lastCompletedTrip}
                contacts={contacts}
                onNewTrip={handleNewTrip}
              />
            )}

            {/* Caso C: No hay viaje activo ni cerrado recién mostrado -> Formulario para iniciar viaje */}
            {!currentTrip && !lastCompletedTrip && (
              <TripForm
                onStartTrip={handleStartTrip}
                hasContacts={contacts.length > 0}
                onGoToContacts={() => setActiveTab('contacts')}
              />
            )}
          </div>
        ) : (
          /* Pantalla de gestión de contactos de emergencia */
          <EmergencyContacts
            contacts={contacts}
            onAddContact={handleAddContact}
            onDeleteContact={handleDeleteContact}
          />
        )}
      </main>

      {/* Pie minimalista y discreto con recordatorio útil */}
      <footer className="w-full max-w-md mx-auto px-4 py-3 text-center border-t border-slate-900 text-[11px] text-slate-400">
        <span>Llegué Bien · Los datos se guardan de forma segura en tu teléfono</span>
      </footer>
    </div>
  );
}
