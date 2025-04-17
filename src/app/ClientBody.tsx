"use client";

import { useEffect } from "react";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased bg-gradient-to-b from-[#e0f2f1] to-white text-gray-800";
  }, []);

  return (
    <body className="antialiased bg-gradient-to-b from-[#e0f2f1] to-white text-gray-800" suppressHydrationWarning>
      {children}
    </body>
  );
}
