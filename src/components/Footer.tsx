"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

export default function Footer() {
  const { t, locale } = useLanguage();
  const f = t.footer;
  const [qrUrls, setQrUrls] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/site/footer-qr")
      .then((r) => r.json())
      .then((d) => setQrUrls(Array.isArray(d?.qrUrls) ? d.qrUrls.slice(0, 2) : []))
      .catch(() => {});
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <footer id="contact" className="bg-slate-800 text-slate-200">
        {/* 顶部内容区：公司简介 + 导航三列 + 二维码栏（第五列） */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
            {/* 第一列：长文案（公司名已移除） */}
            <div>
              <h3 className="font-semibold text-white text-lg mb-2">
                {f.aboutTitle}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mt-1">
                {f.aboutIntroLong}
              </p>
            </div>
            {/* 关于我们 链接列 */}
            <div>
              <h4 className="font-semibold text-white mb-3">{f.aboutNavTitle}</h4>
              <ul className="space-y-2 text-sm">
                {f.aboutNavLinks.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-slate-400 hover:text-brand transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* 移民服务 链接列 */}
            <div>
              <h4 className="font-semibold text-white mb-3">{f.immigrationNavTitle}</h4>
              <ul className="space-y-2 text-sm">
                {f.immigrationNavLinks.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-slate-400 hover:text-brand transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* 留学 & 签证 链接列 */}
            <div>
              <h4 className="font-semibold text-white mb-3">{f.studyVisaNavTitle}</h4>
              <ul className="space-y-2 text-sm">
                {f.studyVisaNavLinks.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-slate-400 hover:text-brand transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* 第五列：扫码关注 + 两个二维码（放在这一栏，顶部对齐保证同一水平线） */}
            <div className="flex flex-col md:items-start lg:items-end">
              <span className="text-sm text-slate-500 mb-3">{f.qrLabel}</span>
              <div className="flex items-start gap-4">
                {[0, 1].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-1 shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded bg-slate-700 flex items-center justify-center text-slate-500 text-xs shrink-0 overflow-hidden">
                      {qrUrls[i] ? (
                        <img src={qrUrls[i]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        "QR"
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 分隔线 */}
        <div className="border-t border-slate-700" />

        {/* 底部版权 + 备案 */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-slate-500">
            <span>{f.copyrightLine}</span>
            {locale === "zh" && f.icp ? <span>{f.icp}</span> : null}
          </div>
        </div>
      </footer>

      {/* 右下角浮动按钮：返回顶部 + 在线客服（图二风格） */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <button
          type="button"
          onClick={scrollToTop}
          className="w-12 h-12 rounded-full bg-slate-700 border border-slate-600 text-white flex items-center justify-center hover:bg-slate-600 transition shadow-lg"
          aria-label={f.backToTop}
        >
          <ChevronUpIcon className="w-5 h-5" />
        </button>
        <Link
          href="/#contact"
          className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center hover:bg-brand-dark transition shadow-lg"
          aria-label={f.chat}
        >
          <ChatIcon className="w-5 h-5" />
        </Link>
      </div>
    </>
  );
}
