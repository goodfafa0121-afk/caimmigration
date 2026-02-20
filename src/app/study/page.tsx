import Footer from "@/components/Footer";
import StudyContent from "@/components/StudyContent";
import { getStudyHeroImageUrl } from "@/lib/study-hero-image";

export const metadata = {
  title: "留学规划 | 加拿大留学与移民衔接 — 简单移民咨询",
  description:
    "加拿大留学规划：选校、学签、毕业工签与省提名/EE 衔接。持牌顾问，定制方案，从申请到移民一站式服务。",
};

export default async function StudyPage() {
  const heroImageUrl = await getStudyHeroImageUrl();
  return (
    <>
      <main className="pt-[6.5rem]">
        <StudyContent initialHeroImageUrl={heroImageUrl ?? undefined} />
      </main>
      <Footer />
    </>
  );
}
