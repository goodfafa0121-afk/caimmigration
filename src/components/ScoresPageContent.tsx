"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { eeDrawsData } from "@/lib/eeDrawsData";

export default function ScoresPageContent() {
  const { t, locale } = useLanguage();
  const sp = (t as { scoresPage?: Record<string, string> }).scoresPage;
  const sc = (t as { scores?: Record<string, string> }).scores;
  const s = sp ?? sc ?? {};
  const isEn = locale === "en";

  return (
    <>
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 text-sm text-gray-500">
          <Link href="/" className="hover:text-brand">
            {s.breadcrumbHome ?? "首页"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{s.breadcrumbScores ?? "最新移民分数"}</span>
        </div>
      </section>

      <section className="py-10 sm:py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            {s.title ?? "Express Entry 邀请轮次与分数"}
          </h1>
          <p className="mt-3 text-gray-600">{s.subtitle ?? ""}</p>
          <p className="mt-2 text-sm text-gray-500">{s.dataSourceNote ?? ""}</p>
        </div>
      </section>

      <section className="pb-16 sm:pb-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] border border-gray-200 bg-white text-sm rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    {s.round ?? "邀请轮次"}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    {s.date ?? "邀请时间"}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    {s.category ?? "邀请类别"}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    {s.score ?? "邀请分数"}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    {s.count ?? "邀请人数"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {eeDrawsData.map((row) => (
                  <tr
                    key={row.round}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                  >
                    <td className="py-3 px-4 text-gray-900 font-medium">
                      {row.round}
                    </td>
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
    </>
  );
}
