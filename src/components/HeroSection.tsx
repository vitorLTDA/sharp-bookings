import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { shopInfo } from '@/lib/mockData';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/90 py-20 text-primary-foreground md:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-accent blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
          {shopInfo.name}
        </h1>
        <p className="mb-8 text-lg text-primary-foreground/80 md:text-xl">
          {shopInfo.tagline}
        </p>
        <p className="mx-auto mb-10 max-w-2xl text-primary-foreground/70">
          Experience premium grooming services from our team of skilled barbers.
          Book your appointment today and walk out looking your best.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Link to="/book" className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Book Appointment
          </Link>
        </Button>
      </div>
    </section>
  );
}
