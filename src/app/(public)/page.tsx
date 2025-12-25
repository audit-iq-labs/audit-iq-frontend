// src/app/(public)/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Upload,
  Sparkles,
  FileCheck,
  Shield,
  FileText,
  BarChart3,
  GitCompare,
  Tags,
  FileOutput,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const supportedToday = [
  { name: "APA 2024", desc: "Australian Privacy Act" },
  { name: "Essential Eight", desc: "Australian Cybersecurity Baseline" },
  { name: "ISO 27001", desc: "Information Security" },
  { name: "ISO 31000", desc: "Risk Management" },
  { name: "AI Ethics Principles", desc: "Australian AI Ethics" },
];

const plannedExpansion = [
  { name: "GDPR", desc: "EU Data Protection" },
  { name: "NIS2", desc: "Network & Information Security" },
  { name: "EU AI Act", desc: "Artificial Intelligence Regulation" },
  { name: "ISO 42001", desc: "AI Management Systems" },
];

const powerfulFeatures = [
  {
    icon: FileText,
    title: "Obligation & Requirement Extraction",
    description:
      "Identify obligations, responsibilities, and requirements from any regulatory or policy document.",
  },
  {
    icon: FileCheck,
    title: "Policy & Framework Summaries",
    description:
      "Structured, digestible summaries for reviews, gap assessments, or client workshops.",
  },
  {
    icon: Tags,
    title: "Evidence Tagging & Organisation",
    description:
      "Attach evidence to extracted obligations for clean audit preparation.",
  },
  {
    icon: GitCompare,
    title: "Gap & Overlap Identification",
    description:
      "Compare documents to detect missing controls, overlaps, or changes across versions.",
  },
  {
    icon: BarChart3,
    title: "Obligation Classification",
    description:
      "Automatically group obligations by category, topic, risk domain, or regulatory theme.",
  },
  {
    icon: FileOutput,
    title: "Structured Export (PDF / Excel)",
    description:
      "Share professional, audit-ready outputs with teams, clients, or auditors.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden py-20 md:py-28 border-b">
        {/* Background image wash (matches Lovable intent) */}
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/assets/hero-image.jpg"
            alt=""
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-wrap justify-center gap-2 mb-5">
              <Badge variant="secondary">Australia-first</Badge>
              <Badge variant="secondary">Consultant-ready</Badge>
              <Badge variant="secondary">Audit-ready outputs</Badge>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              AI-powered compliance intelligence for Australian businesses and
              consultants
            </h1>

            <p className="text-lg md:text-xl mb-4 text-muted-foreground">
              Turn complex regulations into clear, structured, audit-ready
              obligations — with accuracy, consistency, and speed.
            </p>

            <p className="text-base md:text-lg mb-8 text-muted-foreground">
              Built for SMEs, consulting firms, and regulated teams working
              across APA 2024, Essential Eight, ISO standards and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="default" className="px-6 py-5 text-base" asChild>
                <Link href="/contact">
                  Request Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button variant="outline" size="default" className="px-6 py-5 text-base" asChild>
                <Link href="/features">Explore Features</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              How Audit-IQ Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three steps to transform your compliance workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:shadow-md transition">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  1. Upload Regulatory Material
                </h3>
                <p className="text-muted-foreground">
                  Securely upload regulatory frameworks, internal policies,
                  client documents, or operational guidelines.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-md transition">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  2. AI-Driven Extraction & Structuring
                </h3>
                <p className="text-muted-foreground">
                  Audit-IQ identifies obligations, requirements,
                  responsibilities, and summaries — producing structured,
                  traceable outputs from long documents.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-md transition">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  3. Review, Prioritise & Export
                </h3>
                <p className="text-muted-foreground">
                  Quickly review obligations, tag evidence, identify gaps, and
                  export clean reports for audits, implementations, or client
                  presentations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* REGULATIONS */}
      <section className="py-16 md:py-20 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Regulations We Support
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Australia-focused, with European frameworks planned for expansion.
            </p>
          </div>

          {/* Supported Today */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8">
              Supported Today
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {supportedToday.map((r) => (
                <Card key={r.name} className="hover:shadow-md transition">
                  <CardContent className="p-6 text-center">
                    <Shield className="w-10 h-10 mx-auto mb-3" />
                    <h4 className="font-bold text-lg mb-1">{r.name}</h4>
                    <p className="text-sm text-muted-foreground">{r.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Planned Expansion */}
          <div>
            <h3 className="text-2xl font-bold text-center mb-8">
              Planned Expansion — 2025–26
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {plannedExpansion.map((r) => (
                <Card
                  key={r.name}
                  className="opacity-75 hover:opacity-100 transition"
                >
                  <CardContent className="p-6 text-center">
                    <Shield className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                    <h4 className="font-bold text-lg mb-1">{r.name}</h4>
                    <p className="text-sm text-muted-foreground">{r.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* POWERFUL FEATURES + FAQ */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              MVP-ready capabilities designed for accuracy & auditability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {powerfulFeatures.map((f, idx) => {
              const Icon = f.icon;
              return (
                <Card key={idx} className="border-2 hover:shadow-md transition">
                  <CardContent className="p-8">
                    <Icon className="w-10 h-10 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                    <p className="text-muted-foreground">{f.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* FAQ */}
          <div className="text-center mt-16 mb-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get answers to common questions about Audit-IQ.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  How does Audit-IQ handle data security?
                </AccordionTrigger>
                <AccordionContent>
                  All data is processed and stored securely with encryption in
                  transit and at rest. No customer documents are used for model
                  training.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  Where is my data stored?
                </AccordionTrigger>
                <AccordionContent>
                  Data is stored in compliant cloud infrastructure with
                  Australian data residency.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  Which regulations does Audit-IQ support today?
                </AccordionTrigger>
                <AccordionContent>
                  APA 2024, Essential Eight, ISO 27001, ISO 31000, and AI Ethics
                  Principles. European frameworks are planned.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  How accurate is the extraction?
                </AccordionTrigger>
                <AccordionContent>
                  Outputs are AI-assisted and require human review. Audit-IQ
                  speeds workflows, but final compliance interpretation remains
                  with your team.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">
                  Do you store my documents?
                </AccordionTrigger>
                <AccordionContent>
                  Documents are retained only for processing and review.
                  Customers can request deletion at any time.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 border-t bg-muted/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Accelerate compliance work. Reduce manual effort. Deliver audit-ready
            insights faster.
          </h2>
          <p className="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
            Join Australian SMEs, consultants, and teams modernising their
            compliance workflows with AI-driven structure and clarity.
          </p>
          <Button size="default" className="px-6 py-5 text-base" asChild>
            <Link href="/contact">
              Request Demo <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
