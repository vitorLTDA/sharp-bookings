import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { AppointmentsTable } from '@/components/dashboard/AppointmentsTable';
import { AppointmentDetailModal } from '@/components/dashboard/AppointmentDetailModal';
import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchAppointments, sendWhatsAppNotification, AppointmentFilters } from '@/lib/mockApi';
import { DashboardAppointment, AppointmentStatus } from '@/lib/mockDashboardData';
import { Calendar, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<DashboardAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [selectedAppointment, setSelectedAppointment] = useState<DashboardAppointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const filters: AppointmentFilters = { status: statusFilter };
      if (dateFrom) filters.dateFrom = format(dateFrom, 'yyyy-MM-dd');
      if (dateTo) filters.dateTo = format(dateTo, 'yyyy-MM-dd');
      
      const data = await fetchAppointments(filters);
      setAppointments(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [statusFilter, dateFrom, dateTo]);

  const handleViewDetails = (appointment: DashboardAppointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleSendWhatsApp = async (appointment: DashboardAppointment) => {
    const result = await sendWhatsAppNotification('single', { appointmentId: appointment.id });
    toast({
      title: 'Notification Sent',
      description: result.message,
    });
  };

  const handleNotifyDay = async () => {
    if (!dateFrom) {
      toast({
        title: 'Select a date',
        description: 'Please select a date to notify all customers for that day.',
        variant: 'destructive',
      });
      return;
    }
    
    const result = await sendWhatsAppNotification('day', { date: format(dateFrom, 'yyyy-MM-dd') });
    toast({
      title: 'Notifications Sent',
      description: result.message,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Appointments</h2>
          <p className="text-muted-foreground">Manage your bookings and send notifications.</p>
        </div>
        <Button onClick={handleNotifyDay} variant="outline">
          <MessageCircle className="mr-2 h-4 w-4" />
          Notify Day
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AppointmentStatus | 'all')}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>

        <DateRangeFilter
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No appointments found"
          description="Try adjusting your filters or check back later."
        />
      ) : (
        <AppointmentsTable
          appointments={appointments}
          onViewDetails={handleViewDetails}
          onSendWhatsApp={handleSendWhatsApp}
        />
      )}

      <AppointmentDetailModal
        appointment={selectedAppointment}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSendWhatsApp={handleSendWhatsApp}
      />
    </div>
  );
}
