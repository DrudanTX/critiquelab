import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border/30 py-16">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <motion.div 
                className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <span className="text-accent font-display font-medium">C</span>
              </motion.div>
              <span className="font-display text-lg font-medium text-foreground">
                CritiqueLab
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A quiet space for deeper thinking. Refine your ideas at your own pace.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-display font-medium text-sm mb-4 text-foreground">
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-slow">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/autopsy" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-slow">
                  Argument Autopsy
                </Link>
              </li>
              <li>
                <Link to="/trust" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-slow">
                  Trust & Integrity
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-medium text-sm mb-4 text-foreground">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/trust" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-slow">
                  Academic Guidelines
                </Link>
              </li>
              <li>
                <Link to="/trust" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-slow">
                  Writing Tips
                </Link>
              </li>
              <li>
                <Link to="/trust" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-slow">
                  Best Practices
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-medium text-sm mb-4 text-foreground">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/trust" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-slow">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/trust" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-slow">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/trust" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-slow">
                  Academic Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground/70">
            © {new Date().getFullYear()} CritiqueLab. Think deeper.
          </p>
          <p className="text-sm text-muted-foreground/50 italic font-display">
            "Clarity builds over time."
          </p>
        </div>
      </div>
    </footer>
  );
}
