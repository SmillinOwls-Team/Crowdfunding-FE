import { Sepolia, Chain, Localhost } from "@thirdweb-dev/chains";

export const APP_CONFIGS: Record<string,string> = {
    appName: import.meta.env.VIET_APP_NAME || "",
    thirdwebClientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || "",
    contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS || "",
    activeChain: import.meta.env.VITE_ACTIVE_CHAIN || "localhost",
    appUrl: import.meta.env.VITE_APP_URL || "",
    apiUrl: import.meta.env.VITE_API_URL || "",
};

export const APP_CHAINS: Record<string, Chain> = {
    localhost: Localhost,
    sepolia: Sepolia,
};
