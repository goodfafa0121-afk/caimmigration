"use client";

import { useLanguage } from "@/contexts/LanguageContext";

const keys = ["licensed", "custom", "transparent", "followUp"] as const;

const ICONS = [
  <path key="shield" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
  <path key="custom" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
  <path key="chat" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
  <path key="path" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
];

export default function WhyUs() {
  const { t } = useLanguage();

  return (
    <section id="why-us" className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            {t.whyUs.title}
          </h2>
          <div className="mt-1.5 h-1 w-14 bg-brand rounded-sm mx-auto" />
          <p className="mt-4 text-gray-600">
            {t.whyUs.subtitle}
          </p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 gap-6">
          {keys.map((key, i) => {
            const item = t.whyUs[key];
            return (
              <div
                key={key}
                className="group relative bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-brand/30 transition-all duration-200"
              >
                <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r bg-brand opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      {ICONS[i]}
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
