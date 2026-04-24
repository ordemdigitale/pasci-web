"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function VisiteCounter() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/visites/stats`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.total != null) setTotal(d.total); })
      .catch(() => {});
  }, []);

  if (total === null) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-gray-400 text-xs">
      <Eye className="w-3.5 h-3.5" />
      <span>{total.toLocaleString("fr-FR")} visites</span>
    </span>
  );
}
