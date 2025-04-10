"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
export default function Navigation() {
  const searchParams = useSearchParams();
  const url = searchParams.get("link");
  return (
    <nav className="bg-gray-900 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/logo.png"
            alt="Logo"
            width={50}
            height={50}
            className="rounded-full "
          />
          <span className="text-xl font-bold text-green-400">VISION</span>
        </Link>

        <div className="flex items-center space-x-6">
          <button className="text-gray-300 hover:text-green-400 transition-colors">
            Features
          </button>
          <button className="text-gray-300 hover:text-green-400 transition-colors">
            About
          </button>
          <Link href="/supervisor">
            <button className="text-gray-300 hover:text-green-400 transition-colors">
              Supervisor
            </button>
          </Link>
          <Link href="/Auth">
            <button className="bg-green-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-green-400 transition-colors">
              Log In
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
  
}
