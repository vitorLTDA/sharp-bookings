export interface TimeSlot {
  id: string;
  time: string;
  status: 'available' | 'reserved' | 'booked';
}