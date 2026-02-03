import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  cta: string;
  ctaVariant: 'default' | 'outline';
}

const plans: Plan[] = [
  {
    name: 'Starter',
    price: '$9.99',
    description: 'Perfect for solo barbers just getting started.',
    features: [
      { text: 'Basic online bookings', included: true },
      { text: 'WhatsApp confirmations', included: true },
      { text: '1 barber profile', included: true },
      { text: 'Calendar sync', included: true },
      { text: 'Payment processing', included: false },
      { text: 'Analytics dashboard', included: false },
      { text: 'Broadcast messaging', included: false },
    ],
    cta: 'Get Started',
    ctaVariant: 'outline',
  },
  {
    name: 'Pro',
    price: '$24.99',
    description: 'For growing shops that need more power.',
    features: [
      { text: 'Everything in Starter', included: true },
      { text: 'Payment processing', included: true },
      { text: 'Analytics dashboard', included: true },
      { text: 'Broadcast WhatsApp messages', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Multi-barber support', included: false },
      { text: 'Subscription management', included: false },
    ],
    popular: true,
    cta: 'Get Started',
    ctaVariant: 'default',
  },
  {
    name: 'Business',
    price: '$49.99',
    description: 'Full-featured solution for multi-barber shops.',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Multi-barber support', included: true },
      { text: 'Customer subscriptions', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Priority phone support', included: true },
      { text: 'Custom branding', included: true },
      { text: 'API access', included: true },
    ],
    cta: 'Contact Us',
    ctaVariant: 'outline',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 text-center bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Choose the plan that fits your shop. Start free, upgrade anytime.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative flex flex-col ${
                    plan.popular ? 'border-accent shadow-lg scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                      <Star className="mr-1 h-3 w-3" />
                      Most Popular
                    </Badge>
                  )}

                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-3 flex-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div
                            className={`rounded-full p-0.5 ${
                              feature.included
                                ? 'bg-success/10 text-success'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            <Check className="h-3 w-3" />
                          </div>
                          <span
                            className={
                              feature.included ? '' : 'text-muted-foreground line-through'
                            }
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`mt-6 w-full ${
                        plan.ctaVariant === 'default'
                          ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                          : ''
                      }`}
                      variant={plan.ctaVariant}
                      asChild
                    >
                      <Link to="/auth">{plan.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ or additional info */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
            <p className="text-muted-foreground mb-6">
              We offer custom packages for large barbershop chains and franchises.
              Contact us to discuss your specific needs.
            </p>
            <Button variant="outline" asChild>
              <Link to="/#contact">Contact Us</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
