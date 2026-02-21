"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

function FaqAccordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mt-10 space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={`rounded-xl border bg-white overflow-hidden transition ${
              isOpen ? "border-brand/40 shadow-md" : "border-gray-200"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-semibold text-gray-900 pr-2">{item.q}</span>
              <span
                className={`shrink-0 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            <div
              className={`grid transition-all duration-200 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 pt-0 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const DEFAULT_STUDY_HERO =
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920";

type StudyContentProps = { initialHeroImageUrl?: string };

export default function StudyContent({ initialHeroImageUrl }: StudyContentProps) {
  const { t } = useLanguage();
  const s = t.studyPage;
  const [partnerLogos, setPartnerLogos] = useState<string[]>([]);
  const [heroImageUrl, setHeroImageUrl] = useState<string | undefined>(initialHeroImageUrl);
  useEffect(() => {
    fetch("/api/site/partner-schools")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.logos)) setPartnerLogos(d.logos);
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (heroImageUrl !== undefined) return;
    fetch("/api/site/study-hero-image")
      .then((r) => r.json())
      .then((d) => setHeroImageUrl(d?.imageUrl ?? undefined))
      .catch(() => setHeroImageUrl(undefined));
  }, [heroImageUrl]);

  const heroBg = heroImageUrl && heroImageUrl.trim() ? heroImageUrl : DEFAULT_STUDY_HERO;

  return (
    <>
      {/* Hero - 与移民页一致的标题区高度与内边距 */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroBg})`,
          }}
        />
        <div className="absolute inset-0 bg-gray-900/60" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center text-white">
          <h1 className="text-3xl sm:text-5xl font-bold">{s.heroTitle}</h1>
          <p className="mt-4 text-xl text-white/90">{s.heroSubtitle}</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* 服务特色 */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="w-full">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center">
            {s.featuresTitle}
          </h2>
          <div className="mt-2 h-1 w-14 bg-brand rounded-sm mx-auto" />
          <div className="mt-10 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 sm:gap-y-12">
            {[
              { title: s.feature1.title, desc: s.feature1.desc },
              { title: s.feature2.title, desc: s.feature2.desc },
              { title: s.feature3.title, desc: s.feature3.desc },
              { title: s.feature4.title, desc: s.feature4.desc },
              { title: s.feature5.title, desc: s.feature5.desc },
              { title: s.feature6.title, desc: s.feature6.desc },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 sm:gap-5">
                <div className="shrink-0 h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-teal-50 flex items-center justify-center ring-2 ring-teal-100/80">
                  <span className="text-2xl sm:text-3xl font-bold text-brand/90">{i + 1}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 根据需求选择方案 */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="w-full">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center">
            {s.plansTitle}
          </h2>
          <div className="mt-2 h-1 w-14 bg-brand rounded-sm mx-auto" />
          <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[s.plan1, s.plan2, s.plan3, s.plan5, s.plan6].map((plan, i) => {
              const isTopRow = i < 3;
              const isLeft = i % 3 === 0;
              return (
                <div
                  key={i}
                  className="rounded-xl bg-white shadow-md overflow-hidden flex flex-col"
                >
                  <div className="relative">
                    <div
                      className={`py-4 px-5 text-center ${isTopRow ? "bg-brand/80" : "bg-brand"} rounded-t-xl`}
                    >
                      <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                    </div>
                    <div
                      className={`absolute w-6 h-6 rounded-full bg-white/30 ${isLeft ? "left-2 -top-1" : "right-2 -top-1"}`}
                      aria-hidden
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-sm text-gray-700 text-center">[{plan.range}]</p>
                    <p className="mt-3 text-sm text-gray-600 leading-relaxed flex-1">
                      {plan.desc}
                    </p>
                    <div className="mt-5">
                      <Link
                        href={
                          i === 0
                            ? "/study/plan/study-to-pr"
                            : i === 1
                              ? "/study/plan/master-undergrad"
                              : i === 2
                                ? "/study/plan/language-study-permit"
                                : i === 3
                                  ? "/study/plan/elite-guaranteed"
                                  : i === 4
                                    ? "/study/plan/college-to-university"
                                    : "/#contact"
                        }
                        className="w-full inline-flex justify-center rounded-lg bg-brand text-white px-4 py-2.5 text-sm font-medium hover:bg-brand-dark transition"
                      >
                        {s.ctaViewDetail}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 服务流程 - 图一样式：表格式 + 前期规划竖条 + 三方案勾选 */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="w-full overflow-x-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center">
            {s.processTitle}
          </h2>
          <div className="mt-2 h-1 w-14 bg-brand rounded-sm mx-auto" />
          <div className="mt-10 rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr>
                  <th colSpan={2} className="bg-brand py-4 px-4 sm:px-5 text-left text-white font-semibold">
                    {s.processTableCol}
                  </th>
                  <th className="bg-brand py-4 px-4 text-center text-white font-semibold border-l border-brand-light/30">
                    {s.processTablePlan1}
                  </th>
                  <th className="bg-brand py-4 px-4 text-center text-white font-semibold border-l border-brand-light/30">
                    {s.processTablePlan2}
                  </th>
                  <th className="bg-brand py-4 px-4 text-center text-white font-semibold border-l border-brand-light/30">
                    {s.processTablePlan3}
                  </th>
                </tr>
              </thead>
              <tbody>
                {s.processSteps.map((step, i) => (
                  <tr key={i}>
                    {i === 0 ? (
                      <td
                        rowSpan={s.processSteps.length}
                        className="w-px bg-brand/15 align-top border-r-2 border-brand py-4 px-3 text-center"
                      >
                        <span className="inline-block text-brand font-medium text-sm whitespace-nowrap py-2" style={{ writingMode: "vertical-rl" }}>
                          {s.processCategory}
                        </span>
                      </td>
                    ) : null}
                    <td
                      className={`border-b border-gray-100 py-4 px-4 sm:px-5 ${i % 2 === 0 ? "bg-teal-50/60" : "bg-white"}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-gray-400" aria-hidden />
                        <div>
                          <p className="font-medium text-gray-900">{step.title}</p>
                          <p className="mt-1 text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    </td>
                    {[0, 1, 2].map((planIdx) => (
                      <td
                        key={planIdx}
                        className="border-b border-l border-gray-100 py-4 px-4 text-center align-middle"
                      >
                        {s.processStepsIncluded[i][planIdx] ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand/10 text-brand font-bold" aria-hidden>✓</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 合作院校 */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="w-full">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center">
            {s.partnerTitle}
          </h2>
          <div className="mt-2 h-1 w-14 bg-brand rounded-sm mx-auto" />
          <p className="mt-4 text-gray-600 text-center max-w-2xl mx-auto">
            {s.partnerSubtitle}
          </p>
          <div className="mt-10 sm:mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
            {s.partnerSchools.map((school, i) => {
              const logoUrl = partnerLogos[i] || school.logo;
              return (
              <div
                key={i}
                className="flex flex-col items-center rounded-xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-brand/20 transition"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={school.name}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <span className="text-2xl sm:text-3xl font-bold text-brand/80">
                      {school.name.slice(0, 1)}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm font-medium text-gray-800 text-center leading-tight">
                  {school.name}
                </p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 常见问题 - 底部留白，不与 footer 直接相连 */}
      <section className="pt-16 sm:pt-20 pb-0 bg-gray-50">
        <div className="w-full max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center">
            {s.faqTitle}
          </h2>
          <div className="mt-2 h-1 w-14 bg-brand rounded-sm mx-auto" />
          <FaqAccordion
            items={[
              { q: s.faq1Q, a: s.faq1A },
              { q: s.faq2Q, a: s.faq2A },
            ]}
          />
          <div className="mt-10 text-center">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white hover:bg-brand-dark transition"
            >
              仍有疑问？咨询我们
            </Link>
          </div>
        </div>
        <div className="h-12 sm:h-16 bg-white" aria-hidden />
      </section>
      </div>
    </>
  );
}
