"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const caseKeys = ["case1", "case2", "case3", "case4", "case5", "case6", "case7", "case8"] as const;
const CARDS_PER_SLIDE = 2;
const slideCount = Math.ceil(caseKeys.length / CARDS_PER_SLIDE);
const AUTOPLAY_MS = 6000;

export default function Cases() {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);

  const goTo = useCallback((i: number) => {
    setIndex((prev) => {
      if (i < 0) return slideCount - 1;
      if (i >= slideCount) return 0;
      return i;
    });
  }, []);

  const next = useCallback(() => goTo(index + 1), [index, goTo]);

  useEffect(() => {
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [index, next]);

  return (
    <section id="cases" className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            {t.cases.title}
          </h2>
          <div className="mt-1.5 h-1 w-14 bg-brand rounded-sm mx-auto" />
          <p className="mt-4 text-gray-600">{t.cases.subtitle}</p>
        </div>

        <div className="mt-12 relative overflow-hidden">
          {/* 滑动轨道：大屏 2 个/屏，小屏 1 个/屏，整条一起滑动 */}
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              width: `${caseKeys.length * 50}%`,
              transform: `translateX(-${index * (100 / slideCount)}%)`,
            }}
          >
            {caseKeys.map((key) => {
              const c = t.cases[key];
              const tag = "tag" in c ? (c as { tag: string }).tag : "";
              const client = "client" in c ? (c as { client: string }).client : "";
              const initial = client ? client.slice(0, 1) : "";
              return (
                <div
                  key={key}
                  className="shrink-0 px-2 sm:px-3"
                  style={{ width: `${100 / caseKeys.length}%` }}
                >
                  <div className="group relative bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-brand/20 transition-shadow duration-200 h-full">
                    <span className="absolute top-5 right-5 text-4xl font-serif text-brand/20 leading-none select-none">
                      &quot;
                    </span>
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand font-semibold text-lg">
                        {initial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900">{client}</p>
                        {tag && (
                          <span className="inline-block mt-1 text-xs font-medium text-brand">
                            {tag}
                          </span>
                        )}
                        <p className="mt-1 font-medium text-gray-800">{c.name}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-600 leading-relaxed border-l-2 border-brand/30 pl-4 not-italic">
                      {c.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 左右箭头 */}
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 border border-gray-200 shadow-md flex items-center justify-center text-gray-600 hover:text-brand hover:border-brand/50 transition z-10"
            aria-label="上一个"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 border border-gray-200 shadow-md flex items-center justify-center text-gray-600 hover:text-brand hover:border-brand/50 transition z-10"
            aria-label="下一个"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* 指示点 */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: slideCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand/50 ${
                  index === i ? "w-6 bg-brand" : "w-2 bg-gray-300"
                }`}
                aria-label={`第 ${i + 1} 条`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
