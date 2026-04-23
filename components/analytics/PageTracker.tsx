"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Ne pas compter les pages admin
    if (pathname.startsWith("/admin")) return;

    fetch(`${API_BASE}/api/v1/visites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
