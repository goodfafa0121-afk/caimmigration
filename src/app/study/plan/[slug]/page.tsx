import Footer from "@/components/Footer";
import StudyPlanDetail from "@/components/StudyPlanDetail";

const SLUG_TITLES: Record<string, string> = {
  "study-to-pr": "留学转移民全程规划",
  "master-undergrad": "硕士/本科申请",
  "language-study-permit": "语言+学签",
  "elite-guaranteed": "名校保录取",
  "college-to-university": "College 转大学",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = SLUG_TITLES[slug] ?? "留学方案";
  return {
    title: `${title} | 留学规划 — 加友出国`,
    description:
      "加拿大留学转移民全程规划：选校、学签、毕业工签与 EE/省提名衔接。持牌顾问，定制方案，一站式服务。",
  };
}

export default async function StudyPlanPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <>
      <main className="pt-[6.5rem]">
        <StudyPlanDetail slug={slug} />
      </main>
      <Footer />
    </>
  );
}
