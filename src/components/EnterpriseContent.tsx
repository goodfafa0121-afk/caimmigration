"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const DEFAULT_CONDITIONS_IMAGE = "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200";
const DEFAULT_TAX_IMAGE = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200";

type EnterpriseContentProps = {
  /** 加拿大企业服务申请条件 模块配图 */
  initialConditionsImageUrl?: string | null;
  /** 企业报税服务 模块配图 */
  initialTaxServiceImageUrl?: string | null;
};

export default function EnterpriseContent({
  initialConditionsImageUrl,
  initialTaxServiceImageUrl,
}: EnterpriseContentProps) {
  const { t } = useLanguage();
  const e = t.enterprisePage;
  const [conditionsImageUrl, setConditionsImageUrl] = useState<string | null>(
    initialConditionsImageUrl ?? null
  );
  const [taxServiceImageUrl, setTaxServiceImageUrl] = useState<string | null>(
    initialTaxServiceImageUrl ?? null
  );

  useEffect(() => {
    let cancelled = false;
    fetch("/api/site/enterprise-module-images")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d?.conditionsImageUrl != null) setConditionsImageUrl(d.conditionsImageUrl);
        if (d?.taxServiceImageUrl != null) setTaxServiceImageUrl(d.taxServiceImageUrl);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {/* 标题区 - 带背景图，与 Globevisa BC 注册公司页一致 */}
      <section className="relative pt-6 pb-10 sm:pt-8 sm:pb-14 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1920)",
          }}
        />
        <div className="absolute inset-0 bg-white/85" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 text-center">
            {e.title}
          </h1>
          <p className="mt-2 text-center text-gray-600 font-medium">
            {e.titleEn}
          </p>
          <p className="mt-6 text-gray-600 max-w-3xl mx-auto leading-relaxed text-center">
            {e.intro}
          </p>
        </div>
      </section>

      {/* 关键指标条 - 办理周期 / 服务类型 / 资产要求 */}
      <section className="py-6 border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-sm text-gray-500">{e.metricPeriod}</p>
              <p className="mt-1 font-semibold text-gray-900">{e.metricPeriodValue}</p>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-gray-200 pt-4 sm:pt-0 sm:pl-6">
              <p className="text-sm text-gray-500">{e.metricType}</p>
              <p className="mt-1 font-semibold text-gray-900">{e.metricTypeValue}</p>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-gray-200 pt-4 sm:pt-0 sm:pl-6">
              <p className="text-sm text-gray-500">{e.metricRequirement}</p>
              <p className="mt-1 font-semibold text-gray-900">{e.metricRequirementValue}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 申请条件 - 图二样式：左大图 + 右侧白底标题与编号列表 */}
      <section className="bg-white overflow-hidden pt-12 sm:pt-16">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row min-h-[420px]">
          <div
            className="lg:w-2/3 min-h-[280px] lg:min-h-0 bg-cover bg-center shrink-0"
            style={{
              backgroundImage: `url(${conditionsImageUrl?.trim() || DEFAULT_CONDITIONS_IMAGE})`,
            }}
          />
          <div className="lg:w-1/3 flex flex-col justify-center bg-white px-6 sm:px-8 py-10 lg:py-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              {e.conditionsTitle}
            </h2>
            <div className="mt-2 h-0.5 w-12 bg-gray-300" />
            <ul className="mt-6 space-y-4">
              {e.conditions.map((item, i) => (
                <li key={i} className="text-gray-700 text-sm leading-relaxed">
                  <span className="font-semibold text-gray-900">{i + 1}．</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 企业报税服务 - 左文字 + 右图（与申请条件模块左右对调） */}
      <section className="bg-white overflow-hidden pt-12 sm:pt-16">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row min-h-[420px]">
          <div className="lg:w-1/3 flex flex-col justify-center bg-white px-6 sm:px-8 py-10 lg:py-12 order-2 lg:order-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              {e.taxServiceTitle}
            </h2>
            <div className="mt-2 h-0.5 w-12 bg-gray-300" />
            <ul className="mt-6 space-y-4">
              {e.taxServiceItems.map((item, i) => (
                <li key={i} className="text-gray-700 text-sm leading-relaxed">
                  <span className="font-semibold text-gray-900">{i + 1}．</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div
            className="lg:w-2/3 min-h-[280px] lg:min-h-0 bg-cover bg-center shrink-0 order-1 lg:order-2"
            style={{
              backgroundImage: `url(${taxServiceImageUrl?.trim() || DEFAULT_TAX_IMAGE})`,
            }}
          />
        </div>
      </section>

      {/* 申请流程 - 图样式：深绿标题、卡片内步骤号+绿字标题+底部箭头 */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand text-center">
            {e.processTitle}
          </h2>
          <div className="mt-2 h-0.5 w-14 bg-brand rounded-sm mx-auto" />
          <p className="mt-3 text-sm text-gray-500 text-center italic">*{e.processNote}</p>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {e.processSteps.map((item, i) => (
              <div
                key={i}
                className="flex flex-col rounded-xl bg-white border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-brand/20 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="shrink-0 w-10 h-10 rounded-full bg-brand text-white text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <h3 className="text-base font-semibold text-brand">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 免费定制方案 - 参考 Globevisa */}
      <section className="py-16 sm:py-20 bg-brand/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              {e.customPlanTitle}
            </h2>
            <p className="mt-2 text-brand font-medium">{e.customPlanSubtitle}</p>
            <p className="mt-3 text-gray-600 text-sm leading-relaxed">{e.customPlanDesc}</p>
            <Link
              href="/#contact"
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-brand text-white px-8 py-3 font-medium hover:bg-brand-dark transition"
            >
              {e.customPlanCta}
            </Link>
          </div>
        </div>
      </section>

      {/* 为什么选择我们 */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center">
            {e.whyTitle}
          </h2>
          <div className="mt-2 h-1 w-14 bg-brand rounded-sm mx-auto" />
          <div className="mt-10 grid sm:grid-cols-3 gap-6">
            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6 hover:border-brand/20 hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-900">{e.why1Title}</h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{e.why1Desc}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6 hover:border-brand/20 hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-900">{e.why2Title}</h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{e.why2Desc}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6 hover:border-brand/20 hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-900">{e.why3Title}</h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{e.why3Desc}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
