export interface TimeSlot {
  time: string;
  status: 'available' | 'reserved' | 'booked';
}