import { MetaFunction } from "@remix-run/node";
import { LeaderboardWidget } from "@orderly.network/trading-leaderboard";
import { generatePageTitle } from "@/utils/utils";
import { getPageMeta } from "@/utils/seo";

export const meta: MetaFunction = () => {
  const rootSeoTags = getPageMeta();
  const pageSpecificTags = [{ title: generatePageTitle("Leaderboard") }];
  return [...rootSeoTags, ...pageSpecificTags];
};

export default function MarketsPage() {
  return <LeaderboardWidget />;
}
