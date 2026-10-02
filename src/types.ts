/**
 * Tipos de datos fundamentales para "Llegué Bien".
 */

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  createdAt: number;
}

export type TripStatus = 'active' | 'completed';

export interface Trip {
  id: string;
  destination: string;
  startedAt: number;        // Timestamp en milisegundos (Date.now())
  estimatedArrival: number; // Timestamp en milisegundos del tiempo estimado
  estimatedMinutes: number; // Minutos iniciales elegidos (ej: 30)
  status: TripStatus;       // 'active' | 'completed'
  completedAt?: number;     // Timestamp cuando se presiona «Llegué»
}

export const STORAGE_KEYS = {
  CURRENT_TRIP: 'llegue_bien_trip_v1',
  CONTACTS: 'llegue_bien_contacts_v1',
  LAST_COMPLETED_TRIP: 'llegue_bien_last_completed_v1',
} as const;
