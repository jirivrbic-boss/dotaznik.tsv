"use client";

import { useEffect } from "react";
import { initAnalytics } from "@/lib/firebase";

export function ClientAnalytics() {
  useEffect(() => {
    void initAnalytics();
  }, []);
  return null;
}
