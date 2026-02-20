"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FamilyContent() {
  const { t } = useLanguage();
  const p = t.familyPage;
  const programs = p.programs;

  return (
    <>
      {/* 标题区 - 带背景 */}
      <section className="relative pt-6 pb-10 sm:pt-8 sm:pb-14 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1920)",
          }}
        />
        <div className="absolute inset-0 bg-white/80" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900">
            {p.title}
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            {p.subtitle}
          </p>
        </div>
      </section>

      {/* 简介 */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-center">
            {p.intro}
          </p>
        </div>
      </section>

      {/* 项目卡片 */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {programs.map((program, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-brand/30 hover:shadow-md transition-all duration-200"
              >
                <div className="p-6">
                  <span className="inline-block rounded-full bg-brand/10 text-brand text-xs font-medium px-2.5 py-0.5 mb-3">
                    {program.tag}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {program.title}
                  </h3>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    {program.desc}
                  </p>
                  <p className="mt-4 text-sm text-gray-500">
                    <span className="font-medium text-gray-700">{program.period}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-brand/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              {p.ctaTitle}
            </h2>
            <p className="mt-3 text-gray-600 text-sm">
              {p.ctaDesc}
            </p>
            <Link
              href="/#contact"
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-brand text-white px-8 py-3 font-medium hover:bg-brand-dark transition"
            >
              {p.ctaButton}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
