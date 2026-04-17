import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useBooking } from '@/contexts/BookingContext';
import { getAvailableSlots } from '@/api/availability';
import { TimeSlot } from '@/lib/types';
import { ArrowLeft, ArrowRight, Check, Clock, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TimeSelectPage() {
  const navigate = useNavigate();
  const { booking, setSelectedTime } = useBooking();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeSlots = useCallback(async () => {
    if (!booking.selectedDate) return;

    setLoading(true);
    setError(null);

    try {
      const dateStr = format(booking.selectedDate, 'yyyy-MM-dd');
      const slots = await getAvailableSlots(dateStr);
      setTimeSlots(slots);
    } catch (err) {
      setError('Failed to load available times. Please try again.');
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  }, [booking.selectedDate]);

  useEffect(() => {
    if (!booking.selectedBarber || !booking.selectedDate) {
      navigate('/book');
    }
  }, [booking.selectedBarber, booking.selectedDate, navigate]);

  useEffect(() => {
    fetchTimeSlots();
  }, [fetchTimeSlots]);

  const getSlotStyles = (slot: TimeSlot, isSelected: boolean) => {
    if (slot.status === 'booked') {
      return 'bg-muted text-muted-foreground cursor-not-allowed opacity-50';
    }
    if (slot.status === 'reserved') {
      return 'bg-warning/20 text-warning-foreground border-warning cursor-not-allowed';
    }
    if (isSelected) {
      return 'bg-accent text-accent-foreground border-accent';
    }
    return 'bg-success/10 text-success border-success/50 hover:bg-success/20 cursor-pointer';
  };

  const getSlotIcon = (slot: TimeSlot) => {
    if (slot.status === 'booked') return <X className="h-4 w-4" />;
    if (slot.status === 'reserved') return <Clock className="h-4 w-4" />;
    return <Check className="h-4 w-4" />;
  };

  const handleTimeSelect = (slot: TimeSlot) => {
    if (slot.status === 'available') {
      setSelectedTime(slot.time);
    }
  };

  const handleContinue = () => {
    if (booking.selectedTime) {
      navigate('/book/confirm');
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Progress Indicator */}
          <div className="mb-8 flex items-center justify-center gap-2 text-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-success-foreground font-medium">
              ✓
            </span>
            <span className="text-muted-foreground">Choose Barber</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-success-foreground font-medium">
              ✓
            </span>
            <span className="text-muted-foreground">Select Date</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground font-medium">
              3
            </span>
            <span className="font-medium">Select Time</span>
          </div>

          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">Select a Time</h1>
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">{booking.selectedBarber?.name}</span>
              {' • '}
              {booking.selectedDate && format(booking.selectedDate, 'EEEE, MMMM d, yyyy')}
            </p>
          </div>

          <div className="mx-auto max-w-lg">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Available Times</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Legend */}
                <div className="mb-6 flex flex-wrap justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-success/20 border border-success/50" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-warning/20 border border-warning" />
                    <span>Reserved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-muted opacity-50" />
                    <span>Booked</span>
                  </div>
                </div>

                {/* Time Slots Grid */}
                {loading ? (
                  <div className="grid grid-cols-3 gap-3">
                    {[...Array(9)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full rounded-lg" />
                    ))}
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center gap-4 py-6">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                    <p className="text-center text-sm text-destructive">{error}</p>
                    <Button variant="outline" size="sm" onClick={fetchTimeSlots}>
                      Try Again
                    </Button>
                  </div>
                ) : timeSlots.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No available slots
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((slot) => {
                      const isSelected = booking.selectedTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          onClick={() => handleTimeSelect(slot)}
                          disabled={slot.status !== 'available'}
                          className={cn(
                            'flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors',
                            getSlotStyles(slot, isSelected)
                          )}
                        >
                          {getSlotIcon(slot)}
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-6 flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/book/date')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={!booking.selectedTime}
                onClick={handleContinue}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
