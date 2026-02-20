"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type ConsultQRCardProps = { initialConsultQrUrl?: string | null };

/** 首页固定展示的「24小时 在线咨询」二维码卡片。二维码可在后台「在线咨询二维码」上传。 */
export default function ConsultQRCard({ initialConsultQrUrl = null }: ConsultQRCardProps) {
  const { t } = useLanguage();
  const [hidden, setHidden] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(() =>
    initialConsultQrUrl && initialConsultQrUrl.trim() ? initialConsultQrUrl.trim() : null
  );
  const c = t.consultQRCard;

  useEffect(() => {
    if (initialConsultQrUrl && initialConsultQrUrl.trim()) {
      setQrImageUrl(initialConsultQrUrl.trim());
      return;
    }
    fetch("/api/site/consult-qr")
      .then((r) => r.json())
      .then((d) => setQrImageUrl(d?.imageUrl && String(d.imageUrl).trim() ? d.imageUrl : null))
      .catch(() => {});
  }, [initialConsultQrUrl]);

  const qrSrc = qrImageUrl || "/qr-consult.png";

  if (hidden) return null;

  return (
    <div
      className="fixed left-4 bottom-24 z-30 w-[136px] rounded-xl bg-white shadow-lg border border-gray-200 overflow-hidden"
      aria-label={c.title}
    >
      <button
        type="button"
        onClick={() => setHidden(true)}
        className="absolute top-1.5 right-1.5 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
        aria-label={c.close}
      >
        <span className="text-sm leading-none">×</span>
      </button>

      <div className="p-2 pt-6 flex justify-center bg-white">
        <div className="relative w-[120px] h-[120px] rounded-lg overflow-hidden bg-white border border-gray-100 flex items-center justify-center shadow-sm">
          {!imgFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrSrc}
              alt={c.title}
              className="w-full h-full object-contain"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <span className="text-gray-400 text-xs">QR</span>
          )}
        </div>
      </div>

      <div className="bg-[#1e3a5f] px-2 py-2 text-center rounded-b-xl">
        <p className="text-white text-sm font-semibold">{c.title}</p>
        <p className="text-white/80 text-xs mt-0.5">{c.titleEn}</p>
      </div>
    </div>
  );
}
