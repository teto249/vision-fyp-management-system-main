"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
export default function Navigation() {
  const searchParams = useSearchParams();
  const url = searchParams.get("link");
  return (
    <nav className=" shadow-2xs pl-4 pr-4 sticky top-0 z-50">
      <div className=" bg-gray-800 text-gray-100 rounded-br-xl rounded-bl-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={50}
              height={50}
              className="rounded-full"
            />

            <span className="text-xl font-bold text-gray-800">VISION</span>
          </Link>

          <div className="flex items-center space-x-4 ">
            <button className="underline decoration-[#000000] font-bold underline-offset-4  hover:text-gray-600">
              Features
            </button>
            <button className=" underline decoration-[#000000] font-bold underline-offset-4  hover:text-gray-600">
              About
            </button>

            <Link href="/supervisor">
              <button className=" underline decoration-[#000000] font-bold underline-offset-4  hover:text-gray-600">
                supervisor
              </button>
            </Link>
            {url === "/Auth" ? (
              <Link href="/">
                <button className=" underline decoration-[#000000] font-bold underline-offset-4  hover:text-gray-600">
                  back
                </button>
              </Link>
            ) : (
              <Link href="/Auth">
                <button className=" text-white px-6 py-2 rounded-lg hover:text-black border-2 hover:bg-[#d3d5d63f] transition-colors">
                  Log In
                </button>
              </Link>
            )}

            <button className="bg-[#4A154B] text-white px-6 py-2 rounded-lg hover:text-black border-2  hover:bg-[#d3d5d63f] transition-colors">
              Join Us
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
