import { MetaFunction } from "@remix-run/node";
import { OverviewModule } from "@orderly.network/portfolio";
import { generatePageTitle } from "@/utils/utils";
import { getPageMeta } from "@/utils/seo";

export const meta: MetaFunction = () => {
  const rootSeoTags = getPageMeta();
  const pageSpecificTags = [{ title: generatePageTitle("Portfolio") }];
  return [...rootSeoTags, ...pageSpecificTags];
};

export default function PortfolioPage() {
  return <OverviewModule.OverviewPage />;
}
