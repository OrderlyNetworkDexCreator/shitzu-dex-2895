import { MetaFunction } from "@remix-run/node";
import { AssetsModule } from "@orderly.network/portfolio";
import { generatePageTitle } from "@/utils/utils";
import { getPageMeta } from "@/utils/seo";

export const meta: MetaFunction = () => {
  const rootSeoTags = getPageMeta();
  const pageSpecificTags = [{ title: generatePageTitle("Assets") }];
  return [...rootSeoTags, ...pageSpecificTags];
};

export default function AssetsPage() {
  return <AssetsModule.AssetsPage />;
}
