import { MetaFunction } from "@remix-run/node";
import { APIManagerModule } from "@orderly.network/portfolio";
import { generatePageTitle } from "@/utils/utils";
import { getPageMeta } from "@/utils/seo";

export const meta: MetaFunction = () => {
  const rootSeoTags = getPageMeta();
  const pageSpecificTags = [{ title: generatePageTitle("API Key") }];
  return [...rootSeoTags, ...pageSpecificTags];
};

export default function APIKeyPage() {
  return <APIManagerModule.APIManagerPage />;
}
