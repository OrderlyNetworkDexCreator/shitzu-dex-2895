import { MetaFunction } from "@remix-run/node";
import { MarketsHomePage } from "@orderly.network/markets";
import { generatePageTitle } from "@/utils/utils";
import { getPageMeta } from "@/utils/seo";

export const meta: MetaFunction = () => {
  const rootSeoTags = getPageMeta();
  const pageSpecificTags = [{ title: generatePageTitle("Markets") }];
  return [...rootSeoTags, ...pageSpecificTags];
};

export default function MarketsPage() {
  return <MarketsHomePage />;
}
