"use client";

import { createContext, useContext } from "react";
import { type Site, site as staticSite } from "@/lib/site";

/**
 * Makes admin-edited settings (contact, socials…) available to client
 * components. Server components read getSiteSettings() directly; this bridges
 * the same values into the client tree. Defaults to the static site so anything
 * outside the provider still renders.
 */
const SiteContext = createContext<Site>(staticSite);

export function SiteProvider({
  value,
  children,
}: {
  value: Site;
  children: React.ReactNode;
}) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
