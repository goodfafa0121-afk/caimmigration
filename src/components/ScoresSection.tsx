"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { eeDrawsData } from "@/lib/eeDrawsData";

export default function ScoresSection() {
  const { t, locale } = useLanguage();
  const eeDraws = eeDrawsData.slice(0, 4);
  const isEn = locale === "en";

  return (
    <section id="scores" className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {t.scores.title}
              </h2>
              <div className="mt-1.5 h-1 w-14 bg-brand rounded-sm" />
            </div>
            <p className="mt-3 text-gray-600">{t.scores.subtitle}</p>
          </div>
          <Link
            href="/scores"
            className="text-sm font-medium text-brand hover:underline shrink-0"
          >
            {t.scores.viewAll} &gt;
          </Link>
        </div>
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[320px] border border-gray-200 bg-white text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  {t.scores.round}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  {t.scores.date}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  {t.scores.category}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  {t.scores.score}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  {t.scores.count}
                </th>
              </tr>
            </thead>
            <tbody>
              {eeDraws.map((row) => (
                <tr
                  key={row.round}
                  className="border-b border-gray-100 hover:bg-gray-50/50"
                >
                  <td className="py-3 px-4 text-gray-900">{row.round}</td>
                  <td className="py-3 px-4 text-gray-600">{row.date}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {isEn ? row.categoryEn : row.category}
                  </td>
                  <td className="py-3 px-4 text-gray-900 font-semibold">
                    {row.score}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {row.count.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
