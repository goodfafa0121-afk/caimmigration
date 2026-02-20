import Footer from "@/components/Footer";
import EnterpriseContent from "@/components/EnterpriseContent";
import { getEnterpriseModuleImages } from "@/lib/enterprise-module-images";

export const metadata = {
  title: "加拿大企业服务 | 公司注册 银行开户 企业移民 — 简单移民咨询",
  description:
    "加拿大企业一站式服务：公司注册（如BC省）、银行开户、企业移民（联邦创业ICT、省提名等）。持牌顾问全程协助，境内外均可办理。",
};

export default async function EnterprisePage() {
  const { conditionsImageUrl, taxServiceImageUrl } = await getEnterpriseModuleImages();
  return (
    <>
      <main className="pt-[6.5rem]">
        <EnterpriseContent
          initialConditionsImageUrl={conditionsImageUrl}
          initialTaxServiceImageUrl={taxServiceImageUrl}
        />
      </main>
      <Footer />
    </>
  );
}
