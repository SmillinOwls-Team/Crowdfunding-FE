import { Card, Space, Typography } from "antd";
import "./styles.scss";

export interface ITokenInformationData {
    symbol: string;
    swapRaito: string;
}

export interface IProjectTokenInformationProps {
    data: ITokenInformationData;
}

export default function ProjectTokenInformation(props: IProjectTokenInformationProps) {
    const { data } = props;

    return (
        <Space style={{ width: "100%" }} direction="vertical" size={0} className="token-infor-container">
            <Card className="token-infor-item-head">Token Information</Card>

            <Card className="token-infor-item">
                <Space direction="horizontal" align="center" style={{ width: "100%", justifyContent: "space-between" }}>
                    <Typography.Text className="token-infor-item-title">Token Symbol</Typography.Text>
                    <Typography.Text className="token-infor-item-value">{data.symbol || "TBA"}</Typography.Text>
                </Space>
            </Card>

            <Card className="token-infor-item">
                <Space direction="horizontal" align="center" style={{ width: "100%", justifyContent: "space-between" }}>
                    <Typography.Text className="token-infor-item-title">Swap Raito</Typography.Text>
                    <Typography.Text className="token-infor-item-value">
                        1 ETH = {data.swapRaito && data.symbol ? `${data.swapRaito} ${data.symbol}` : "TBA"}
                    </Typography.Text>
                </Space>
            </Card>
        </Space>
    );
}
