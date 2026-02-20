"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const CARD_IMAGES = [
  "https://images.unsplash.com/photo-1519832979-6fa011b87667?q=80&w=600",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600",
  "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600",
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=600",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600",
];

type VisaItem = {
  slug?: string;
  title: string;
  scope: string;
  priceRmb: string;
  priceCad: string;
};

type VisaServicesSectionProps = { initialImages?: string[] };

export default function VisaServicesSection({ initialImages = [] }: VisaServicesSectionProps) {
  const { t } = useLanguage();
  const list = ((t.visaPage as unknown as { visaList?: VisaItem[] }).visaList ?? []).slice(0, 4);
  const [images, setImages] = useState<string[]>(() =>
    Array.isArray(initialImages) && initialImages.length >= 4 ? initialImages.slice(0, 4) : Array.from({ length: 4 }, (_, i) => initialImages[i] ?? "")
  );

  useEffect(() => {
    fetch("/api/site/visa-services-images")
      .then((r) => r.json())
      .then((d) => setImages(Array.isArray(d?.images) ? d.images.slice(0, 4) : []))
      .catch(() => {});
  }, []);

  return (
    <section id="visa-services" className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-block text-left">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              {t.visaServices.title}
            </h2>
            <div className="mt-1.5 h-1 w-14 bg-brand rounded-sm" />
          </div>
          <p className="mt-3 text-gray-600">{t.visaServices.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map((item, i) => {
            const href = item.slug ? `/visa/${item.slug}` : "/visa";
            return (
              <Link
                key={i}
                href={href}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-brand/20 transition block"
              >
                <div className="relative aspect-[4/3] w-full bg-gray-100">
                  <span className="absolute top-3 left-3 z-10 bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded">
                    {t.visaServices.countryTag}
                  </span>
                  <img
                    src={images[i] || CARD_IMAGES[i % CARD_IMAGES.length]}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      const fallback = CARD_IMAGES[i % CARD_IMAGES.length];
                      if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
                    }}
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm text-gray-700 leading-snug line-clamp-2">
                    {item.title}+{item.scope}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/visa"
            className="text-gray-600 hover:text-brand font-medium inline-flex items-center gap-1 transition"
          >
            {t.visaServices.viewAll} &gt;
          </Link>
        </div>
      </div>
    </section>
  );
}
