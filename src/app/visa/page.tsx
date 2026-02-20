import Footer from "@/components/Footer";
import VisaContent from "@/components/VisaContent";
import { getVisaHeroImageUrl } from "@/lib/visa-hero-image";
import { getHomeVisaServicesImages } from "@/lib/home-services-images";

export const metadata = {
  title: "加拿大签证服务 | 学签 工签 探亲 超级签证 — 简单移民咨询",
  description:
    "加拿大签证专业办理：学签、毕业工签、探亲签、超级签证。持牌顾问一对一审核，全国受理，高出签率。",
};

export default async function VisaPage() {
  const [heroImageUrl, cardImages] = await Promise.all([
    getVisaHeroImageUrl(),
    getHomeVisaServicesImages(),
  ]);
  return (
    <>
      <main className="pt-[6.5rem]">
        <VisaContent
          initialHeroImageUrl={heroImageUrl ?? undefined}
          initialCardImages={cardImages}
        />
      </main>
      <Footer />
    </>
  );
}
