import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { getAvailableSlots } from '@/api/availability';
import { TimeSlot } from '@/lib/types';
import { createAdminAppointment } from '@/api/admin';
import { useToast } from '@/hooks/use-toast';
import { format, isBefore, startOfToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

type Step = 1 | 2 | 3;

export function AdminBookingModal({ open, onOpenChange, onSuccess }: AdminBookingModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlotId, setSelectedSlotId] = useState<string | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createAppointment, isPending } = useMutation({
    mutationFn: () => createAdminAppointment({
      slotId: selectedSlotId!,
      name: clientName,
      phone: clientPhone || undefined,
      email: clientEmail || undefined,
    }),
    onSuccess: () => {
      toast({
        title: 'Agendamento Criado',
        description: 'O agendamento foi criado com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      onSuccess();
      resetModal();
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.response?.data?.error || 'Falha ao criar agendamento',
        variant: 'destructive',
      });
    },
  });

  const resetModal = () => {
    setStep(1);
    setSelectedDate(undefined);
    setSelectedSlotId(undefined);
    setSelectedTime('');
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setSlots([]);
  };

  const handleDateSelect = async (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    setLoadingSlots(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const availableSlots = await getAvailableSlots(formattedDate);
      setSlots(availableSlots);
      setStep(2);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao carregar horários disponíveis',
        variant: 'destructive',
      });
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlotId(slot.id);
    setSelectedTime(slot.time);
    setStep(3);
  };

    const handleSubmit = () => {
    if (!clientName.trim()) {
      toast({
        title: 'Nome Obrigatório',
        description: 'Por favor, informe o nome do cliente',
        variant: 'destructive',
      });
      return;
    }
    createAppointment();
  };

  const today = startOfToday();

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetModal();
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Agendamento</DialogTitle>
          <DialogDescription>
            {step === 1 && 'Selecione uma data para o agendamento'}
            {step === 2 && 'Escolha um horário disponível'}
            {step === 3 && 'Informe os dados do cliente'}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Date Selection */}
        {step === 1 && (
          <div className="flex justify-center py-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => isBefore(date, today)}
              className="rounded-md border"
            />
          </div>
        )}

        {/* Step 2: Time Slot Selection */}
        {step === 2 && (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep(1)}
              >
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </Button>
              <span className="text-sm text-muted-foreground">
                {selectedDate && format(selectedDate, 'MMM d, yyyy')}
              </span>
            </div>

            {loadingSlots ? (
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : slots.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhum horário disponível para esta data
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {slots
                  .filter((slot) => slot.status === 'available')
                  .map((slot) => (
                    <Button
                      key={slot.id}
                      variant={selectedSlotId === slot.id ? 'default' : 'outline'}
                      onClick={() => handleSlotSelect(slot)}
                      className="text-sm"
                    >
                      {slot.time}
                    </Button>
                  ))}
              </div>
            )}

            {/* Legend */}
            <div className="flex gap-4 text-xs text-muted-foreground pt-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-success/20 border border-success" />
                <span>Disponível</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Client Information */}
        {step === 3 && (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep(2)}
              >
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </Button>
              <span className="text-sm text-muted-foreground">
                {selectedDate && format(selectedDate, 'MMM d, yyyy')} às {selectedTime}
              </span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientName">Nome do Cliente *</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Informe o nome do cliente"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientPhone">Telefone (Opcional)</Label>
              <Input
                id="clientPhone"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="Número de telefone do cliente"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientEmail">E-mail (Opcional)</Label>
              <Input
                id="clientEmail"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="E-mail do cliente"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isPending || !clientName.trim()}
              >
                {isPending ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Criar Agendamento
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
