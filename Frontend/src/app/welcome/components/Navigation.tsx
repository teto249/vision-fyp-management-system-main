import Image from "next/image";
import Link from "next/link";

import ScrollLink from "./ScrollLink";

export default function Navigation() {
  return (
    <nav className="bg-gray-900 sticky top-0 z-50 shadow-xl mb-10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/logo.png"
            alt="Logo"
            width={50}
            height={50}
            className="rounded-full"
          />
          <span className="text-xl font-bold text-green-400">VISION</span>
        </Link>

        <div className="flex items-center space-x-6">
          <ScrollLink
            to="features"
            className="text-gray-300 hover:text-green-400 transition-colors"
          >
            Features
          </ScrollLink>
          <ScrollLink
            to="about"
            className="text-gray-300 hover:text-green-400 transition-colors"
          >
            About
          </ScrollLink>
          <ScrollLink
            to="value"
            className="text-gray-300 hover:text-green-400 transition-colors"
          >
            Value
          </ScrollLink>
          <Link href="/auth">
            <button className="bg-green-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-green-400 transition-colors">
              Log In
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
