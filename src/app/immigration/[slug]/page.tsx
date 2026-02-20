import Footer from "@/components/Footer";
import ProjectDetail from "@/components/ProjectDetail";

const SLUG_TITLES: Record<string, string> = {
  cec: "加拿大联邦EE经验类移民CEC",
  "ee-targeted": "加拿大联邦EE快速通道定向邀请",
  fsw: "加拿大联邦EE技术移民FSW",
  fst: "加拿大联邦EE技工类移民FST",
  pnp: "省提名 PNP",
  "manitoba-swo": "加拿大曼省海外技术工人通道",
  "ns-graduate": "加拿大NS省国际毕业生紧缺类",
  "rural-pilot": "加拿大农村社区移民试点",
  "startup-visa": "加拿大联邦创业移民",
  "spouse-child": "加拿大配偶子女团聚",
  "super-visa": "加拿大超级签证",
  "study-to-pr": "学签转移民",
  aip: "大西洋移民计划 AIP",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = SLUG_TITLES[slug] ?? "移民项目";
  return {
    title: `${title} | 加拿大移民 — 加友出国`,
    description:
      "加拿大 Express Entry、定向邀请、CEC 等移民项目申请流程与条件。持牌顾问专业规划，免费评估。",
  };
}

export default async function ImmigrationProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <>
      <main className="pt-[6.5rem]">
        <ProjectDetail slug={slug} />
      </main>
      <Footer />
    </>
  );
}
