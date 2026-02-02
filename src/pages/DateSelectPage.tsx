import { useNavigate } from 'react-router-dom';
import { format, isBefore, startOfDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useBooking } from '@/contexts/BookingContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

export default function DateSelectPage() {
  const navigate = useNavigate();
  const { booking, setSelectedDate } = useBooking();

  // Redirect if no barber selected
  useEffect(() => {
    if (!booking.selectedBarber) {
      navigate('/book');
    }
  }, [booking.selectedBarber, navigate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleContinue = () => {
    if (booking.selectedDate) {
      navigate('/book/time');
    }
  };

  const today = startOfDay(new Date());

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
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground font-medium">
              2
            </span>
            <span className="font-medium">Select Date</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted-foreground/20 text-muted-foreground">
              3
            </span>
            <span className="text-muted-foreground">Confirm</span>
          </div>

          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">Select a Date</h1>
            <p className="text-muted-foreground">
              Booking with <span className="font-medium text-foreground">{booking.selectedBarber?.name}</span>
            </p>
          </div>

          <div className="mx-auto max-w-md">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Pick a Date</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={booking.selectedDate || undefined}
                  onSelect={handleDateSelect}
                  disabled={(date) => isBefore(date, today)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <div className="mt-6 flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/book')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={!booking.selectedDate}
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
