export interface Barber {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  bio: string;
}

export interface TimeSlot {
  time: string;
  status: 'available' | 'reserved' | 'booked';
}

export interface Appointment {
  id: string;
  barberId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  time: string;
  status: 'reserved' | 'booked';
}

export const barbers: Barber[] = [
  {
    id: '1',
    name: 'Marcus Johnson',
    specialty: 'Classic Cuts & Fades',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    bio: '10+ years of experience in classic and modern styles.',
  },
  {
    id: '2',
    name: 'David Chen',
    specialty: 'Modern Styles & Beard Grooming',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    bio: 'Specializing in trendy cuts and precision beard work.',
  },
  {
    id: '3',
    name: 'James Williams',
    specialty: 'Precision Fades & Designs',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
    bio: 'Known for detailed fade work and creative designs.',
  },
];

// Generate time slots for a given date (9 AM to 6 PM, 1-hour slots)
export function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let hour = 9; hour <= 17; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    // Randomly assign some slots as booked/reserved for demo
    const random = Math.random();
    let status: TimeSlot['status'] = 'available';
    if (random < 0.2) status = 'booked';
    else if (random < 0.3) status = 'reserved';
    
    slots.push({ time, status });
  }
  return slots;
}

export const shopInfo = {
  name: 'Elite Cuts',
  tagline: 'Where Style Meets Precision',
  address: '123 Main Street, Downtown',
  phone: '(555) 123-4567',
  email: 'info@elitecuts.com',
  hours: 'Mon-Sat: 9AM - 7PM',
};
