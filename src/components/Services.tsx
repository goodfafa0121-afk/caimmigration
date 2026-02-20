"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const CARD_IMAGES = [
  "https://images.unsplash.com/photo-1519832979-6fa011b87667?q=80&w=800",
  "https://images.unsplash.com/photo-1523531294919-4fcd7e65e216?q=80&w=800",
  "https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=80&w=800",
  "https://images.unsplash.com/photo-1540541333647-bf969ddbcb22?q=80&w=800",
  "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=800",
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=800",
];

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
  image_url?: string;
};

const HOME_CARD_COUNT = 8;

type ServicesProps = {
  initialSlotImages?: string[];
  initialProjectImages?: string[];
};

export default function Services({ initialSlotImages = [], initialProjectImages = [] }: ServicesProps) {
  const { t } = useLanguage();
  const immigration = (t as unknown as { immigration?: { projects?: Project[]; officialDisclaimer?: string } }).immigration;
  const projectsSource = immigration?.projects;
  const staticProjects = (Array.isArray(projectsSource) ? projectsSource : []).slice(0, HOME_CARD_COUNT);
  const officialDisclaimer = immigration?.officialDisclaimer ?? "";
  const [slotImages, setSlotImages] = useState<string[]>(() =>
    Array.isArray(initialSlotImages) && initialSlotImages.length >= HOME_CARD_COUNT
      ? initialSlotImages.slice(0, HOME_CARD_COUNT)
      : Array.from({ length: HOME_CARD_COUNT }, (_, i) => initialSlotImages[i] ?? "")
  );
  const [projectImages, setProjectImages] = useState<string[]>(() =>
    Array.isArray(initialProjectImages) && initialProjectImages.length >= HOME_CARD_COUNT
      ? initialProjectImages.slice(0, HOME_CARD_COUNT)
      : Array.from({ length: HOME_CARD_COUNT }, (_, i) => initialProjectImages[i] ?? "")
  );

  useEffect(() => {
    Promise.all([
      fetch("/api/site/recommended-project-images")
        .then((r) => r.json())
        .then((d) => (Array.isArray(d?.images) ? d.images : []))
        .catch(() => []),
      fetch("/api/immigration/projects")
        .then((r) => r.json())
        .then((d) => (Array.isArray(d?.items) ? d.items : []))
        .catch(() => []),
    ]).then(([slotData, projectData]) => {
      setSlotImages(Array.isArray(slotData) ? slotData.slice(0, HOME_CARD_COUNT) : []);
      const items = Array.isArray(projectData) ? projectData.slice(0, HOME_CARD_COUNT) : [];
      setProjectImages(
        Array.from({ length: HOME_CARD_COUNT }, (_, i) =>
          items[i] && typeof (items[i] as Project).image_url === "string" ? (items[i] as Project).image_url! : ""
        )
      );
    });
  }, []);
  const services = (t as unknown as { services?: { title?: string; subtitle?: string; viewDetail?: string; labels?: Record<string, string> } }).services;
  const labels = services?.labels ?? {};

  return (
    <section id="services" className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {services?.title ?? ""}
              </h2>
              <div className="mt-1.5 h-1 w-14 bg-brand rounded-sm" />
            </div>
            <p className="mt-3 text-gray-600">{services?.subtitle ?? ""}</p>
          </div>
          <Link
            href="/immigration"
            className="text-sm font-medium text-brand hover:underline shrink-0"
          >
            {services?.viewDetail ?? ""} &gt;
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {staticProjects.map((project, i) => {
            const slug = "slug" in project ? project.slug : undefined;
            const fallbackImg = CARD_IMAGES[i % CARD_IMAGES.length];
            const imgSrc = slotImages[i] || projectImages[i] || fallbackImg;
            return (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-brand/40 hover:shadow-lg transition"
              >
                <div className="relative aspect-[3/2] w-full bg-gray-100">
                  <img
                    src={imgSrc}
                    alt=""
                    className="w-full h-full object-cover"
                    loading={i < 4 ? "eager" : "lazy"}
                    decoding="async"
                    onError={(e) => {
                      const el = e.currentTarget;
                      if (el.src !== fallbackImg) {
                        el.src = fallbackImg;
                      }
                    }}
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {project.title}
                  </h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-gray-600">
                    <li>
                      <span className="text-gray-500">{labels.period}：</span>
                      {project.period}
                    </li>
                    <li>
                      <span className="text-gray-500">{labels.status}：</span>
                      {project.identity}
                    </li>
                    <li>
                      <span className="text-gray-500">{labels.requirement}：</span>
                      <span className="line-clamp-2">{project.language || project.desc}</span>
                    </li>
                  </ul>
                  <Link
                    href={slug ? `/immigration/${slug}` : "/immigration"}
                    className="mt-4 inline-block text-sm font-medium text-brand hover:underline"
                  >
                    {services?.viewDetail ?? ""} &gt;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        {officialDisclaimer ? (
          <p className="mt-6 text-xs text-gray-500 max-w-3xl">
            {officialDisclaimer}
          </p>
        ) : null}
      </div>
    </section>
  );
}
