import { ReactNode, useCallback, lazy, Suspense, useState, useEffect } from "react";
import { OrderlyAppProvider } from "@orderly.network/react-app";
import config from "@/utils/config";
import type { NetworkId } from "@orderly.network/types";

const NETWORK_ID_KEY = "orderly_network_id";

const getNetworkId = (): NetworkId => {
	if (typeof window === "undefined") return "mainnet";
	
	const disableMainnet = import.meta.env.VITE_DISABLE_MAINNET === 'true';
	const disableTestnet = import.meta.env.VITE_DISABLE_TESTNET === 'true';
	
	if (disableMainnet && !disableTestnet) {
		return "testnet";
	}
	
	if (disableTestnet && !disableMainnet) {
		return "mainnet";
	}
	
	return (localStorage.getItem(NETWORK_ID_KEY) as NetworkId) || "mainnet";
};

const setNetworkId = (networkId: NetworkId) => {
	if (typeof window !== "undefined") {
		localStorage.setItem(NETWORK_ID_KEY, networkId);
	}
};

const PrivyConnector = lazy(() => import("@/components/orderlyProvider/privyConnector"));
const WalletConnector = lazy(() => import("@/components/orderlyProvider/walletConnector"));

const LoadingSpinner = () => (
	<div className="loading-container">
		<div className="loading-spinner"></div>
		<style>
			{`
				.loading-container {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 100%;
					height: 100vh;
					background-color: rgba(0, 0, 0, 0.03);
				}
				.loading-spinner {
					width: 50px;
					height: 50px;
					border: 4px solid rgba(0, 0, 0, 0.1);
					border-radius: 50%;
					border-left-color: #09f;
					animation: spin 1s linear infinite;
				}
				@keyframes spin {
					0% {
						transform: rotate(0deg);
					}
					100% {
						transform: rotate(360deg);
					}
				}
			`}
		</style>
	</div>
);

const OrderlyProvider = (props: { children: ReactNode }) => {
	const networkId = getNetworkId();
	const [isClient, setIsClient] = useState(false);
	
	const privyAppId = import.meta.env.VITE_PRIVY_APP_ID;
	const usePrivy = !!privyAppId;

	const parseChainIds = (envVar: string | undefined): Array<{id: number}> | undefined => {
		if (!envVar) return undefined;
		return envVar.split(',')
			.map(id => id.trim())
			.filter(id => id)
			.map(id => ({ id: parseInt(id, 10) }))
			.filter(chain => !isNaN(chain.id));
	};

	const disableMainnet = import.meta.env.VITE_DISABLE_MAINNET === 'true';
	const mainnetChains = disableMainnet ? [] : parseChainIds(import.meta.env.VITE_ORDERLY_MAINNET_CHAINS);
	const disableTestnet = import.meta.env.VITE_DISABLE_TESTNET === 'true';
	const testnetChains = disableTestnet ? [] : parseChainIds(import.meta.env.VITE_ORDERLY_TESTNET_CHAINS);

	const chainFilter = (mainnetChains || testnetChains) ? {
		...(mainnetChains && { mainnet: mainnetChains }),
		...(testnetChains && { testnet: testnetChains })
	} : undefined;

	// Handle client-side only rendering
	useEffect(() => {
		setIsClient(true);
	}, []);

	const onChainChanged = useCallback(
		(_chainId: number, {isTestnet}: {isTestnet: boolean}) => {
			const currentNetworkId = getNetworkId();
			// If network type has changed (testnet vs mainnet)
			if ((isTestnet && currentNetworkId === 'mainnet') || (!isTestnet && currentNetworkId === 'testnet')) {
				const newNetworkId: NetworkId = isTestnet ? 'testnet' : 'mainnet';
				setNetworkId(newNetworkId);
				
				setTimeout(() => {
					window.location.reload();
				}, 100);
			}
		},
		[]
	);

	const appProvider = (
		<OrderlyAppProvider
			brokerId={import.meta.env.VITE_ORDERLY_BROKER_ID}
			brokerName={import.meta.env.VITE_ORDERLY_BROKER_NAME}
			networkId={networkId}
			onChainChanged={onChainChanged}
			appIcons={config.orderlyAppProvider.appIcons}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			{...(chainFilter && { chainFilter } as any)}
		>
			{props.children}
		</OrderlyAppProvider>
	);

	if (!isClient) {
		return <LoadingSpinner />;
	}

	return (
		<Suspense fallback={<LoadingSpinner />}>
			{usePrivy
				? <PrivyConnector networkId={networkId}>{appProvider}</PrivyConnector>
				: <WalletConnector networkId={networkId}>{appProvider}</WalletConnector>
			}
		</Suspense>
	);
};

export default OrderlyProvider;
