import { Scissors, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { shopInfo } from '@/lib/mockData';

export function Footer() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Scissors className="h-6 w-6 text-accent" />
              <span className="text-xl font-bold">{shopInfo.name}</span>
            </div>
            <p className="text-sm text-primary-foreground/80">
              {shopInfo.tagline}
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Us</h3>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{shopInfo.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{shopInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{shopInfo.email}</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h3 className="font-semibold">Hours</h3>
            <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
              <Clock className="h-4 w-4" />
              <span>{shopInfo.hours}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60">
          © {new Date().getFullYear()} {shopInfo.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
