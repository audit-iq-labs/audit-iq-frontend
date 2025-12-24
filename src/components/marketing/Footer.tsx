import Image from "next/image";
import Link from "next/link";
import { Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <Image
                src="/assets/audit-iq-logo-vertical.png"
                alt="Audit-IQ RegTech"
                width={180}
                height={180}
                className="h-24 w-auto"
              />
            </div>

            <p className="text-sm text-muted-foreground">
              AI-powered compliance intelligence for SMEs, consultants, and regulated teams.
            </p>

            <div className="mt-4 space-y-2">
              <a
                href="mailto:founder@audit-iq.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth"
              >
                <Mail size={16} />
                founder@audit-iq.com
              </a>

              <p className="text-sm text-muted-foreground">📞 +91-9884991468</p>

              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth"
              >
                <Linkedin size={16} />
                LinkedIn
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  About
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  Security
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Get Started</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  Request Demo
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  Sign up
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t text-sm text-muted-foreground flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Audit-IQ. All rights reserved.</span>
          <span>Built for Australia-first compliance workflows.</span>
        </div>
      </div>
    </footer>
  );
}
