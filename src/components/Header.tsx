"use client";

import Link from "next/link";
import Logo from "@/components/ui/Logo";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="text-blue-600" />
            <span className="font-semibold">Animazh.com</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <div className="relative group">
         
          </div>
 {/*
          <div className="relative group">
            <button className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
              Magic Tools
            </button>
          </div>

          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600">
            Animazh.com 1.1
          </Link>

          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600">
            Generate
          </Link> */}

          {/* <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600">
            Pricing
          </Link> */}

          {/* <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600">
            Video Effects
          </Link> */}
        </nav>

        <div className="flex items-center space-x-2">
          {/* <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600 mr-2 hidden md:inline-block">
            Home
          </Link> */}
         
        </div>
      </div>
    </header>
  );
};

export default Header;
