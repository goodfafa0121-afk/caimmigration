"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

  const navItems = [
    { key: "immigration" as const, href: "/immigration" },
    { key: "study" as const, href: "/study" },
    { key: "visa" as const, href: "/visa" },
    { key: "enterprise" as const, href: "/enterprise" },
    { key: "aboutJiayou" as const, href: "/about" },
  ] as const;

type HeaderProps = { initialLogoUrl?: string | null };

export default function Header({ initialLogoUrl = null }: HeaderProps) {
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(() => initialLogoUrl ?? null);

  useEffect(() => {
    if (initialLogoUrl) {
      setLogoUrl(initialLogoUrl);
      return;
    }
    fetch("/api/site/settings")
      .then((r) => r.json())
      .then((d) => setLogoUrl(d.logoUrl ?? null))
      .catch(() => {});
  }, [initialLogoUrl]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      {/* 顶部热线条 - 加拿大热线 */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center h-10 text-sm text-gray-600">
          <div className="hidden sm:flex items-center">
            <span>{t.topBar.hotlineCa} <strong className="text-gray-900">1-236-866-0081</strong></span>
          </div>
        </div>
      </div>
      {/* 主导航 */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center shrink-0 overflow-visible" aria-label={t.about.name}>
          {logoUrl ? (
            <Image src={logoUrl} alt="" width={440} height={128} className="h-28 sm:h-32 w-auto object-contain" unoptimized />
          ) : null}
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className="text-gray-700 hover:text-brand transition text-sm font-medium"
            >
              {t.nav[key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white py-4 px-4">
          <nav className="flex flex-col gap-2">
            {navItems.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="text-gray-700 hover:text-brand py-2 font-medium"
              >
                {t.nav[key]}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
