"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

type VisaDetailContent = {
  intro: string;
  processTitle: string;
  processSteps: string[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
  ctaTitle: string;
  ctaDesc: string;
  ctaButton: string;
};

type VisaListItem = {
  slug?: string;
  title: string;
  scope: string;
  entryCount: string;
  stayDuration: string;
  validity: string;
  processDays: string;
};

export default function VisaDetail({ slug }: { slug: string }) {
  const { t } = useLanguage();
  const v = t.visaPage;
  const visaDetails = (v as unknown as { visaDetails?: Record<string, VisaDetailContent> }).visaDetails;
  const detail = visaDetails?.[slug];
  const list = (v as unknown as { visaList?: VisaListItem[] }).visaList ?? [];
  const item = list.find((x) => x.slug === slug);

  if (!item || !detail) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-600">暂无该签证详情</p>
          <Link href="/visa" className="mt-4 inline-block text-brand font-medium hover:underline">
            ← 签证服务
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
          <Link href="/" className="hover:text-brand">
            {v.breadcrumbHome}
          </Link>
          <span className="mx-2">/</span>
          <Link href="/visa" className="hover:text-brand">
            {v.breadcrumbVisa}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">
            {item.title}+{item.scope}
          </span>
        </div>
      </section>

      {/* 标题区 */}
      <section className="py-8 sm:py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-brand">
            {item.title}+{item.scope}
          </h1>
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 text-sm">
            <div>
              <span className="text-gray-500">{v.labelEntry}</span>
              <p className="font-medium text-gray-800 mt-0.5">{item.entryCount}</p>
            </div>
            <div>
              <span className="text-gray-500">{v.labelStay}</span>
              <p className="font-medium text-gray-800 mt-0.5">{item.stayDuration}</p>
            </div>
            <div>
              <span className="text-gray-500">{v.labelValidity}</span>
              <p className="font-medium text-gray-800 mt-0.5">{item.validity}</p>
            </div>
            <div>
              <span className="text-gray-500">{v.labelProcess}</span>
              <p className="font-medium text-gray-800 mt-0.5">{item.processDays}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 简介 - 不展示价格 */}
      <section className="py-10 sm:py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-gray-700 leading-relaxed">{detail.intro}</p>
        </div>
      </section>

      {/* 办理流程 */}
      <section className="py-10 sm:py-12 bg-white">
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

      {/* 常见问题 */}
      <section className="py-10 sm:py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{detail.faqTitle}</h2>
          <div className="mt-2 h-1 w-14 bg-brand rounded-sm" />
          <dl className="mt-5 space-y-5">
            {detail.faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
                <dt className="font-medium text-gray-900">{faq.q}</dt>
                <dd className="mt-2 text-gray-600 leading-relaxed">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
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
