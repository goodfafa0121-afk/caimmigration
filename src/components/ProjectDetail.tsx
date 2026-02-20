"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

type Project = {
  type?: string;
  hot?: boolean;
  slug?: string;
  title: string;
  desc: string;
  period: string;
  investment?: string;
  identity: string;
  language: string;
  budget: string;
};

type Detail = {
  longDesc: string;
  processTitle: string;
  processSteps: string[];
  whoTitle: string;
  whoItems: string[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
};

export default function ProjectDetail({ slug }: { slug: string }) {
  const { t } = useLanguage();
  const projects = t.immigration.projects as unknown as Project[];
  const details = (t.immigration as unknown as { projectDetails?: Record<string, Detail> }).projectDetails;
  const project = projects.find((p) => p.slug === slug);
  const detail = details?.[slug];

  if (!project) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-600">{t.immigration.totalCount.replace("{count}", "0")}</p>
          <Link href="/immigration" className="mt-4 inline-block text-brand font-medium hover:underline">
            ← {t.immigration.title}
          </Link>
        </div>
      </section>
    );
  }

  const labels = t.immigration.labels;
  const investment = project.investment ?? "无";

  return (
    <>
      {/* 面包屑 */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 text-sm text-gray-500">
          <Link href="/" className="hover:text-brand">{t.immigration.breadcrumbHome}</Link>
          <span className="mx-2">/</span>
          <Link href="/immigration" className="hover:text-brand">{t.immigration.breadcrumbCurrent}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{project.title}</span>
        </div>
      </section>

      {/* 标题 + 标签 + 一句话描述 */}
      <section className="py-8 sm:py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {project.hot && (
              <span className="rounded bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                {t.immigration.hotTag}
              </span>
            )}
            <span className="rounded bg-gray-800 px-2 py-0.5 text-xs font-medium text-white">
              {t.immigration.countryTag}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-brand">{project.title}</h1>
          <p className="mt-3 text-gray-600 max-w-3xl">{project.desc}</p>
        </div>
      </section>

      {/* 关键指标卡片 */}
      <section className="py-6 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap gap-6 sm:gap-10 text-sm">
            <div>
              <span className="text-gray-500">{labels.period}</span>
              <span className="ml-2 font-medium text-gray-900">{project.period}</span>
            </div>
            <div>
              <span className="text-gray-500">{labels.investment}</span>
              <span className="ml-2 font-medium text-gray-900">{investment}</span>
            </div>
            <div>
              <span className="text-gray-500">{labels.identity}</span>
              <span className="ml-2 font-medium text-gray-900">{project.identity}</span>
            </div>
            <div>
              <span className="text-gray-500">{labels.language}</span>
              <span className="ml-2 font-medium text-gray-900">{project.language}</span>
            </div>
            {project.budget ? (
              <div>
                <span className="text-gray-500">{labels.budget}</span>
                <span className="ml-2 font-bold text-orange-500">{project.budget}</span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* 详细说明（若有 projectDetails） */}
      {detail && (
        <>
          <section className="py-10 sm:py-14 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <p className="text-gray-600 leading-relaxed max-w-3xl">{detail.longDesc}</p>
            </div>
          </section>

          <section className="py-10 sm:py-14 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{detail.processTitle}</h2>
              <ol className="space-y-4">
                {detail.processSteps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm font-medium">
                      {i + 1}
                    </span>
                    <p className="text-gray-600 leading-relaxed pt-0.5">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="py-10 sm:py-14 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{detail.whoTitle}</h2>
              <ul className="space-y-3 text-gray-600 leading-relaxed">
                {detail.whoItems.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-brand shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="py-10 sm:py-14 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{detail.faqTitle}</h2>
              <dl className="space-y-6">
                {detail.faqs.map((faq, i) => (
                  <div key={i}>
                    <dt className="font-medium text-gray-900">{faq.q}</dt>
                    <dd className="mt-2 text-gray-600 leading-relaxed">{faq.a}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-8 text-sm text-gray-500 border-t border-gray-200 pt-6">
                {(t.immigration as { officialDisclaimer?: string }).officialDisclaimer}
              </p>
            </div>
          </section>
        </>
      )}

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-brand/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-700 font-medium">{t.immigration.freePlanSubtitle}</p>
          <Link
            href="/#contact"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand text-white px-8 py-3 font-medium hover:bg-brand-dark transition"
          >
            {t.immigration.consultCta}
          </Link>
        </div>
      </section>
    </>
  );
}
