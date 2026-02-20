import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ChatWidget from "@/components/ChatWidget";
import SiteHeader from "@/components/SiteHeader";
import { getLogoUrl } from "@/lib/logo-url";
import { getSeoSettings } from "@/lib/seo-settings";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const keywords = seo.keywords ? seo.keywords.split(/[,，、\s]+/).filter(Boolean) : [];
  return {
    title: seo.title || undefined,
    description: seo.description || undefined,
    keywords: keywords.length > 0 ? keywords : undefined,
    openGraph: {
      title: seo.ogTitle || seo.title || undefined,
      description: seo.ogDescription || seo.description || undefined,
      ...(seo.ogImage ? { images: [{ url: seo.ogImage }] } : {}),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const logoUrl = await getLogoUrl();
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <SiteHeader initialLogoUrl={logoUrl} />
          {children}
          <ChatWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}
