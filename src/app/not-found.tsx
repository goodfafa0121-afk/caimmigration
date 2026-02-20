import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-semibold text-gray-900">页面未找到</h1>
      <p className="mt-2 text-gray-600">您访问的页面不存在。</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark transition"
      >
        返回首页
      </Link>
    </div>
  );
}
