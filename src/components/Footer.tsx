"use client";

import Link from "next/link";
import Logo from "@/components/ui/Logo";

const Footer = () => {
  return (
    <footer className="bg-white border-t py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="mb-8 md:mb-0">
            <Link href="/" className="flex items-center mb-4">
          
              <span className="ml-2 font-semibold">Animazh.com</span>
            </Link>
            <p className="text-sm text-gray-500">
              © 2025 Animazh.com, Inc. Të gjitha të drejtat e rezervuara.
            </p>
          </div>

         
        </div>

        <div className="flex justify-start text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600 mr-6">
            Politika e Privatësisë
          </Link>
          <Link href="/" className="hover:text-blue-600">
            Kushtet e Shërbimit
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
