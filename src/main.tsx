import { StyleProvider } from "@ant-design/cssinjs";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ConfigProvider } from "antd";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./assets/index.scss";
import ScrollTopButton from "./components/buttons/scroll-top";
import { APP_CHAINS, APP_CONFIGS } from "./configs";
import { routes } from "./constants/routes";
import { customizedTheme } from "./constants/theme";
import { AntMessageProvider } from "./contexts/ant-mesage";
import { BlockUIProvider } from "./contexts/block-ui";
import { SmartContractProvider } from "./contexts/smart-contract";

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <StyleProvider hashPriority="high">
            <ConfigProvider theme={customizedTheme}>
                <BlockUIProvider>
                    <AntMessageProvider>
                        <ThirdwebProvider
                            clientId={APP_CONFIGS.thirdwebClientId}
                            activeChain={APP_CHAINS[APP_CONFIGS.activeChain]}
                            dAppMeta={{
                                name: APP_CONFIGS.appName,
                                url: APP_CONFIGS.appUrl,
                                isDarkMode: false,
                            }}
                        >
                            <SmartContractProvider>
                                <RouterProvider router={router} />
                                <ScrollTopButton />
                            </SmartContractProvider>
                        </ThirdwebProvider>
                    </AntMessageProvider>
                </BlockUIProvider>
            </ConfigProvider>
        </StyleProvider>
    </React.StrictMode>
);
