"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const IMMIGRATION_IMAGES = [
  "https://images.unsplash.com/photo-1519832979-6fa011b87667?q=80&w=600",
  "https://images.unsplash.com/photo-1523531294919-4fcd7e65e216?q=80&w=600",
  "https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=80&w=600",
  "https://images.unsplash.com/photo-1540541333647-bf969ddbcb22?q=80&w=600",
  "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600",
];

/** 内联占位图：外链全部失败时使用，保证不出现裂图 */
const PLACEHOLDER_DATA_URI =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="#e5e7eb" width="400" height="300"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="sans-serif" font-size="14">暂无图片</text></svg>'
  );

const TYPE_KEYS = ["all", "tech", "invest", "startup", "family", "study", "other"] as const;
type TypeKey = (typeof TYPE_KEYS)[number];

type ProjectItem = {
  type?: string;
  hot?: boolean;
  slug?: string;
  title: string;
  desc: string;
  period: string;
  investment?: string;
  identity: string;
  language: string;
  budget?: string;
  image_url?: string;
};

export default function ImmigrationContent() {
  const { t } = useLanguage();
  const [projectType, setProjectType] = useState<TypeKey>("all");

  const types = [
    { key: "all" as const, label: t.immigration.projectTypeAll },
    { key: "tech" as const, label: t.immigration.projectTypes.tech },
    { key: "invest" as const, label: t.immigration.projectTypes.invest },
    { key: "startup" as const, label: t.immigration.projectTypes.startup },
    { key: "family" as const, label: t.immigration.projectTypes.family },
    { key: "study" as const, label: t.immigration.projectTypes.study },
    { key: "other" as const, label: t.immigration.projectTypes.other },
  ];

  const staticProjects = t.immigration.projects as unknown as ProjectItem[];
  const [projects, setProjects] = useState<ProjectItem[]>(staticProjects);
  const [slotImages, setSlotImages] = useState<string[]>(() => Array(12).fill(""));
  const [imageFailedKeys, setImageFailedKeys] = useState<Set<string>>(new Set());
  const [imageUseFirstFallback, setImageUseFirstFallback] = useState<Set<string>>(new Set());
  const [imageUsePlaceholderUri, setImageUsePlaceholderUri] = useState<Set<string>>(new Set());
  useEffect(() => {
    fetch("/api/site/immigration-project-images")
      .then((r) => r.json())
      .then((d) => setSlotImages(Array.isArray(d?.images) ? d.images.slice(0, 12) : []))
      .catch(() => {});
  }, []);
  useEffect(() => {
    fetch("/api/immigration/projects")
      .then((r) => r.json())
      .then((d) => {
        if (!Array.isArray(d?.items) || d.items.length === 0) return;
        const apiItems = d.items as { image_url?: string; title?: string; [k: string]: unknown }[];
        // 用后台数据只更新图片等，保留静态的 slug/标题顺序，避免整表替换导致闪动
        const next: ProjectItem[] = [];
        for (let i = 0; i < staticProjects.length; i++) {
          const s = staticProjects[i];
          const api = apiItems[i];
          if (!api) {
            next.push({ ...s });
          } else {
            next.push({
              ...s,
              ...api,
              slug: s.slug ?? (api.slug as string | undefined),
              title: api.title && String(api.title).trim() ? api.title : s.title,
            });
          }
        }
        setProjects(next);
      })
      .catch(() => {});
  }, []);
  const filtered =
    projectType === "all"
      ? projects
      : projects.filter((p) => p.type === projectType);
  const labels = t.immigration.labels;

  return (
    <>
      {/* 标题区 - 带背景图（与留学规划页一致高度） */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1519832979-6fa011b87667?q=80&w=1920)",
          }}
        />
        <div className="absolute inset-0 bg-white/80" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900">
            {t.immigration.title}
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            {t.immigration.subtitle}
          </p>
        </div>
      </section>

      {/* 加拿大介绍 - 重新设计 */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t.immigration.canadaIntro}
            </p>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            {[
              { title: t.immigration.canadaWelfare, desc: t.immigration.canadaWelfareDesc },
              { title: t.immigration.canadaEdu, desc: t.immigration.canadaEduDesc },
              { title: t.immigration.canadaHealth, desc: t.immigration.canadaHealthDesc },
              { title: t.immigration.canadaEnv, desc: t.immigration.canadaEnvDesc },
            ].map((item, i) => (
              <div
                key={i}
                className="group rounded-2xl border-l-4 border-brand bg-gray-50/90 pl-6 pr-6 py-6 hover:bg-brand/5 hover:shadow-sm transition-all duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 项目类型筛选 - 放在加拿大介绍下面 */}
      <section className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500 mr-2">{t.immigration.filterLabel}</span>
            {types.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setProjectType(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  projectType === key
                    ? "bg-brand text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-gray-600">
            {t.immigration.totalCount.replace("{count}", String(filtered.length))}
          </p>
        </div>
      </section>

      {/* 项目列表 - 横向大卡片，参考图二 canbridge 共83个移民项目 */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-lg font-medium text-gray-800 mb-6">
            {t.immigration.totalCount.replace("{count}", String(filtered.length))}
          </p>
          <div className="space-y-5">
            {filtered.map((project, i) => {
              const hot = "hot" in project && project.hot;
              const investment = "investment" in project ? project.investment : "无";
              const slugFromProject = "slug" in project && project.slug ? project.slug : null;
              const slugFromTitle = (staticProjects.find((s) => s.title === project.title) as { slug?: string } | undefined)?.slug ?? null;
              const projectIndex = projects.indexOf(project);
              const slugFromIndex = projectIndex >= 0 ? (staticProjects[projectIndex] as { slug?: string } | undefined)?.slug ?? null : null;
              const slug = slugFromProject || slugFromTitle || slugFromIndex;
              const detailHref = slug ? `/immigration/${slug}` : "/#contact";
              const cardKey = slug ?? `card-${projectIndex}-${project.title}`;
              const imgIndex = i % IMMIGRATION_IMAGES.length;
              const projectImageUrl = "image_url" in project && typeof project.image_url === "string" ? String(project.image_url).trim() : "";
              const slotImageUrl = slotImages[projectIndex] && String(slotImages[projectIndex]).trim() ? slotImages[projectIndex] : "";
              const rawUrl = projectImageUrl || slotImageUrl;
              const fallbackUrl = IMMIGRATION_IMAGES[imgIndex];
              const firstFallback = IMMIGRATION_IMAGES[0];
              const imageUrl: string = imageUsePlaceholderUri.has(cardKey)
                ? PLACEHOLDER_DATA_URI
                : imageUseFirstFallback.has(cardKey)
                  ? firstFallback
                  : imageFailedKeys.has(cardKey) || !rawUrl
                    ? fallbackUrl
                    : rawUrl;
              const handleImgError = () => {
                if (imageUsePlaceholderUri.has(cardKey)) return;
                if (imageUseFirstFallback.has(cardKey)) {
                  setImageUsePlaceholderUri((prev) => new Set(prev).add(cardKey));
                } else if (imageFailedKeys.has(cardKey) || !rawUrl) {
                  setImageUseFirstFallback((prev) => new Set(prev).add(cardKey));
                } else {
                  setImageFailedKeys((prev) => new Set(prev).add(cardKey));
                }
              };
              return (
                <div
                  key={cardKey}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col sm:flex-row hover:border-brand/30 hover:shadow-md transition"
                >
                  {/* 左侧：缩略图 + 热门 + 加拿大（优先使用后台上传的 image_url） */}
                  <div className="relative sm:w-56 lg:w-64 shrink-0 aspect-[4/3] sm:aspect-auto sm:h-[180px] bg-gray-200">
                    <img
                      src={imageUrl || firstFallback}
                      alt=""
                      className="w-full h-full object-cover"
                      decoding="async"
                      loading="lazy"
                      onError={handleImgError}
                    />
                    {hot && (
                      <span className="absolute left-2 top-2 rounded bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                        {t.immigration.hotTag}
                      </span>
                    )}
                    <span className="absolute left-0 bottom-0 bg-gray-900 px-2 py-1 text-xs font-medium text-white">
                      {t.immigration.countryTag}
                    </span>
                  </div>
                  {/* 中间：标题 + 描述 + 四项指标横排 */}
                  <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-brand">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {project.desc}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                      <span className="text-gray-500">
                        {labels.period} <strong className="text-gray-800">{project.period}</strong>
                      </span>
                      <span className="text-gray-500">
                        {labels.investment} <strong className="text-gray-800">{investment}</strong>
                      </span>
                      <span className="text-gray-500">
                        {labels.identity} <strong className="text-gray-800">{project.identity}</strong>
                      </span>
                      <span className="text-gray-500">
                        {labels.language} <strong className="text-gray-800">{project.language}</strong>
                      </span>
                    </div>
                  </div>
                  {/* 右侧：查看详情 */}
                  <div className="sm:w-44 lg:w-52 shrink-0 p-5 sm:p-6 flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l border-gray-100 bg-gray-50/50">
                    <Link
                      href={detailHref}
                      className="w-full sm:w-auto inline-flex justify-center rounded-lg bg-brand text-white px-5 py-2.5 text-sm font-medium hover:bg-brand-dark transition"
                    >
                      {t.immigration.consultCta}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 免费定制方案 - 参考 globevisa */}
      <section className="py-16 sm:py-20 bg-brand/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              {t.immigration.freePlanTitle}
            </h2>
            <p className="mt-2 text-brand font-medium">
              {t.immigration.freePlanSubtitle}
            </p>
            <p className="mt-3 text-gray-600 text-sm">
              {t.immigration.freePlanDesc}
            </p>
            <Link
              href="/#contact"
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-brand text-white px-8 py-3 font-medium hover:bg-brand-dark transition"
            >
              {t.immigration.formSubmit}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
