import { MetaFunction } from "@remix-run/node";
import { SettingModule } from "@orderly.network/portfolio";
import { generatePageTitle } from "@/utils/utils";
import { getPageMeta } from "@/utils/seo";

export const meta: MetaFunction = () => {
  const rootSeoTags = getPageMeta();
  const pageSpecificTags = [{ title: generatePageTitle("Setting") }];
  return [...rootSeoTags, ...pageSpecificTags];
};

export default function SettingsPage() {
  return <SettingModule.SettingPage />;
}
