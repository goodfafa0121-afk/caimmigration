"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const memberKeys = ["member1", "member2", "member3"] as const;

type TeamSectionProps = { initialAvatars?: string[] };

export default function TeamSection({ initialAvatars = [] }: TeamSectionProps) {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [avatars, setAvatars] = useState<string[]>(() =>
    Array.isArray(initialAvatars) && initialAvatars.length >= 3 ? initialAvatars.slice(0, 3) : Array.from({ length: 3 }, (_, i) => initialAvatars[i] ?? "")
  );
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    fetch("/api/site/team-avatars")
      .then((r) => r.json())
      .then((d) => setAvatars(Array.isArray(d?.avatars) ? d.avatars.slice(0, 3) : []))
      .catch(() => {});
  }, []);

  return (
    <section id="team" className="py-16 sm:py-20 bg-brand/5 relative overflow-hidden">
      {/* 装饰背景 */}
      <div className="absolute inset-0 opacity-30" aria-hidden>
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-brand/10 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-brand/10 translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            {t.team.title}
          </h2>
          <div className="mt-1.5 h-1 w-14 bg-brand rounded-sm mx-auto" />
          <p className="mt-4 text-gray-600">{t.team.subtitle}</p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {memberKeys.map((key, i) => {
            const m = t.team[key];
            const initial = mounted ? m.name.slice(0, 1) : "";
            const avatarUrl = avatars[i];
            const showAvatar = mounted && avatarUrl;
            return (
              <div
                key={key}
                className="group relative bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* 顶部色条：有上传头像则显示头像，否则显示姓名首字 */}
                <div className="h-20 bg-brand flex items-end justify-center pb-0">
                  <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-2xl font-bold text-brand -mb-10 group-hover:scale-105 transition-transform overflow-hidden">
                    {showAvatar ? (
                      <img src={avatarUrl} alt="" className="w-full h-full object-cover" onError={() => setAvatars((prev) => prev.map((u, j) => (j === i ? "" : u)))} />
                    ) : (
                      initial
                    )}
                  </div>
                </div>
                <div className="pt-14 pb-8 px-6 text-center">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {mounted ? m.name : "\u00A0"}
                  </h3>
                  <p className="mt-2 text-sm text-brand font-medium">
                    {mounted ? m.title : "\u00A0"}
                  </p>
                  <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-gray-500">
                    <svg className="w-4 h-4 text-brand/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {mounted ? m.location : "\u00A0"}
                  </p>
                  <Link
                    href="#contact"
                    className="mt-6 inline-flex items-center justify-center w-full min-w-[160px] px-5 py-3 text-sm font-semibold text-white bg-brand rounded-xl hover:bg-brand-dark shadow-md hover:shadow-lg transition-all"
                  >
                    {t.team.contact}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
