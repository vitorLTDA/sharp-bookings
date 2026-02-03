import { DashboardAppointment } from '@/lib/mockDashboardData';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MessageCircle, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface AppointmentsTableProps {
  appointments: DashboardAppointment[];
  onViewDetails: (appointment: DashboardAppointment) => void;
  onSendWhatsApp: (appointment: DashboardAppointment) => void;
}

export function AppointmentsTable({
  appointments,
  onViewDetails,
  onSendWhatsApp,
}: AppointmentsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Barber</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{appointment.customerName}</p>
                  <p className="text-xs text-muted-foreground">{appointment.customerEmail}</p>
                </div>
              </TableCell>
              <TableCell>{appointment.barberName}</TableCell>
              <TableCell>{format(new Date(appointment.date), 'MMM d, yyyy')}</TableCell>
              <TableCell>{appointment.time}</TableCell>
              <TableCell>
                <StatusBadge status={appointment.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewDetails(appointment)}
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onSendWhatsApp(appointment)}
                    title="Send WhatsApp"
                    className="text-success hover:text-success"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
