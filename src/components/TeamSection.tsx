import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { barbers } from '@/lib/mockData';

export function TeamSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Meet Our Team</h2>
          <p className="text-muted-foreground">
            Expert barbers ready to give you the perfect cut
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {barbers.map((barber) => (
            <Card key={barber.id} className="overflow-hidden transition-shadow hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <Avatar className="mx-auto mb-4 h-24 w-24">
                  <AvatarImage src={barber.avatar} alt={barber.name} />
                  <AvatarFallback className="text-lg">
                    {barber.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mb-1 text-lg font-semibold">{barber.name}</h3>
                <p className="mb-3 text-sm text-accent">{barber.specialty}</p>
                <p className="mb-4 text-sm text-muted-foreground">{barber.bio}</p>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/book?barber=${barber.id}`}>Book with {barber.name.split(' ')[0]}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
