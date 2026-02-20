import Footer from "@/components/Footer";
import AboutContent from "@/components/AboutContent";
import { getHomeTeamAvatars } from "@/lib/home-services-images";

export const metadata = {
  title: "关于加友 | 企业介绍 发展历程 团队 核心业务 — 简单移民咨询",
  description:
    "加友（简单移民咨询）企业介绍：持牌移民顾问团队，加拿大移民、留学、签证一站式服务，专业诚信高效。",
};

export default async function AboutPage() {
  const teamAvatarUrls = await getHomeTeamAvatars();
  return (
    <>
      <main className="pt-[6.5rem]">
        <AboutContent initialTeamAvatarUrls={teamAvatarUrls} />
      </main>
      <Footer />
    </>
  );
}
