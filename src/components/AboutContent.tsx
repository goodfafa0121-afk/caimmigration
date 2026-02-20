"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

type AboutContentProps = { initialTeamAvatarUrls?: string[] };

export default function AboutContent({ initialTeamAvatarUrls = [] }: AboutContentProps) {
  const { t } = useLanguage();
  const a = t.aboutPage;
  const [teamAvatarUrls, setTeamAvatarUrls] = useState<string[]>(() =>
    Array.isArray(initialTeamAvatarUrls) && initialTeamAvatarUrls.length >= 3
      ? initialTeamAvatarUrls.slice(0, 3)
      : []
  );
  const [avatarLoadFailed, setAvatarLoadFailed] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (teamAvatarUrls.length > 0) return;
    fetch("/api/site/team-avatars")
      .then((r) => r.json())
      .then((d) => setTeamAvatarUrls(Array.isArray(d?.avatars) ? d.avatars.slice(0, 3) : []))
      .catch(() => {});
  }, [teamAvatarUrls.length]);

  return (
    <>
      {/* 顶部视觉横幅 - 无文字，仅背景图与遮罩 */}
      <section className="relative w-full min-h-[240px] sm:min-h-[280px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1519832979-6fa011b87667?q=80&w=1920)",
          }}
        />
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />
      </section>

      {/* 企业介绍 - 两段文案 */}
      <section id="intro" className="py-16 sm:py-20 bg-white scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center">
            {a.introHeading}
          </h2>
          <div className="mt-2 h-0.5 w-14 bg-brand rounded-sm mx-auto" />
          {(a as { introName?: string }).introName && (
            <p className="mt-6 text-center text-lg font-medium text-gray-800">
              {(a as { introName: string }).introName}
            </p>
          )}
          <div className="mt-8 max-w-3xl mx-auto space-y-6 text-gray-600 leading-relaxed">
            <p>{a.intro1}</p>
            <p>{a.intro2}</p>
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-medium text-white hover:bg-brand-dark transition"
            >
              {a.ctaConsult}
            </Link>
          </div>
        </div>
      </section>

      {/* 数据指标 - 卡片式，每项独立卡片带绿色强调 */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {a.stats.map((item, i) => (
              <div
                key={i}
                className="group relative rounded-xl bg-white border border-gray-200 px-4 py-5 text-center shadow-sm hover:shadow-md hover:border-brand/30 transition"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-brand rounded-b opacity-80 group-hover:opacity-100 transition" aria-hidden />
                <p className="text-2xl sm:text-3xl font-bold text-brand tabular-nums">{item.value}</p>
                <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-snug">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 企业文化 - 卡片式：左侧强调块 + 三条价值观 + 正文 */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl border border-gray-200 bg-brand/5 overflow-hidden shadow-sm">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white p-6 sm:p-8 flex flex-col justify-center">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {a.cultureHeading}
                </h2>
                <div className="mt-2 h-0.5 w-12 bg-brand rounded-sm" />
                <div className="mt-6 space-y-4">
                  {a.cultureValues.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="shrink-0 w-8 h-8 rounded-full bg-brand/20 text-brand text-sm font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-2/3 p-6 sm:p-8 flex flex-col justify-center">
                <p className="text-gray-600 leading-relaxed">
                  {a.cultureText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 发展历程 - 错落单列 + 柔和连接线 */}
      <section id="history" className="py-16 sm:py-20 bg-gray-50 scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center">
            {a.historyHeading}
          </h2>
          <div className="mt-2 h-0.5 w-14 bg-brand rounded-sm mx-auto" />
          <div className="mt-12 relative">
            {/* 柔和虚线连接 */}
            <div className="absolute left-5 sm:left-8 top-6 bottom-6 w-px bg-gradient-to-b from-brand/40 via-brand/20 to-brand/40" aria-hidden />
            <ul className="space-y-0">
              {a.historyTimeline.map((item, i) => (
                <li
                  key={i}
                  className="relative flex gap-4 sm:gap-6 pb-10 last:pb-0"
                >
                  <div className="relative z-10 shrink-0 w-10 sm:w-14 h-10 sm:h-14 rounded-full bg-brand text-white flex items-center justify-center text-sm sm:text-base font-bold shadow-md">
                    {item.year}
                  </div>
                  <div
                    className={`flex-1 rounded-xl bg-white border border-gray-200 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-brand/20 transition ${
                      i % 2 === 1 ? "sm:ml-4" : ""
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900">{item.label}</h3>
                    <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 团队介绍 - 每屏展示 5-6 人，网格布局 */}
      <section id="team" className="py-16 sm:py-20 bg-white scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center">
            {a.teamHeading}
          </h2>
          <div className="mt-2 h-0.5 w-14 bg-brand rounded-sm mx-auto" />
          <p className="mt-3 text-center text-gray-500 text-sm">{a.teamTitle}</p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8">
            {a.teamMembers.map((member, i) => {
              const avatarUrl = teamAvatarUrls[i];
              const showAvatar = avatarUrl && !avatarLoadFailed.has(i);
              return (
              <div
                key={i}
                className="flex flex-col items-center text-center rounded-2xl border border-gray-200 bg-gray-50/50 p-5 sm:p-6 hover:border-brand/20 hover:shadow-md transition"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-brand/15 flex items-center justify-center text-xl sm:text-2xl font-bold text-brand shrink-0 overflow-hidden">
                  {showAvatar ? (
                    <img
                      src={avatarUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={() => setAvatarLoadFailed((prev) => new Set(prev).add(i))}
                    />
                  ) : (
                    <span>{member.name.charAt(0)}</span>
                  )}
                </div>
                <h3 className="mt-3 text-base sm:text-lg font-semibold text-brand">{member.name}</h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-600">{member.role}</p>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed text-left line-clamp-4">
                  {member.desc}
                </p>
              </div>
            );
            })}
          </div>
        </div>
      </section>

      {/* 联系我们 - 引导至首页联系区块 */}
      <section id="contact" className="py-16 sm:py-20 bg-brand/5 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            {a.contactHeading}
          </h2>
          <div className="mt-2 h-0.5 w-14 bg-brand rounded-sm mx-auto" />
          <p className="mt-6 text-gray-600 max-w-xl mx-auto">{a.contactText}</p>
          <Link
            href="/#contact"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-brand text-white px-8 py-3 font-medium hover:bg-brand-dark transition"
          >
            {a.ctaConsult}
          </Link>
        </div>
      </section>
    </>
  );
}
