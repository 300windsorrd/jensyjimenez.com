"use client";

import Script from "next/script";
import { site } from "@/site.config";

export function Analytics() {
  if (site.analytics?.provider !== "plausible") return null;
  // Note: replace example.org with real domain when available
  return (
    <Script
      defer
      data-domain="example.org"
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}


