import { useState, useEffect } from 'react';
import { WeeklyCalendar } from '@/components/dashboard/WeeklyCalendar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fetchAvailability, updateAvailability, WeeklyAvailability } from '@/lib/mockApi';
import { useToast } from '@/hooks/use-toast';
import { Save, Clock } from 'lucide-react';

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState<WeeklyAvailability>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [workingHours, setWorkingHours] = useState({ start: '09:00', end: '18:00' });
  const { toast } = useToast();

  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const data = await fetchAvailability();
        setAvailability(data);
      } finally {
        setIsLoading(false);
      }
    };
    loadAvailability();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateAvailability(availability);
      toast({
        title: 'Availability Updated',
        description: 'Your schedule has been saved successfully.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save availability. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading availability..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Availability</h2>
          <p className="text-muted-foreground">Manage your weekly schedule and working hours.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Working Hours Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Working Hours
          </CardTitle>
          <CardDescription>Set your default shop hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={workingHours.start}
                onChange={(e) => setWorkingHours((prev) => ({ ...prev, start: e.target.value }))}
                className="w-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
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
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>
            Click or drag to toggle availability. Green slots are available for booking.
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
