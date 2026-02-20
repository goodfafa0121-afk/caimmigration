import Footer from "@/components/Footer";
import ScoresPageContent from "@/components/ScoresPageContent";

export const metadata = {
  title: "最新移民分数 | Express Entry 邀请轮次 — 简单移民咨询",
  description:
    "加拿大 Express Entry 近期邀请轮次与 CRS 分数。数据来源 IRCC 官网，仅供参考，助您把握最佳申请时机。",
};

export default function ScoresPage() {
  return (
    <>
      <main className="pt-[6.5rem]">
        <ScoresPageContent />
      </main>
      <Footer />
    </>
  );
}
