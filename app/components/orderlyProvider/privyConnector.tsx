import { ReactNode } from 'react';
import { WalletConnectorPrivyProvider, Network } from '@orderly.network/wallet-connector-privy';
import { injected, walletConnect } from 'wagmi/connectors';
import type { NetworkId } from "@orderly.network/types";
import { CreateConnectorFn } from 'wagmi';
import { Adapter, WalletError , WalletAdapterNetwork, WalletNotReadyError } from '@solana/wallet-adapter-base';
import { LedgerWalletAdapter, PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { createDefaultAddressSelector, createDefaultAuthorizationResultCache, SolanaMobileWalletAdapter } from '@solana-mobile/wallet-adapter-mobile';
import { QueryClient } from "@tanstack/query-core";

const PrivyConnector = ({ children, networkId }: {
  children: ReactNode;
  networkId: NetworkId;
}) => {
  const appId = import.meta.env.VITE_PRIVY_APP_ID;
  const termsOfUseUrl = import.meta.env.VITE_PRIVY_TERMS_OF_USE;
  const walletConnectProjectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;
  const enableAbstractWallet = import.meta.env.VITE_ENABLE_ABSTRACT_WALLET === 'true';
  const disableEVMWallets = import.meta.env.VITE_DISABLE_EVM_WALLETS === 'true';
  const disableSolanaWallets = import.meta.env.VITE_DISABLE_SOLANA_WALLETS === 'true';
  const isBrowser = typeof window !== 'undefined';

  const connectors: CreateConnectorFn[] = [injected()];
  if (walletConnectProjectId && isBrowser) {
    connectors.push(
      walletConnect({
        projectId: walletConnectProjectId,
        showQrModal: true,
        metadata: {
          name: import.meta.env.VITE_APP_NAME || 'Orderly App',
          description: import.meta.env.VITE_APP_DESCRIPTION || 'Orderly Application',
          url: window.location.origin,
          icons: [`${window.location.origin}/favicon.webp`]
        }
      })
    );
  }

  return (
    <WalletConnectorPrivyProvider
      network={networkId === 'mainnet' ? Network.mainnet : Network.testnet}
      termsOfUse={termsOfUseUrl}
      wagmiConfig={disableEVMWallets ? undefined : {
        connectors
      }}
      solanaConfig={disableSolanaWallets ? undefined : {
        wallets: [
          new PhantomWalletAdapter(),
          new SolflareWalletAdapter(),
          new LedgerWalletAdapter(),
          new SolanaMobileWalletAdapter({
            addressSelector: createDefaultAddressSelector(),
            appIdentity: {
              uri: `${location.protocol}//${location.host}`,
            },
            authorizationResultCache: createDefaultAuthorizationResultCache(),
            chain: networkId === 'mainnet' ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet,
            onWalletNotFound: (adapter: SolanaMobileWalletAdapter) => {
              console.log('-- mobile wallet adapter', adapter);
              return Promise.reject(new WalletNotReadyError('wallet not ready'));
            },
          }),
        ],
        onError: (error: WalletError, adapter?: Adapter) => {
          console.log("-- error", error, adapter);
        },
      }}
      privyConfig={{
        config: {
          appearance: {
            showWalletLoginFirst: false,
          },
        },
        appid: appId,
      }}
      abstractConfig={enableAbstractWallet ? {
        queryClient: new QueryClient(),
      } : undefined}
    >
      {children}
    </WalletConnectorPrivyProvider>
  );
};

export default PrivyConnector; 