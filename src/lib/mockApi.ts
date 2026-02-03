import { 
  mockAppointments, 
  mockSubscriptions,
  mockRevenueData7Days,
  mockRevenueData30Days,
  DashboardAppointment,
  AppointmentStatus,
  RevenueData,
  Subscription,
} from './mockDashboardData';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface AppointmentFilters {
  status?: AppointmentStatus | 'all';
  dateFrom?: string;
  dateTo?: string;
}

export async function fetchAppointments(filters: AppointmentFilters = {}): Promise<DashboardAppointment[]> {
  await delay(600);
  
  let appointments = [...mockAppointments];
  
  if (filters.status && filters.status !== 'all') {
    appointments = appointments.filter(a => a.status === filters.status);
  }
  
  if (filters.dateFrom) {
    appointments = appointments.filter(a => a.date >= filters.dateFrom!);
  }
  
  if (filters.dateTo) {
    appointments = appointments.filter(a => a.date <= filters.dateTo!);
  }
  
  return appointments;
}

export async function fetchSubscriptions(): Promise<Subscription[]> {
  await delay(400);
  return mockSubscriptions;
}

export async function fetchRevenueData(period: '7' | '30'): Promise<RevenueData[]> {
  await delay(500);
  return period === '7' ? mockRevenueData7Days : mockRevenueData30Days;
}

export interface WeeklyAvailability {
  [day: string]: {
    [hour: string]: boolean;
  };
}

// Default availability - all slots available 9-17
function getDefaultAvailability(): WeeklyAvailability {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const availability: WeeklyAvailability = {};
  
  days.forEach(day => {
    availability[day] = {};
    for (let hour = 9; hour <= 17; hour++) {
      availability[day][`${hour.toString().padStart(2, '0')}:00`] = day !== 'sunday';
    }
  });
  
  return availability;
}

let currentAvailability = getDefaultAvailability();

export async function fetchAvailability(): Promise<WeeklyAvailability> {
  await delay(400);
  return { ...currentAvailability };
}

export async function updateAvailability(availability: WeeklyAvailability): Promise<{ success: boolean }> {
  await delay(500);
  currentAvailability = { ...availability };
  return { success: true };
}

export async function sendWhatsAppNotification(
  type: 'single' | 'slot' | 'day',
  params: { appointmentId?: string; date?: string; time?: string }
): Promise<{ success: boolean; message: string }> {
  await delay(800);
  
  let count = 1;
  if (type === 'slot' && params.date && params.time) {
    count = mockAppointments.filter(a => a.date === params.date && a.time === params.time).length;
  } else if (type === 'day' && params.date) {
    count = mockAppointments.filter(a => a.date === params.date).length;
  }
  
  return {
    success: true,
    message: `WhatsApp notification sent to ${count} customer${count > 1 ? 's' : ''}`,
  };
}
