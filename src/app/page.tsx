"use client";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ImageUploadForm from "@/components/ImageUploadForm";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <div className="py-8">
          <ImageUploadForm />
        </div>
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
