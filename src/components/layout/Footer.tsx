import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-display font-bold text-lg">C</span>
              </div>
              <span className="font-display text-xl font-semibold">
                CritiqueLab
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Adversarial AI that challenges your thinking. Because the best ideas survive scrutiny.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4 text-primary-foreground/90">
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/dashboard" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/trust" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  Trust & Integrity
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4 text-primary-foreground/90">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/trust" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  Academic Guidelines
                </Link>
              </li>
              <li>
                <Link to="/trust" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  Research Standards
                </Link>
              </li>
              <li>
                <Link to="/trust" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  Best Practices
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4 text-primary-foreground/90">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/trust" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/trust" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/trust" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  Academic Use Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} CritiqueLab. All rights reserved.
          </p>
          <p className="text-sm text-primary-foreground/50 italic font-display">
            "Prove Me Wrong."
          </p>
        </div>
      </div>
    </footer>
  );
}
