"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const keys = ["study", "masterUndergrad", "languageStudy", "visit", "elite", "collegeToUni"] as const;

const CARD_IMAGES = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800",
  "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=800",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800",
  "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800",
  "https://images.unsplash.com/photo-1551884170-09fb70a4a2ed?q=80&w=800",
];

type StudyVisaSectionProps = { initialImages?: string[] };

export default function StudyVisaSection({ initialImages = [] }: StudyVisaSectionProps) {
  const { t } = useLanguage();
  const [images, setImages] = useState<string[]>(() =>
    Array.isArray(initialImages) && initialImages.length >= 6 ? initialImages.slice(0, 6) : Array.from({ length: 6 }, (_, i) => initialImages[i] ?? "")
  );

  useEffect(() => {
    fetch("/api/site/study-services-images")
      .then((r) => r.json())
      .then((d) => setImages(Array.isArray(d?.images) ? d.images.slice(0, 6) : []))
      .catch(() => {});
  }, []);

  return (
    <section id="study-visa" className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-block text-left">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              {t.studyVisa.title}
            </h2>
            <div className="mt-1.5 h-1 w-14 bg-brand rounded-sm" />
          </div>
          <p className="mt-3 text-gray-600">{t.studyVisa.subtitle}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {keys.map((key, i) => {
            const item = t.studyVisa[key];
            const slug = (item as { slug?: string })?.slug;
            const href = slug ? `/study/plan/${slug}` : key === "visit" ? "/visa" : "/study";
            return (
              <Link
                key={key}
                href={href}
                className="group relative block aspect-[4/5] rounded-lg overflow-hidden"
              >
                <img
                  src={images[i] || CARD_IMAGES[i]}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition group-hover:scale-105"
                  loading={i < 3 ? "eager" : "lazy"}
                  decoding="async"
                  onError={(e) => {
                    if (e.currentTarget.src !== CARD_IMAGES[i]) e.currentTarget.src = CARD_IMAGES[i];
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <h3 className="font-semibold text-lg leading-tight">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-white/90 leading-snug line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/study"
            className="text-brand font-medium hover:underline inline-flex items-center gap-1"
          >
            {t.studyVisa.viewMore} &gt;
          </Link>
        </div>
      </div>
    </section>
  );
}
