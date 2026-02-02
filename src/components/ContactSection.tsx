import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { shopInfo } from '@/lib/mockData';

export function ContactSection() {
  const contactItems = [
    { icon: MapPin, label: 'Address', value: shopInfo.address },
    { icon: Phone, label: 'Phone', value: shopInfo.phone },
    { icon: Mail, label: 'Email', value: shopInfo.email },
    { icon: Clock, label: 'Hours', value: shopInfo.hours },
  ];

  return (
    <section className="bg-muted py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Visit Us</h2>
          <p className="text-muted-foreground">
            We're conveniently located downtown
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          {contactItems.map((item) => (
            <Card key={item.label} className="text-center">
              <CardContent className="p-6">
                <item.icon className="mx-auto mb-3 h-8 w-8 text-accent" />
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                  {item.label}
                </h3>
                <p className="font-medium">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
