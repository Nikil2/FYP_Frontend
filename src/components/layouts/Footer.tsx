import { FOOTER_LINKS } from "@/content/landing/landing-page-content";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="layout-standard section-padding-standard">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground animation-standard"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* For Workers */}
          <div>
            <h3 className="font-bold text-lg mb-4">For Workers</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.forWorkers.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground animation-standard"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* For Customers */}
          <div>
            <h3 className="font-bold text-lg mb-4">For Customers</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.forCustomers.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground animation-standard"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground animation-standard"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 animation-standard flex items-center justify-center"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 animation-standard flex items-center justify-center"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 animation-standard flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 animation-standard flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            {/* Copyright */}
            <div className="text-primary-foreground/60 text-sm">
              © {new Date().getFullYear()} Mehnati. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
