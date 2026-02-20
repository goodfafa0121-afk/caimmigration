"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

type PlanDetail = {
  introTitle: string;
  intro: string;
  whoTitle: string;
  whoItems: string[];
  pathTitle: string;
  pathItems: string[];
  timelineTitle: string;
  timelineContent: string;
  processTitle: string;
  processSteps: string[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
  ctaTitle: string;
  ctaDesc: string;
  ctaButton: string;
};

export default function StudyPlanDetail({ slug }: { slug: string }) {
  const { t } = useLanguage();
  const s = t.studyPage;
  const planDetails = (s as unknown as { planDetails?: Record<string, PlanDetail> }).planDetails;
  const detail = planDetails?.[slug];
  const title =
    slug === "study-to-pr"
      ? s.plan1.name
      : slug === "master-undergrad"
        ? s.plan2.name
        : slug === "language-study-permit"
          ? s.plan3.name
          : slug === "elite-guaranteed"
            ? s.plan5.name
            : slug === "college-to-university"
              ? s.plan6.name
              : slug;

  if (!detail) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-600">暂无该方案详情</p>
          <Link href="/study" className="mt-4 inline-block text-brand font-medium hover:underline">
            ← 留学规划
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* 面包屑 */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 text-sm text-gray-500">
          <Link href="/" className="hover:text-brand">首页</Link>
          <span className="mx-2">/</span>
          <Link href="/study" className="hover:text-brand">{s.heroTitle}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{title}</span>
        </div>
      </section>

      {/* 标题区 */}
      <section className="py-8 sm:py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-brand">{title}</h1>
          <p className="mt-3 text-gray-600 max-w-3xl">
          {slug === "study-to-pr"
            ? s.plan1.desc
            : slug === "master-undergrad"
              ? s.plan2.desc
              : slug === "language-study-permit"
                ? s.plan3.desc
                : slug === "elite-guaranteed"
                  ? s.plan5.desc
                  : slug === "college-to-university"
                    ? s.plan6.desc
                    : ""}
        </p>
        </div>
      </section>

      {/* 模块 1：项目简介 */}
      <section className="py-10 sm:py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{detail.introTitle}</h2>
          <div className="mt-2 h-1 w-14 bg-brand rounded-sm" />
          <p className="mt-5 text-gray-700 leading-relaxed">{detail.intro}</p>
        </div>
      </section>

      {/* 模块 2：适用人群 */}
      <section className="py-10 sm:py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{detail.whoTitle}</h2>
          <div className="mt-2 h-1 w-14 bg-brand rounded-sm" />
          <ul className="mt-5 space-y-3">
            {detail.whoItems.map((item, i) => (
              <li key={i} className="flex gap-3 text-gray-700">
                <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-brand" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 模块 3：路径与阶段 */}
      <section className="py-10 sm:py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{detail.pathTitle}</h2>
          <div className="mt-2 h-1 w-14 bg-brand rounded-sm" />
          <ol className="mt-5 space-y-4">
            {detail.pathItems.map((item, i) => (
              <li key={i} className="flex gap-4">
                <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-medium text-white">
                  {i + 1}
                </span>
                <span className="pt-1 text-gray-700 leading-relaxed">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 模块 4：时间与费用 */}
      <section className="py-10 sm:py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{detail.timelineTitle}</h2>
          <div className="mt-2 h-1 w-14 bg-brand rounded-sm" />
          <p className="mt-5 text-gray-700 leading-relaxed">{detail.timelineContent}</p>
        </div>
      </section>

      {/* 模块 5：申请流程 */}
      <section className="py-10 sm:py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{detail.processTitle}</h2>
          <div className="mt-2 h-1 w-14 bg-brand rounded-sm" />
          <ol className="mt-5 space-y-4">
            {detail.processSteps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand/90 text-sm font-medium text-white">
                  {i + 1}
                </span>
                <span className="pt-1 text-gray-700 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 模块 6：常见问题 */}
      <section className="py-10 sm:py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{detail.faqTitle}</h2>
          <div className="mt-2 h-1 w-14 bg-brand rounded-sm" />
          <dl className="mt-5 space-y-5">
            {detail.faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 sm:p-5">
                <dt className="font-medium text-gray-900">{faq.q}</dt>
                <dd className="mt-2 text-gray-600 leading-relaxed">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 模块 7：CTA */}
      <section className="py-14 sm:py-18 bg-brand/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{detail.ctaTitle}</h2>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">{detail.ctaDesc}</p>
          <Link
            href="/#contact"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand px-8 py-3 text-sm font-medium text-white hover:bg-brand-dark transition"
          >
            {detail.ctaButton}
          </Link>
        </div>
      </section>
    </>
  );
}
