import { Card, Skeleton, Space, Typography } from "antd";
import "./index.scss";

interface IStatisticCardProps {
    label: string;
    value: string;
    iconComponent: JSX.Element;
    textColor?: string;
    formatters?: ((str: string) => string)[];
    loading?: boolean;
}

export default function StatisticCard(props: IStatisticCardProps) {
    const { label, value, iconComponent, textColor, formatters, loading } = props;

    const valueToDisplay = (): string => {

        let strToReturn = value;
        if (!formatters) {
            return strToReturn;
        }

        formatters.forEach((formatter) => (strToReturn = formatter(strToReturn)));

        return strToReturn;
    };

    return (
        <Card className="statistic-card" style={{ borderStyle: "dashed", borderWidth: "2px" }} bordered>
            <Space size="small" style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {iconComponent}

                <Typography>
                    <Typography.Title
                        level={5}
                        style={{
                            marginTop: 0,
                            textAlign: "right",
                            color: textColor,
                        }}
                    >
                        {label}
                    </Typography.Title>
                    {loading ? (
                        <Skeleton paragraph={false} active />
                    ) : (
                        <Typography.Title level={4} style={{ fontWeight: "bolder", margin: 0, textAlign: "right" }}>
                            {valueToDisplay()}
                        </Typography.Title>
                    )}
                </Typography>
            </Space>
        </Card>
    );
}
