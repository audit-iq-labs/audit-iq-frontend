import { FileText, CheckCircle, AlertTriangle, BarChart3, Users, Zap, Lock, RefreshCw, Building2, Cloud, ListChecks } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Features = () => {
  const coreFeatures = [
    {
      icon: FileText,
      title: "Obligation Extraction",
      description: "Automatically identify requirements, obligations, and responsibilities from regulatory documents, policies, and client material.",
      benefits: [
        "Extract obligations from APA 2024, Essential Eight, ISO 27001/31000, and internal policies",
        "NLP-based requirement detection and structuring",
        "Support for PDFs, Word documents, and web content",
        "Cross-reference detection to group related obligations",
        "Clear, export-ready obligation lists for client or internal use",
      ],
      status: "available",
    },
    {
      icon: CheckCircle,
      title: "Evidence Auto-Linking",
      description: "Connect extracted obligations with supporting evidence for streamlined compliance reporting.",
      benefits: [
        "Automated evidence organisation and mapping",
        "Categorisation by control domain, theme, or requirement",
        "Obligation-to-evidence mapping for audit preparation",
        "Exportable reports for clients, auditors, and internal teams",
      ],
      status: "available",
    },
    {
      icon: AlertTriangle,
      title: "Policy Gap Detection",
      description: "Identify potential gaps between organisational policies and regulatory expectations.",
      benefits: [
        "Compare two documents to highlight missing or weak areas",
        "Automated similarity and coverage analysis",
        "Consultant-friendly gap summaries",
        "Priority flags for areas requiring review",
        "(Recommendations can be enhanced by consultants — AI highlights, you decide.)",
      ],
      status: "available",
    },
    {
      icon: BarChart3,
      title: "Compliance Dashboard",
      description: "A consolidated view of your compliance posture with the essential insights needed to stay audit-ready.",
      benefits: [
        "Compliance metrics and requirement-level status",
        "Essential Eight readiness indicators",
        "Obligation tracking and progress visibility",
        "Clean exports for auditors, clients, and internal stakeholders",
      ],
      status: "available",
    },
  ];

  const roadmapFeatures = [
    {
      icon: Zap,
      title: "Obligation Relationship Graph",
      description: "Visual view of relationships between obligations, controls, and evidence to support impact analysis.",
      benefits: [
        "Relationship mapping for clarity",
        "High-level impact previews for regulatory changes",
        "Consultant-friendly visual pathways",
      ],
      status: "Planned – 2026",
    },
    {
      icon: RefreshCw,
      title: "Regulatory Change Monitoring",
      description: "Stay informed about updates to the frameworks you rely on.",
      benefits: [
        "Monitor APA 2024, Essential Eight, ISO updates",
        "Alerts when requirements change",
        "High-level impact summaries",
        "Suggestions for areas requiring reassessment",
      ],
      status: "Planned – 2026",
    },
    {
      icon: Users,
      title: "Vendor Risk Assessment Tools",
      description: "Lightweight tools for consultants and SMEs managing third-party compliance.",
      benefits: [
        "Vendor questionnaire templates",
        "Basic risk scoring",
        "Document collection and tracking",
        "Verification checklists",
      ],
      status: "Planned – Late 2026",
    },
    {
      icon: Lock,
      title: "Enhanced Access & Audit Controls",
      description: "Security and governance features for multi-team environments.",
      benefits: [
        "Role-based access",
        "Activity and audit logging",
        "Team collaboration controls",
      ],
      status: "Planned – Late 2026",
    },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Built for Australian SMEs and <span className="text-accent">Compliance Consultants</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto">
            Audit-IQ delivers practical, AI-powered capabilities that reduce manual compliance work, improve audit readiness, and support consultants delivering high-quality regulatory analysis. Designed for APA 2024, Essential Eight, ISO standards, and expanding European frameworks.
          </p>
        </div>

        {/* Core Capabilities - Available Now */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center">Core Capabilities</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {coreFeatures.map((feature, idx) => (
              <Card key={idx} className="shadow-soft border-2 hover:shadow-strong transition-smooth">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl mb-2">{feature.title}</CardTitle>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, bidx) => (
                      <li key={bidx} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-accent mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Roadmap Features */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center">Roadmap Features</h2>
          </div>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Planned Capabilities — developed based on customer priorities
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {roadmapFeatures.map((feature, idx) => (
              <Card key={idx} className="shadow-soft border-2 hover:shadow-strong transition-smooth opacity-90">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <Badge variant="outline">{feature.status}</Badge>
                  </div>
                  <CardTitle className="text-2xl mb-2">{feature.title}</CardTitle>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, bidx) => (
                      <li key={bidx} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-muted-foreground mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* See It In Action */}
        <div className="mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">See It In Action</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Key workflows supported today
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="rounded-lg border-2 bg-muted/30 p-8 aspect-video flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 text-accent mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">Obligation Extraction View</p>
                <p className="text-sm text-muted-foreground mt-2">Structured obligations, requirements, and summaries</p>
              </div>
            </div>
            <div className="rounded-lg border-2 bg-muted/30 p-8 aspect-video flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-accent mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">Compliance Dashboard View</p>
                <p className="text-sm text-muted-foreground mt-2">Status, evidence mapping, and exports</p>
              </div>
            </div>
          </div>
        </div>

        {/* Planned Integrations */}
        <div className="mt-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <h2 className="text-3xl md:text-4xl font-bold">Planned Integrations</h2>
          </div>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Roadmap — added based on customer demand. To ensure seamless adoption, Audit-IQ is planning targeted integrations with commonly-used tools:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "SharePoint", description: "Document import & evidence storage", icon: Building2 },
              { name: "Google Drive", description: "Source file ingestion", icon: Cloud },
              { name: "Jira", description: "Task tracking for remediation work", icon: ListChecks },
            ].map((tool) => (
              <Card key={tool.name} className="shadow-soft hover:shadow-strong transition-smooth opacity-90">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-lg bg-muted/50 mx-auto mb-4 flex items-center justify-center">
                    <tool.icon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="font-semibold text-lg mb-2">{tool.name}</p>
                  <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
                  <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
