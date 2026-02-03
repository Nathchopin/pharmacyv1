import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-secondary border-t border-border">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-serif text-2xl font-semibold tracking-tight">
                Pharmacy
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Expert healthcare without the wait. GPhC registered digital pharmacy.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/weight-loss"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Weight Management
                </Link>
              </li>
              <li>
                <Link
                  to="/blood-tests"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Blood Tests
                </Link>
              </li>
              <li>
                <Link
                  to="/pharmacy-first"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pharmacy First
                </Link>
              </li>
              <li>
                <Link
                  to="/hair"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Hair Loss
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Help & FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/complaints"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Complaints
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Regulatory Block */}
      <div className="border-t border-border">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-muted-foreground">
            <div className="space-y-1">
              <p className="font-medium text-foreground">
                Registered Pharmacy: DeepFlow Health Ltd.
              </p>
              <p>Superintendent Pharmacist: Nathanaël (GPhC: 2049182)</p>
              <p>123 High Street, London, W1 4AA</p>
            </div>
            <p>© {new Date().getFullYear()} Pharmacy. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
