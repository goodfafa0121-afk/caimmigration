"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase, type ConsultationInsert } from "@/lib/supabase/client";

export default function ContactForm() {
  const { t, locale } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setStatus("error");
      return;
    }
    setLoading(true);
    setStatus("idle");
    try {
      const row: ConsultationInsert = {
        ...form,
        locale: locale,
      };
      const { error } = await supabase.from("consultations").insert(row);
      if (error) throw error;
      setStatus("success");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            {t.form.title}
          </h2>
          <div className="mt-1.5 h-1 w-14 bg-brand rounded-sm" />
        </div>
        <p className="mt-3 text-gray-600">{t.form.subtitle}</p>

        {!supabase && (
          <p className="mt-4 p-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded">
            {t.form.configRequired}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              {t.form.name}
            </label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder={t.form.namePlaceholder}
              className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              {t.form.phone}
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder={t.form.phonePlaceholder}
              className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t.form.email}
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder={t.form.emailPlaceholder}
              className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              {t.form.message}
            </label>
            <textarea
              id="message"
              rows={4}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder={t.form.messagePlaceholder}
              className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand resize-none"
            />
          </div>
          {status === "success" && (
            <p className="text-sm text-green-600">{t.form.success}</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-600">{t.form.error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-dark text-white font-medium py-3 rounded transition disabled:opacity-60"
          >
            {loading ? "..." : t.form.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
