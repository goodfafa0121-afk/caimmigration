"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

type VisaListItem = {
  slug?: string;
  title: string;
  scope: string;
  entryCount: string;
  stayDuration: string;
  validity: string;
  processDays: string;
  priceRmb?: string;
  priceCad?: string;
};

const VISA_CARD_IMAGES = [
  "https://images.unsplash.com/photo-1519832979-6fa011b87667?q=80&w=600",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600",
  "https://images.unsplash.com/photo-1533577116850-9b2c2e2c7892?q=80&w=600",
  "https://images.unsplash.com/photo-1523531294919-4fcd7e65e216?q=80&w=600",
];

const DEFAULT_VISA_HERO = "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1920";

type VisaContentProps = {
  initialHeroImageUrl?: string;
  /** 推荐签证 6 张卡片图（与首页「推荐签证服务」共用后台上传，第 5、6 张为超级签证、毕业工签） */
  initialCardImages?: string[];
};

const CARD_IMAGE_COUNT = 6;

export default function VisaContent({ initialHeroImageUrl, initialCardImages = [] }: VisaContentProps) {
  const { t } = useLanguage();
  const v = t.visaPage;
  const visaList = (v.visaList ?? []) as unknown as VisaListItem[];
  const [heroImageUrl, setHeroImageUrl] = useState<string | undefined>(initialHeroImageUrl);
  const [cardImages, setCardImages] = useState<string[]>(() =>
    Array.isArray(initialCardImages) && initialCardImages.length >= CARD_IMAGE_COUNT ? initialCardImages.slice(0, CARD_IMAGE_COUNT) : []
  );

  useEffect(() => {
    if (heroImageUrl !== undefined) return;
    fetch("/api/site/visa-hero-image")
      .then((r) => r.json())
      .then((d) => setHeroImageUrl(d?.imageUrl ?? null))
      .catch(() => setHeroImageUrl(null));
  }, [heroImageUrl]);

  useEffect(() => {
    if (cardImages.length > 0) return;
    fetch("/api/site/visa-services-images")
      .then((r) => r.json())
      .then((d) => setCardImages(Array.isArray(d?.images) ? d.images.slice(0, CARD_IMAGE_COUNT) : []))
      .catch(() => setCardImages([]));
  }, [cardImages.length]);

  const heroBg = heroImageUrl && heroImageUrl.trim() ? heroImageUrl : DEFAULT_VISA_HERO;
  const cardImageFor = (i: number) =>
    (cardImages[i] && cardImages[i].trim()) ? cardImages[i] : VISA_CARD_IMAGES[i % VISA_CARD_IMAGES.length];

  return (
    <>
      {/* 标题区 */}
      <section className="relative pt-6 pb-10 sm:pt-8 sm:pb-14 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroBg})`,
          }}
        />
        <div className="absolute inset-0 bg-white/85" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 text-center">
            {v.title}
          </h1>
          <p className="mt-2 text-center text-gray-600 font-medium">{v.titleEn}</p>
          <p className="mt-6 text-gray-600 max-w-3xl mx-auto leading-relaxed text-center">
            {v.intro}
          </p>
        </div>
      </section>

      {/* 推荐签证 - 加桥风格：卡片列表 + 入境次数/停留时长/有效期/办理时长 + 价格 + 查看详情 */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              {v.recommendedTitle}
            </h2>
            <Link
              href="/#contact"
              className="text-brand font-medium hover:underline inline-flex items-center gap-1"
            >
              {v.viewAllVisa} &gt;
            </Link>
          </div>
          {/* 图二样式：纵向列表，每行左图 + 右侧标题/四列指标/价格/按钮 */}
          <div className="mt-10 space-y-6">
            {visaList.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-gray-50/80 overflow-hidden shadow-sm hover:shadow-md hover:border-brand/20 transition flex flex-col sm:flex-row"
              >
                <div className="sm:w-52 lg:w-56 shrink-0 h-40 sm:h-auto sm:min-h-[140px] bg-cover bg-center" style={{ backgroundImage: `url(${cardImageFor(i)})` }} />
                <div className="flex-1 p-5 flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-gray-900">
                      {item.title}+{item.scope}
                    </h3>
                    <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">{v.labelEntry}</span>
                        <p className="font-medium text-gray-800">{item.entryCount}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">{v.labelStay}</span>
                        <p className="font-medium text-gray-800">{item.stayDuration}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">{v.labelValidity}</span>
                        <p className="font-medium text-gray-800">{item.validity}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">{v.labelProcess}</span>
                        <p className="font-medium text-gray-800">{item.processDays}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 lg:gap-4 shrink-0">
                    {!item.slug && (
                      <>
                        <p className="text-lg font-semibold text-brand whitespace-nowrap">
                          ¥{item.priceRmb}元起
                        </p>
                        <p className="text-sm text-gray-500">{item.priceCad}</p>
                      </>
                    )}
                    <Link
                      href={item.slug ? `/visa/${item.slug}` : "/#contact"}
                      className="inline-flex items-center justify-center rounded-lg bg-brand text-white px-4 py-2.5 text-sm font-medium hover:bg-brand-dark transition shrink-0"
                    >
                      {v.viewDetail}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 服务流程 - 时间轴线穿过节点 */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center">
            {v.processTitle}
          </h2>
          <div className="mt-2 h-1 w-14 bg-brand rounded-sm mx-auto" />
          <div className="relative mt-12">
            {/* 水平线：穿过圆心中间 */}
            <div
              className="hidden sm:block absolute left-0 right-0 h-0.5 bg-brand/25 rounded-full"
              style={{ top: "22px", marginLeft: "8%", marginRight: "8%" }}
              aria-hidden
            />
            <div className="flex flex-col sm:flex-row sm:justify-between gap-10 sm:gap-0">
              {v.flowSteps.map((step, i) => (
                <div key={i} className="flex items-center sm:flex-col sm:flex-1 sm:max-w-[160px]">
                  <div className="relative z-10 w-11 h-11 rounded-full bg-brand text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-md">
                    {i + 1}
                  </div>
                  <div className="ml-4 sm:ml-0 sm:mt-4 sm:text-center">
                    <p className="text-xs font-semibold text-brand uppercase tracking-wider">STEP {i + 1}</p>
                    <p className="mt-1.5 text-sm text-gray-800">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 免费定制方案 */}
      <section className="py-16 sm:py-20 bg-brand/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              {v.customPlanTitle}
            </h2>
            <p className="mt-2 text-brand font-medium">{v.customPlanSubtitle}</p>
            <p className="mt-3 text-gray-600 text-sm leading-relaxed">{v.customPlanDesc}</p>
            <Link
              href="/#contact"
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-brand text-white px-8 py-3 font-medium hover:bg-brand-dark transition"
            >
              {v.customPlanCta}
            </Link>
          </div>
        </div>
      </section>

      </>
  );
}
