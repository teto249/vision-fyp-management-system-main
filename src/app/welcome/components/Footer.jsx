import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-12 border-t border-gray-600">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
        {/* Logo Section */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Image
              src="/logo.png"
              alt="Logo"
              width={50}
              height={50}
              className="rounded-full"
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
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                Security
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                Pricing
              </a>
            </li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="text-green-400 font-semibold mb-3">Company</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h4 className="text-green-400 font-semibold mb-3">Legal</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                Terms
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                GDPR
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-600 text-center">
        <p className="text-gray-400 text-sm mb-2">
          © 2024 VISION FYP Management System. Developed for UTM Faculty of Computing
        </p>
        <p className="text-gray-400 text-sm">
          Developed by Altayeb Mustafa Ibrahim Abdelrasoul
        </p>
      </div>
    </footer>
  );
}