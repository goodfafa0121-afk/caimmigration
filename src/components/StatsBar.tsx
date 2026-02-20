"use client";

import { useLanguage } from "@/contexts/LanguageContext";

const keys = ["item1", "item2", "item3", "item4", "item5"] as const;

export default function StatsBar() {
  const { t } = useLanguage();

  return (
    <section className="bg-white py-12 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-y-8 sm:gap-y-0 sm:gap-x-0">
          {keys.map((key, i) => {
            const item = t.statsBar[key];
            const isLast = i === keys.length - 1;
            return (
              <div
                key={key}
                className={`flex flex-col items-center justify-center text-center py-4 sm:py-6 ${
                  !isLast ? "sm:border-r sm:border-gray-200" : ""
                }`}
              >
                <span className="text-3xl sm:text-4xl font-bold text-brand block">
                  {item.num}
                </span>
                <span className="mt-1.5 text-sm text-gray-600">{item.line1}</span>
                <span className="text-sm text-gray-600">{item.line2}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
