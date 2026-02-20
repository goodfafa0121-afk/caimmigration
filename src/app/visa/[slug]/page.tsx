import Footer from "@/components/Footer";
import VisaDetail from "@/components/VisaDetail";

const SLUG_META: Record<
  string,
  { title: string; description: string }
> = {
  tourist: {
    title: "加拿大多次往返旅游签证",
    description:
      "加拿大旅游签证、多次往返、全国受理。持牌顾问一对一审核，高出签率。办理流程与常见问题说明。",
  },
  "study-permit-extension": {
    title: "加拿大学习签证续签",
    description:
      "加拿大学签续签：境内或境外申请。持牌顾问协助准备材料、符合 IRCC 要求，办理流程与常见问题说明。",
  },
  "first-study-permit": {
    title: "首次加拿大学习签证办理",
    description:
      "境外首次办理加拿大学签：持牌顾问协助选校、材料准备与递交，办理流程与常见问题说明。",
  },
  "parent-visitor": {
    title: "加拿大父母探亲签证",
    description:
      "加拿大父母探亲签证：全国受理，持牌顾问协助材料准备与递交，办理流程与常见问题说明。",
  },
  "super-visa": {
    title: "加拿大超级签证 Super Visa",
    description:
      "加拿大超级签证：父母祖父母长期探亲，单次可停留最多2年。持牌顾问协助材料与保险，办理流程与常见问题说明。",
  },
  pgwp: {
    title: "加拿大毕业工签",
    description:
      "加拿大毕业工签（PGWP）：境内或境外申请，持牌顾问协助材料与时机，办理流程与常见问题说明。",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = SLUG_META[slug] ?? { title: "签证详情", description: "加拿大签证服务详情与办理说明。" };
  return {
    title: `${meta.title} | 签证服务 — 简单移民咨询`,
    description: meta.description,
  };
}

export default async function VisaSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <>
      <main className="pt-[6.5rem]">
        <VisaDetail slug={slug} />
      </main>
      <Footer />
    </>
  );
}
