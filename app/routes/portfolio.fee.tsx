import { MetaFunction } from "@remix-run/node";
import { FeeTierModule } from "@orderly.network/portfolio";
import { generatePageTitle } from "@/utils/utils";
import { getPageMeta } from "@/utils/seo";

export const meta: MetaFunction = () => {
  const rootSeoTags = getPageMeta();
  const pageSpecificTags = [{ title: generatePageTitle("Fee") }];
  return [...rootSeoTags, ...pageSpecificTags];
};

export default function FeeTierPage() {
  return <FeeTierModule.FeeTierPage dataAdapter={() => ({
    columns: [],
    dataSource: [],
  })} />;
}
