import { getPageMeta } from "@/utils/seo";
import { generatePageTitle } from "@/utils/utils";
import {HistoryModule} from "@orderly.network/portfolio";
import {MetaFunction} from "@remix-run/node";

export const meta: MetaFunction = () => {
  const rootSeoTags = getPageMeta();
  const pageSpecificTags = [{ title: generatePageTitle("History") }];
  return [...rootSeoTags, ...pageSpecificTags];
};

export default function HistoryPage() {
  return (
    <div className={"history-page"}>
      <HistoryModule.HistoryPage />
    </div>
  );
}