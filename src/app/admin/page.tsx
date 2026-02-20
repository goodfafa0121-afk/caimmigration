"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ADMIN_TOKEN = "admin_token";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(ADMIN_TOKEN)) {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError("密码错误");
        return;
      }
      sessionStorage.setItem(ADMIN_TOKEN, password);
      router.replace("/admin/dashboard");
    } catch {
      setError("请求失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col sm:flex-row">
        {/* 左侧：品牌区 - VI 绿底 */}
        <div className="bg-brand flex flex-col justify-center px-8 py-10 sm:py-12 sm:w-44 sm:min-h-[320px]">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-white">简单移民咨询</p>
          <p className="mt-1 text-xs text-white/80">Easy Immigration Consulting Inc.</p>
          <p className="mt-6 text-xs text-white/60">管理员入口</p>
        </div>

        {/* 右侧：登录表单 */}
        <div className="bg-white px-8 py-10 sm:py-12 sm:flex-1 flex flex-col justify-center">
          <h1 className="text-xl font-semibold text-gray-900">后台登录</h1>
          <p className="mt-1 text-sm text-gray-500">请输入管理密码以继续</p>
          <form onSubmit={handleSubmit} className="mt-8">
            <label className="block text-sm font-medium text-gray-700">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20 outline-none transition"
              placeholder="请输入管理密码"
              required
            />
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-brand py-3 text-white font-medium hover:bg-brand-dark disabled:opacity-50 transition shadow-lg shadow-brand/20"
            >
              {loading ? "登录中…" : "登录"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
