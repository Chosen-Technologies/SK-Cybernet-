import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, Wifi } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-inner">
        <Image
          className="hero-product-image"
          src="/starlink-image.png"
          alt="Starlink satellite internet dish on its stand"
          width={1545}
          height={1999}
          priority
        />
        
        <div className="hero-copy">
          <h1 id="hero-title">
            Affordable Starlink internet access <span>for BUK students.</span>
          </h1>
          <p className="hero-description">
            Get online from a dedicated hubspace on campus. Choose an access
            pass, book the time you need, and connect through shared Starlink
            internet.
          </p>
          <div className="hero-actions">
            <Link className="hero-primary-action" href="/register">
              Book internet access <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <span className="hero-action-note">
              <CalendarDays size={16} aria-hidden="true" />
              Flexible access passes
            </span>
          </div>
          <div className="hero-proof">
            <span className="hero-proof-icon"><Wifi size={17} aria-hidden="true" /></span>
            <span><strong>One simple booking</strong><br />Hubspace and internet access together</span>
          </div>
        </div>

      </div>
    </section>
  );
}
