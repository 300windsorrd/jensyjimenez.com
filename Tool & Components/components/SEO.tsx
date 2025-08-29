"use client";

import { DefaultSeo } from "next-seo";
import { defaultSEO } from "@/next-seo.config";

export function SEO() {
  return <DefaultSeo {...defaultSEO} />;
}


