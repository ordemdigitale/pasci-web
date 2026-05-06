"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GestionPTFRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/ptf");
  }, [router]);
  return null;
}
