import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WeeklyCalendar } from '@/components/dashboard/WeeklyCalendar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAvailability, updateAvailability } from '@/api/admin';
import { useToast } from '@/hooks/use-toast';
import { Save, Clock } from 'lucide-react';

export default function AvailabilityPage() {
  const queryClient = useQueryClient();
  const [availability, setAvailability] = useState<any>({});
  const [workingHours, setWorkingHours] = useState({ start: '09:00', end: '18:00' });
  const { toast } = useToast();

  const { isLoading } = useQuery({
    queryKey: ['availability'],
    queryFn: async () => {
      const data = await getAvailability();
      setAvailability(data);
      return data;
    },
  });

  const { mutate: saveAvailability, isPending: isSaving } = useMutation({
    mutationFn: () => updateAvailability(availability),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      toast({
        title: 'Disponibilidade Atualizada',
        description: 'Sua agenda foi salva com sucesso.',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Falha ao salvar disponibilidade. Tente novamente.',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Carregando disponibilidade..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Disponibilidade</h2>
          <p className="text-muted-foreground">Gerencie sua agenda semanal e horários de trabalho.</p>
        </div>
        <Button onClick={() => saveAvailability()} disabled={isSaving}>
          {isSaving ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>

      {/* Working Hours Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horário de Funcionamento
          </CardTitle>
          <CardDescription>Defina o horário padrão da barbearia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Horário de Início</Label>
              <Input
                id="start-time"
                type="time"
                value={workingHours.start}
                onChange={(e) => setWorkingHours((prev) => ({ ...prev, start: e.target.value }))}
                className="w-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">Horário de Término</Label>
              <Input
                id="end-time"
                type="time"
                value={workingHours.end}
                onChange={(e) => setWorkingHours((prev) => ({ ...prev, end: e.target.value }))}
                className="w-[150px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Agenda Semanal</CardTitle>
          <CardDescription>
            Clique ou arraste para alternar disponibilidade. Horários em verde estão disponíveis para agendamento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WeeklyCalendar
            availability={availability}
            onAvailabilityChange={setAvailability}
          />
        </CardContent>
      </Card>
    </div>
  );
}
