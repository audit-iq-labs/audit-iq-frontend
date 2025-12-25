import { Target, Users, Award, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Precision",
      description: "Compliance demands accuracy. We ensure our outputs meet enterprise-grade standards for clarity and correctness.",
    },
    {
      icon: Users,
      title: "Partnership",
      description: "We work closely with customers, advisors, and consultants to shape features around real-world workflows.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We are committed to building a secure, high-quality platform that organisations can trust for critical regulatory operations.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We continuously advance our capabilities — blending AI, automation, and engineering to keep customers ahead of regulatory change.",
    },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="text-accent">Audit-IQ</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Audit-IQ is building the next generation of intelligent compliance automation — enabling organisations to interpret complex regulations with accuracy, speed, and confidence.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mt-4">
            Our platform transforms lengthy regulatory documents into structured, audit-ready insights, helping teams reduce manual effort and strengthen their overall compliance posture.
          </p>
        </div>

        {/* Mission Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <Card className="shadow-soft border-2">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6 font-semibold">
                Our mission is simple: turn regulatory complexity into clarity and action.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Today, organisations spend enormous effort reading regulations, mapping obligations, tracking evidence, and responding to audits. These tasks are critical, but overwhelmingly manual.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Audit-IQ applies advanced AI to:
              </p>
              <ul className="space-y-3 mb-6 text-lg text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-accent mr-3">•</span>
                  Extract obligations and requirements from complex laws and standards
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-3">•</span>
                  Reduce time spent interpreting large regulatory documents
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-3">•</span>
                  Organise and map evidence to the right controls
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-3">•</span>
                  Provide clear visibility into compliance status and gaps
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-3">•</span>
                  Enable teams to operate with confidence and accuracy
                </li>
              </ul>
              <p className="text-lg text-muted-foreground leading-relaxed text-center font-medium">
                Our goal is to make compliance faster, more reliable, and significantly more cost-efficient.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Our Story</h2>
          <Card className="shadow-soft border-2">
            <CardContent className="p-12">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Audit-IQ was created after observing a universal challenge across organisations of all sizes:
              </p>
              <blockquote className="border-l-4 border-accent pl-6 py-4 mb-6 text-lg text-muted-foreground italic">
                "Compliance processes were highly manual, reactive, and dependent on fragmented information — making it difficult for teams to operate strategically."
              </blockquote>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                We built Audit-IQ to close this gap by combining deep compliance expertise with modern AI automation. The result is a platform that delivers clarity, speed, and confidence in navigating complex regulatory obligations.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, idx) => (
              <Card key={idx} className="shadow-soft border-2 hover:shadow-strong transition-smooth text-center">
                <CardContent className="p-8">
                  <value.icon className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Team</h2>
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-soft border-2">
              <CardContent className="p-12">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Audit-IQ is led by product and compliance specialists with extensive experience in:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-base text-muted-foreground mb-6">
                  <li className="flex items-start">
                    <span className="text-accent mr-2">✓</span> Compliance workflows
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">✓</span> AI-powered automation
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">✓</span> Regulatory documentation
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">✓</span> Data governance
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">✓</span> Enterprise product design
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">✓</span> Risk and control frameworks
                  </li>
                </ul>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Our team has delivered large-scale regulatory and technology initiatives, designed automation solutions for compliance functions, and contributed to enterprise-level data governance programs.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed italic font-medium text-center">
                  Audit-IQ represents the next phase of combining deep domain expertise with modern AI tooling to simplify compliance for organisations globally.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="gradient-hero text-primary-foreground rounded-lg p-12">
          <h2 className="text-3xl font-bold text-center mb-12">Audit-IQ Today</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">10+</div>
              <div className="text-primary-foreground/90 font-medium mb-2">Regulatory and industry frameworks studied</div>
              <p className="text-sm text-primary-foreground/70 mt-2">
                Including GDPR, NIS2, AI Act, ISO, Australia's Privacy Act, and more
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">100+</div>
              <div className="text-primary-foreground/90 font-medium mb-2">Real regulatory documents analysed</div>
              <p className="text-sm text-primary-foreground/70 mt-2">
                During development to build accurate extraction and mapping capabilities
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">Built for</div>
              <div className="text-primary-foreground/90 font-medium mb-2">SMEs, consultants, advisory firms, and regulated industries</div>
              <p className="text-sm text-primary-foreground/70 mt-2">
                Scalable from growing businesses to enterprise compliance teams
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
