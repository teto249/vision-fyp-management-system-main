
import Image from "next/image";
import ScrollLink from "./ScrollLink";
import Link from "next/link";

export default function Footer() {
  return (
    <footer id="abut" className="bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
        {/* Logo Section */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Image
              src="/logo.png"
              alt="VISION Logo"
              width={50}
              height={50}
              className="rounded-full"
              priority
            />
            <span className="font-bold text-green-400">
              VISION
              <br />
              <span className="text-gray-300">FYP Management System</span>
            </span>
          </div>
          <p className="text-sm text-gray-400">Secure • Reliable • Accredited</p>
        </div>

        {/* Product Links */}
        <div>
          <h4 className="text-green-400 font-semibold mb-3">Product</h4>
          <ul className="space-y-2">
            <li>
              <ScrollLink 
                to="features" 
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                Features
              </ScrollLink>
            </li>
            <li>
              <ScrollLink 
                to="value" 
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                Value Proposition
              </ScrollLink>
            </li>
            <li>
              <Link 
                href="/pricing" 
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                Pricing
              </Link>
            </li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="text-green-400 font-semibold mb-3">Company</h4>
          <ul className="space-y-2">
            <li>
              <ScrollLink 
                to="about" 
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                About Us
              </ScrollLink>
            </li>
            <li>
              <Link 
                href="/blog" 
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h4 className="text-green-400 font-semibold mb-3">Legal</h4>
          <ul className="space-y-2">
            <li>
              <Link 
                href="/privacy" 
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link 
                href="/terms" 
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link 
                href="/gdpr" 
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                GDPR Compliance
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-600 text-center">
        <p className="text-gray-400 text-sm mb-2">
          © {new Date().getFullYear()} VISION FYP Management System. Developed for UTM Faculty of Computing
        </p>
        <p className="text-gray-400 text-sm">
          Developed by Altayeb Mustafa Ibrahim Abdelrasoul
        </p>
      </div>
    </footer>
  );
}