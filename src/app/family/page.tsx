import Footer from "@/components/Footer";
import FamilyContent from "@/components/FamilyContent";

export const metadata = {
  title: "家庭类移民 | 配偶子女父母团聚、超级签证 — 加友出国",
  description:
    "加拿大家庭类移民：配偶及子女团聚、父母祖父母团聚（PGP）、超级签证。持牌顾问评估与全程协助，免费咨询。",
};

export default function FamilyPage() {
  return (
    <>
      <main className="pt-[6.5rem]">
        <FamilyContent />
      </main>
      <Footer />
    </>
  );
}
