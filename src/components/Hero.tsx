"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const SLIDE_KEYS = ["slide1", "slide2", "slide3"] as const;
const AUTOPLAY_MS = 5500;

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1519832979-6fa011b87667?q=80&w=2070",
  "https://images.unsplash.com/photo-1523531294919-4fcd7e65e216?q=80&w=2070",
  "https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=80&w=2071",
];

type BannerItem = { image_url: string; title: string; subtitle: string; cta_text: string; cta_link?: string };

type HeroProps = { initialBanners?: BannerItem[] };

export default function Hero({ initialBanners = [] }: HeroProps) {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [banners, setBanners] = useState<BannerItem[]>(() =>
    Array.isArray(initialBanners) ? initialBanners : []
  );

  useEffect(() => {
    if (Array.isArray(initialBanners) && initialBanners.length > 0) return;
    fetch("/api/site/banners", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setBanners(Array.isArray(data.banners) ? data.banners : []))
      .catch(() => setBanners([]));
  }, [initialBanners]);

  const useBackend = banners.length > 0;
  const count = useBackend ? banners.length : SLIDE_KEYS.length;

  const goTo = useCallback((i: number) => {
    setIndex((prev) => {
      const next = i < 0 ? count - 1 : i >= count ? 0 : i;
      return next;
    });
  }, [count]);

  const next = useCallback(() => goTo(index + 1), [index, goTo]);

  useEffect(() => {
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [index, next]);

  const ctaHref = (link?: string) => (link && link.trim() ? link.trim() : "#contact");

  return (
    <section
      id="home"
      className="relative min-h-[56vh] overflow-hidden bg-[#1a2332] text-white pt-28 pb-14"
    >
      <div
        className="absolute inset-0 flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {useBackend
          ? banners.map((b, i) => {
              const bgUrl = (b.image_url && b.image_url.trim()) ? b.image_url.trim() : BG_IMAGES[i % BG_IMAGES.length];
              return (
              <div
                key={i}
                className="relative min-w-full flex items-center justify-center shrink-0"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${bgUrl.replace(/'/g, "%27")}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-[#1a2332]/55" />
                <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center mt-10">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance">
                    {b.title || " "}
                  </h1>
                  <p className="mt-4 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
                    {b.subtitle || " "}
                  </p>
                  <div className="mt-8">
                    <Link
                      href={ctaHref(b.cta_link)}
                      className="inline-flex items-center justify-center bg-brand hover:bg-brand-dark text-white font-medium px-6 py-3 rounded transition"
                    >
                      {b.cta_text || "免费评估"}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
          : SLIDE_KEYS.map((key, i) => {
              const slide = t.hero[key];
              if (!slide || typeof slide !== "object" || !("title" in slide)) {
                return null;
              }
              const s = slide as { title: string; subtitle: string; cta: string };
              return (
                <div
                  key={key}
                  className="relative min-w-full flex items-center justify-center shrink-0"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-30"
                    style={{ backgroundImage: `url('${BG_IMAGES[i]}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#1a2332]/80 to-[#1a2332]" />
                  <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center mt-10">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance">
                      {s.title}
                    </h1>
                    <p className="mt-4 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
                      {s.subtitle}
                    </p>
                    <div className="mt-8">
                      <Link
                        href="#contact"
                        className="inline-flex items-center justify-center bg-brand hover:bg-brand-dark text-white font-medium px-6 py-3 rounded transition"
                      >
                        {s.cta}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className="h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
            style={{
              width: index === i ? 24 : 8,
              backgroundColor: index === i ? "#fff" : "rgba(255,255,255,0.4)",
            }}
            aria-label={`切换到第 ${i + 1} 页`}
          />
        ))}
      </div>
    </section>
  );
}
