"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

/** 仅在前台页面显示主导航 Header，/admin 下不显示 */
export default function SiteHeader({ initialLogoUrl }: { initialLogoUrl: string | null }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <Header initialLogoUrl={initialLogoUrl} />;
}
