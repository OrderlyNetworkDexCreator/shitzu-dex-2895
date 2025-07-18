import { useMemo } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { TradingPageProps } from "@orderly.network/trading";
import { BottomNavProps, FooterProps, MainNavWidgetProps } from "@orderly.network/ui-scaffold";
import { AppLogos } from "@orderly.network/react-app";
import { OrderlyActiveIcon, OrderlyIcon } from "../components/icons/orderly";
import { withBasePath } from "./base-path";
import { PortfolioActiveIcon, PortfolioInactiveIcon, TradingActiveIcon, TradingInactiveIcon, LeaderboardActiveIcon, LeaderboardInactiveIcon, MarketsActiveIcon, MarketsInactiveIcon } from "@orderly.network/ui";

interface MainNavItem {
  name: string;
  href: string;
  target?: string;
}

interface ColorConfigInterface {
  upColor?: string;
  downColor?: string;
  pnlUpColor?: string;
  pnlDownColor?: string;
  chartBG?: string;
}

export type OrderlyConfig = {
  orderlyAppProvider: {
    appIcons: AppLogos;
  };
  scaffold: {
    mainNavProps: MainNavWidgetProps;
    footerProps: FooterProps;
    bottomNavProps: BottomNavProps;
  };
  tradingPage: {
    tradingViewConfig: TradingPageProps["tradingViewConfig"];
    sharePnLConfig: TradingPageProps["sharePnLConfig"];
  };
};

// All available menu items with translation keys
const ALL_MENU_ITEMS = [
  { name: "Trading", href: "/", translationKey: "common.trading" },
  { name: "Portfolio", href: "/portfolio", translationKey: "common.portfolio" },
  { name: "Markets", href: "/markets", translationKey: "common.markets" },
  { name: "Rewards", href: "/rewards", translationKey: "tradingRewards.rewards" },
  { name: "Leaderboard", href: "/leaderboard", translationKey: "tradingLeaderboard.leaderboard" },
];

// Default enabled menu items (excluding Leaderboard)
const DEFAULT_ENABLED_MENUS = [
  { name: "Trading", href: "/", translationKey: "common.trading" },
  { name: "Portfolio", href: "/portfolio", translationKey: "common.portfolio" },
  { name: "Markets", href: "/markets", translationKey: "common.markets" },
  { name: "Leaderboard", href: "/leaderboard", translationKey: "tradingLeaderboard.leaderboard" },
];

const getCustomMenuItems = (): MainNavItem[] => {
  const customMenusEnv = import.meta.env.VITE_CUSTOM_MENUS;
  
  if (!customMenusEnv || typeof customMenusEnv !== 'string' || customMenusEnv.trim() === '') {
    return [];
  }
  
  try {
    // Parse delimiter-separated menu items
    // Expected format: "Documentation,https://docs.example.com;Blog,https://blog.example.com;Support,https://support.example.com"
    const menuPairs = customMenusEnv.split(';').map(pair => pair.trim()).filter(pair => pair.length > 0);
    
    const validCustomMenus: MainNavItem[] = [];
    
    for (const pair of menuPairs) {
      const [name, href] = pair.split(',').map(item => item.trim());
      
      if (!name || !href) {
        console.warn("Invalid custom menu item format. Expected 'name,url':", pair);
        continue;
      }
      
      validCustomMenus.push({
        name,
        href,
        target: "_blank",
      });
    }
    
    return validCustomMenus;
  } catch (e) {
    console.warn("Error parsing VITE_CUSTOM_MENUS:", e);
    return [];
  }
};

const getEnabledMenus = () => {
  const enabledMenusEnv = import.meta.env.VITE_ENABLED_MENUS;
  
  if (!enabledMenusEnv || typeof enabledMenusEnv !== 'string' || enabledMenusEnv.trim() === '') {
    return DEFAULT_ENABLED_MENUS;
  }
  
  try {
    const enabledMenuNames = enabledMenusEnv.split(',').map(name => name.trim());
    
    const enabledMenus = [];
    for (const menuName of enabledMenuNames) {
      const menuItem = ALL_MENU_ITEMS.find(item => item.name === menuName);
      if (menuItem) {
        enabledMenus.push(menuItem);
      }
    }
    
    return enabledMenus.length > 0 ? enabledMenus : DEFAULT_ENABLED_MENUS;
  } catch (e) {
    console.warn("Error parsing VITE_ENABLED_MENUS:", e);
    return DEFAULT_ENABLED_MENUS;
  }
};

const getPnLBackgroundImages = (): string[] => {
  const useCustomPnL = import.meta.env.VITE_USE_CUSTOM_PNL_POSTERS === "true";
  
  if (useCustomPnL) {
    const customPnLCount = parseInt(import.meta.env.VITE_CUSTOM_PNL_POSTER_COUNT, 10);
    
    if (isNaN(customPnLCount) || customPnLCount < 1) {
      return [
        withBasePath("/pnl/poster_bg_1.png"),
        withBasePath("/pnl/poster_bg_2.png"),
        withBasePath("/pnl/poster_bg_3.png"),
        withBasePath("/pnl/poster_bg_4.png"),
      ];
    }
    
    const customPosters: string[] = [];
    for (let i = 1; i <= customPnLCount; i++) {
      customPosters.push(withBasePath(`/pnl/poster_bg_${i}.webp`));
    }
    
    return customPosters;
  }
  
  return [
    withBasePath("/pnl/poster_bg_1.png"),
    withBasePath("/pnl/poster_bg_2.png"),
    withBasePath("/pnl/poster_bg_3.png"),
    withBasePath("/pnl/poster_bg_4.png"),
  ];
};

