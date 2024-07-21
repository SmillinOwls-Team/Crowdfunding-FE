import { Typography } from "antd";

export interface IConnectWalletGuideProps {}

export default function ConnectWalletGuide(_props: IConnectWalletGuideProps) {
    return (
        <div
            className="single-column-layout__main__item--grow"
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "1rem",
                marginBlock: "1rem",
            }}
        >
            <div style={{ height: "30vh" }}>
                <img src="/svg/undraw_cancel.svg" alt="page-not-found" style={{ width: "100%", height: "100%" }} />
            </div>

            <Typography.Title level={1}>Your wallet is not connected</Typography.Title>
            <Typography.Text style={{ fontSize: "1rem" }}>
                Please click Connect Wallet button to connect to your wallet
            </Typography.Text>
        </div>
    );
}
