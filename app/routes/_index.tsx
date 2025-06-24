import { type MetaFunction } from "@remix-run/node";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { useEffect } from "react";
import { DEFAULT_SYMBOL } from "@/utils/storage";
import { getPageMeta } from "@/utils/seo";

export const meta: MetaFunction = () => {
  const rootSeoTags = getPageMeta();
  
  const pageSpecificTags = [];
  
  if (import.meta.env.VITE_APP_NAME) {
    pageSpecificTags.push({ title: import.meta.env.VITE_APP_NAME });
  }
  
  if (import.meta.env.VITE_APP_DESCRIPTION) {
    pageSpecificTags.push({ name: "description", content: import.meta.env.VITE_APP_DESCRIPTION });
  }
  
  return [...rootSeoTags, ...pageSpecificTags];
};

export default function Index() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const searchParamsString = searchParams.toString();
    const redirectPath = `/perp/${DEFAULT_SYMBOL}${searchParamsString ? `?${searchParamsString}` : ''}`;
    navigate(redirectPath);
  }, [navigate, searchParams]);

  return null;
}
