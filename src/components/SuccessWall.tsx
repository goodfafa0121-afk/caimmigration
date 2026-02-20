"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const CheckIcon = () => (
  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

type SuccessWallProps = { initialImages?: string[] };

export default function SuccessWall({ initialImages = [] }: SuccessWallProps) {
  const { t } = useLanguage();
  const [images, setImages] = useState<string[]>(() =>
    Array.isArray(initialImages) && initialImages.length >= 10 ? initialImages.slice(0, 10) : Array.from({ length: 10 }, (_, i) => initialImages[i] ?? "")
  );
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetch("/api/site/success-wall-images")
      .then((r) => r.json())
      .then((d) => setImages(Array.isArray(d?.images) ? d.images.slice(0, 10) : []))
      .catch(() => {});
  }, []);

  const showIcon = (i: number) => !images[i] || failed[i];

  return (
    <section id="success-wall" className="min-h-screen flex flex-col justify-center py-10 sm:py-14 bg-brand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">
            {t.successWall.title}
          </h2>
          <p className="mt-1 text-gray-400 text-xs sm:text-sm">
            {t.successWall.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {images.map((_, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden shadow-lg transition hover:shadow-xl bg-white"
            >
              <div className="relative w-full aspect-[3/4] min-h-[140px] sm:min-h-[180px] bg-brand/10 flex items-center justify-center overflow-hidden">
                {showIcon(i) ? (
                  <CheckIcon />
                ) : (
                  <img
                    src={images[i]}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    onError={() => setFailed((prev) => ({ ...prev, [i]: true }))}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
