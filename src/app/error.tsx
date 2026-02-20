"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center px-4 py-16">
      <h2 className="text-xl font-semibold text-gray-900">出错了</h2>
      <p className="mt-2 text-sm text-gray-600 text-center max-w-md">
        页面加载时发生错误，请重试。
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark transition"
      >
        重新加载
      </button>
    </div>
  );
}
