import Link from "next/link";
import { ArrowUpRight, Wifi } from "lucide-react";

const services = [
  { label: "Hub access", href: "#hub-access" },
  { label: "Flexible passes", href: "#passes" },
  { label: "Workspace Wi-Fi", href: "#wifi" },
];

export default function SiteNav() {
  return (
    <header className="site-nav-wrap">
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="site-brand" href="/" aria-label="SK Cybernet home">
          <span className="site-brand-mark" aria-hidden="true">
            <Wifi size={18} strokeWidth={2.4} />
          </span>
          <span>SK <strong>CYBERNET</strong></span>
        </Link>

        <div className="site-nav-links">
          {services.map((service) => (
            <Link key={service.href} href={service.href}>
              {service.label}
            </Link>
          ))}
        </div>

        <Link className="site-nav-cta" href="/register">
          Get started
          <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden="true" />
        </Link>
      </nav>
    </header>
  );
}
