//src/app/(public)/pricing/page.tsx

import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Pricing = () => {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://app.audit-iq.com";

    const planToUrl = {
    starter: `${APP_URL}/signup?plan=starter`,
    consultant: `${APP_URL}/signup?plan=consultant`,
    };
  
    const plans = [
    {
      name: "🟦 Starter",
      subtitle: "For SMEs formalising compliance processes",
      description: "For SMEs formalising compliance processes",
      price: "AUD $149",
      period: "per month",
      features: [
        "Up to 5 users",
        "10 documents/month (extraction + summaries)",
        "Obligation extraction",
        "Requirement summaries",
        "Evidence tagging",
        "Export to PDF / Excel",
        "Standard email support",
        "Access to roadmap updates",
      ],
      cta: "Request Demo",
      popular: false,
    },
    {
      name: "🟩 Consultant",
      subtitle: "Most Popular",
      description: "For compliance consultants, auditors, and boutique advisory firms",
      price: "AUD $399",
      period: "per month",
      features: [
        "Everything in Starter, plus:",
        "Up to 10 users",
        "30 documents/month",
        "Multi-client workspaces",
        "Evidence mapping & tagging",
        "Client-ready exports",
        "Priority email support",
        "Early access to beta features",
      ],
      cta: "Request Demo",
      popular: true,
    },
    {
      name: "🟧 Enterprise",
      subtitle: "For organisations with complex requirements or high compliance volumes",
      description: "For organisations with complex requirements or high compliance volumes",
      price: "Custom",
      period: "pricing",
      features: [
        "Unlimited users",
        "Flexible document tiers",
        "Dedicated audit workspace",
        "Advanced reporting",
        "SSO & API access (Roadmap)",
        "Dedicated onboarding & training",
        "Custom service-level agreements",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Simple, Transparent <span className="text-accent">Pricing</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose a plan built for your organisation's compliance maturity.
            <br />
            No hidden fees. Every plan includes a personalised onboarding session.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {plans.map((plan, idx) => (
            <Card
              key={idx}
              className={`shadow-soft hover:shadow-strong transition-smooth relative ${
                plan.popular ? "border-accent border-2" : "border-2"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-accent text-accent-foreground px-4 py-1">{plan.subtitle}</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl mb-2">
                  {plan.name}
                  {!plan.popular && plan.subtitle && (
                    <span className="block text-sm font-normal text-muted-foreground mt-1">
                      {plan.subtitle}
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="mb-6">{plan.description}</CardDescription>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-muted-foreground ml-2">/{plan.period.split(" ")[1]}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{plan.period}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start">
                      <Check className="w-5 h-5 text-accent mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant={plan.popular ? "hero" : "default"}
                  size="lg"
                  className="w-full"
                  asChild
                >
                    <Link
                    href={
                        plan.name.includes("Starter")
                        ? planToUrl.starter
                        : plan.name.includes("Consultant")
                        ? planToUrl.consultant
                        : "/contact"
                    }
                    >
                    {plan.cta} <ArrowRight className="ml-2" />
                    </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Important Note */}
        <div className="max-w-4xl mx-auto mb-20 bg-muted/50 border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            ⚠️ Important Note
          </h3>
          <p className="text-muted-foreground">
            Some advanced features — such as API access, SSO, and full multi-client workspaces — are part of our upcoming roadmap.
            Early customers receive priority access and reduced enterprise onboarding fees.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Pricing FAQs</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Do you offer annual billing?</AccordionTrigger>
              <AccordionContent>
                Yes. Annual plans include a 10% discount.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I upgrade or downgrade plans?</AccordionTrigger>
              <AccordionContent>
                Absolutely. You can change plans anytime, with updates applied from the next billing cycle.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
              <AccordionContent>
                We accept major credit cards and bank transfers. Enterprise customers may request invoicing and purchase orders.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Is there a setup fee?</AccordionTrigger>
              <AccordionContent>
                No setup fees for Starter and Consultant plans. Enterprise onboarding and training fees may apply depending on requirements.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center gradient-hero text-primary-foreground rounded-lg p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Not sure which plan is right for you?</h2>
          <p className="text-lg mb-8 text-primary-foreground/90">
            Let's discuss your compliance workload and recommend the best option.
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link href="/contact">
              Book a Call <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
