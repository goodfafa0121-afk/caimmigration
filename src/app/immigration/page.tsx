import Footer from "@/components/Footer";
import ImmigrationContent from "@/components/ImmigrationContent";

export const metadata = {
  title: "加拿大移民 | 移民条件、费用与项目 — 简单移民咨询",
  description:
    "加拿大移民项目一览：Express Entry、CEC、省提名PNP、学签转移民、家庭团聚、大西洋AIP等。持牌顾问专业规划，免费评估。",
};

export default function ImmigrationPage() {
  return (
    <>
      <main className="pt-[6.5rem]">
        <ImmigrationContent />
      </main>
      <Footer />
    </>
  );
}
