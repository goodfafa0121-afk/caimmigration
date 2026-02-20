"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  const stats = [
    { value: "7", label: t.about.years, sub: t.about.experience },
    { value: "500+", label: t.about.clients },
    { value: "98%", label: t.about.success },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            {t.about.title}
          </h2>
          <div className="mt-1.5 h-1 w-14 bg-brand rounded-sm" />
        </div>
        <div className="mt-8 grid md:grid-cols-2 gap-10 items-start">
          <div>
            <p className="text-lg font-medium text-gray-800">
              {t.about.name}
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed whitespace-pre-line">
              {t.about.intro}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((item, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100"
              >
                <div className="text-2xl font-semibold text-brand">
                  {item.value}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {item.label}
                  {item.sub && (
                    <span className="block text-gray-500">{item.sub}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