const getBottomNavIcon = (menuName: string) => {
  switch (menuName) {
    case "Trading":
      return { activeIcon: <TradingActiveIcon />, inactiveIcon: <TradingInactiveIcon /> };
    case "Portfolio":
      return { activeIcon: <PortfolioActiveIcon />, inactiveIcon: <PortfolioInactiveIcon /> };
    case "Leaderboard":
      return { activeIcon: <LeaderboardActiveIcon />, inactiveIcon: <LeaderboardInactiveIcon /> };
    case "Markets":
      return { activeIcon: <MarketsActiveIcon />, inactiveIcon: <MarketsInactiveIcon /> };
    default:
      throw new Error(`Unsupported menu name: ${menuName}`);
  }
};

const getColorConfig = (): ColorConfigInterface | undefined => {
  const customColorConfigEnv = import.meta.env.VITE_TRADING_VIEW_COLOR_CONFIG;
  
  if (!customColorConfigEnv || typeof customColorConfigEnv !== 'string' || customColorConfigEnv.trim() === '') {
    return undefined;
  }
  
  try {
    const customColorConfig = JSON.parse(customColorConfigEnv);
    return customColorConfig;
  } catch (e) {
    console.warn("Error parsing VITE_TRADING_VIEW_COLOR_CONFIG:", e);
    return undefined;
  }
};

export const useOrderlyConfig = () => {
  const { t } = useTranslation();

  return useMemo<OrderlyConfig>(() => {
    const enabledMenus = getEnabledMenus();
    const customMenus = getCustomMenuItems();
    
    const translatedEnabledMenus = enabledMenus.map(menu => ({
      name: t(menu.translationKey),
      href: menu.href,
    }));
    
    const allMenuItems = [...translatedEnabledMenus, ...customMenus];
    
    const supportedBottomNavMenus = ["Trading", "Portfolio", "Markets", "Leaderboard"];
    const bottomNavMenus = enabledMenus
      .filter(menu => supportedBottomNavMenus.includes(menu.name))
      .map(menu => {
        const icons = getBottomNavIcon(menu.name);
        return {
          name: t(menu.translationKey),
          href: menu.href,
          ...icons
        };
      })
      .filter(menu => menu.activeIcon && menu.inactiveIcon);

    const mainNavProps: MainNavWidgetProps = {
      initialMenu: "/",
      mainMenus: allMenuItems,
    };

    if (import.meta.env.VITE_ENABLE_CAMPAIGNS === "true") {
      mainNavProps.campaigns = {
        name: "$ORDER",
        href: "/rewards",
        children: [
          {
            name: t("common.tradingRewards"),
            href: "https://app.orderly.network/tradingRewards",
            description: t("extend.tradingRewards.description"),
            icon: <OrderlyIcon size={14} />,
            activeIcon: <OrderlyActiveIcon size={14} />,
            target: "_blank",
          },
          {
            name: t("extend.staking"),
            href: "https://app.orderly.network/staking",
            description: t("extend.staking.description"),
            icon: <OrderlyIcon size={14} />,
            activeIcon: <OrderlyActiveIcon size={14} />,
            target: "_blank",
          },
        ],
      };
    }

    return {
      scaffold: {
        mainNavProps,
        bottomNavProps: {
          mainMenus: bottomNavMenus,
        },
        footerProps: {
          telegramUrl: import.meta.env.VITE_TELEGRAM_URL || undefined,
          discordUrl: import.meta.env.VITE_DISCORD_URL || undefined,
          twitterUrl: import.meta.env.VITE_TWITTER_URL || undefined,
          trailing: <span className="oui-text-2xs oui-text-base-contrast-54">Charts powered by <a href="https://tradingview.com" target="_blank" rel="noopener noreferrer">TradingView</a></span>
        },
      },
      orderlyAppProvider: {
        appIcons: {
          main:
            import.meta.env.VITE_HAS_PRIMARY_LOGO === "true"
              ? { component: <img src={withBasePath("/logo.webp")} alt="logo" style={{ height: "42px" }} /> }
              : { img: withBasePath("/orderly-logo.svg") },
          secondary: {
            img: import.meta.env.VITE_HAS_SECONDARY_LOGO === "true"
              ? withBasePath("/logo-secondary.webp")
              : withBasePath("/orderly-logo-secondary.svg"),
          },
        },
      },
      tradingPage: {
        tradingViewConfig: {
          scriptSRC: withBasePath("/tradingview/charting_library/charting_library.js"),
          library_path: withBasePath("/tradingview/charting_library/"),
          customCssUrl: withBasePath("/tradingview/chart.css"),
          colorConfig: getColorConfig(),
        },
        sharePnLConfig: {
          backgroundImages: getPnLBackgroundImages(),
          color: "rgba(255, 255, 255, 0.98)",
          profitColor: "rgba(41, 223, 169, 1)",
          lossColor: "rgba(245, 97, 139, 1)",
          brandColor: "rgba(255, 255, 255, 0.98)",
          // ref
          refLink: typeof window !== 'undefined' ? window.location.origin : undefined,
          refSlogan: import.meta.env.VITE_ORDERLY_BROKER_NAME || "Orderly Network",
        },
      },
    };
  }, [t]);
};
