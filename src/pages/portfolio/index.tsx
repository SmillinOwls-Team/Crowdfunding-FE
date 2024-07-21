import { Avatar, Card, Space, Table, Tooltip, Typography, theme } from "antd";
import { ColumnsType } from "antd/es/table";
import { BigNumber, utils } from "ethers";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConnectWalletGuide from "../../components/connect-wallet-guide";
import EthSvg from "../../components/svg-components/eth-svg";
import { useSmartContract } from "../../contexts/smart-contract";
import { formatNumberStrWithCommas } from "../../utils/common-utils";
import { inferStatusBannerVariantV2, prepareVariantStyle } from "../../utils/project-card";
import "./style.scss";

export interface IPortfolioPageProps {}

interface IProjectTableRecord {
    id: number;
    owner: string;
    slug: string;
    name: string;
    shortDescription: string;
    logoUrl: string;
    totalRaise: BigNumber;
    maxAllocation: BigNumber;
    tokenSymbol: string;
    tokenSwapRaito: string;
    createdAt: Date;
    opensAt: Date;
    endsAt: Date;
    currentRaise: BigNumber;
    totalParticipants: number;
    status: string;
}

export default function PortfolioPage(_props: IPortfolioPageProps) {
    const { address, contract } = useSmartContract();
    const { token } = theme.useToken();
    const navigate = useNavigate();

    const [projectsList, setProjectsList] = useState<IProjectTableRecord[]>([]);
    const [isProjectLoading, setIsProjectLoading] = useState(true);

    const columns: ColumnsType<IProjectTableRecord> = [
        {
            title: "Project name",
            dataIndex: "name",
            key: "name",
            render: (_, record) => {
                return (
                    <Space direction="horizontal" align="center" size={12} className="">
                        <Avatar size={32} src={record.logoUrl} />
                        <Space direction="vertical" align="start" className="project-table-row-name" size={0}>
                            <Typography.Text className="project-table-row-text">{record.name}</Typography.Text>
                            <Typography.Text className="project-table-row-text project-table-row-text-mute">
                                {record.tokenSymbol}
                            </Typography.Text>
                        </Space>
                    </Space>
                );
            },
        },
        {
            title: "Participants",
            dataIndex: "totalParticipants",
            key: "totalParticipants",
            align: "right",
            render: (_, record) => {
                return (
                    <Typography.Text className="project-table-row-text">
                        {record.totalParticipants.toString()}
                    </Typography.Text>
                );
            },
        },
        {
            title: "Total raised",
            dataIndex: "totalRaise",
            align: "right",
            key: "totalRaise",
            render: (_, record) => {
                return (
                    <Typography.Text className="project-table-row-text">
                        {record.currentRaise.gt(0) ? utils.formatEther(record.currentRaise).concat(" ETH") : "0 ETH"}
                    </Typography.Text>
                );
            },
        },
        {
            title: "Swap raito",
            dataIndex: "tokenSwapRaito",
            align: "right",
            key: "tokenSwapRaito",
            render: (_, record) => {
                return (
                    <Typography.Text className="project-table-row-text">
                        {record.tokenSwapRaito
                            ? `1 ETH = ${formatNumberStrWithCommas(record.tokenSwapRaito)} ${record.tokenSymbol}`
                            : "TBA"}
                    </Typography.Text>
                );
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "right",
            render: (_, record) => {
                const bannerVariant = inferStatusBannerVariantV2({
                    startDate: record.opensAt || new Date(),
                    endDate: record.endsAt || new Date(),
                });
                const bannerStyle = prepareVariantStyle(bannerVariant, token);

                return (
                    <div className="project-table-row-status" style={{ backgroundColor: bannerStyle.backgroundColor }}>
                        <Typography.Text
                            ellipsis
                            style={{ color: bannerStyle.color }}
                            className="project-table-row-status-text"
                        >
                            {bannerVariant}
                        </Typography.Text>
                    </div>
                );
            },
        },
        {
            title: "Ends at",
            dataIndex: "endsAt",
            key: "endsAt",
            align: "right",
            render: (_, record) => {
                const dateString = moment(record.endsAt).format("MMMM Do YYYY");
                const timeString = moment(record.endsAt).format("h:mm:ss AZ");

                return (
                    <Space direction="vertical" align="end" className="project-table-row-name" size={0}>
                        <Typography.Text className="project-table-row-text">{dateString}</Typography.Text>
                        <Typography.Text className="project-table-row-text project-table-row-text-mute">
                            {timeString}
                        </Typography.Text>
                    </Space>
                );
            },
        },
        {
            title: "Chain",
            key: "chain",
            align: "right",
            render: (_) => (
                <Tooltip title="Ethereum">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "end",
                        }}
                    >
                        <EthSvg width="32px" height="32px" />
                    </div>
                </Tooltip>
            ),
        },
    ];

    const fetchMyProjectList = async () => {
        try {
            const result = await contract.call("getProjectList");
            setIsProjectLoading(false);

            const mappedResult: IProjectTableRecord[] = result.map((item: any) => {
                return {
                    id: item.id.toNumber(),
                    owner: item.owner,
                    slug: item.slug,
                    name: item.name,
                    shortDescription: item.shortDescription,
                    logoUrl: item.logoUrl,
                    totalRaise: item.allocation.totalRaise,
                    maxAllocation: item.allocation.maxAllocation,
                    tokenSymbol: item.tokenInformation.symbol,
                    tokenSwapRaito: item.tokenInformation.swapRaito,
                    createdAt: new Date(item.schedule.createdAt.toNumber()),
                    totalParticipants: item.totalParticipants,
                    opensAt: new Date(item.schedule.opensAt.toNumber()),
                    endsAt: new Date(item.schedule.endsAt.toNumber()),
                    currentRaise: item.currentRaise,
                    status: raisingStatus(item.currentRaise, item.allocation.totalRaise),
                } as IProjectTableRecord;
            });

            setProjectsList(mappedResult);
        } catch (error) {
            setIsProjectLoading(false);
            console.log(error);
        }
    };

    useEffect(() => {
        if (!contract) {
            return;
        }

        fetchMyProjectList();
    }, [contract, address]);

    if (!address) {
        return <ConnectWalletGuide />;
    }

    const myProjectList = projectsList.filter((item) => item.owner === address);

    return (
        <Card title={<Typography.Title level={2}>Your projects</Typography.Title>}>
            <Space direction="vertical" style={{ width: "100%" }} size={32}>
                <Table
                    className="project-table"
                    size="large"
                    rowKey={"slug"}
                    columns={columns}
                    dataSource={myProjectList}
                    pagination={{ position: ["bottomCenter"], pageSize: 10 }}
                    loading={isProjectLoading}
                    onRow={(record, _) => {
                        return {
                            style: { cursor: "pointer" },
                            onClick: () => navigate(`/explore/${record.slug}`),
                        };
                    }}
                />
            </Space>
        </Card>
    );
}

function raisingStatus(currentRaiseInWei: BigNumber, totalRaise: BigNumber): string {
    const totalRaiseInWei = utils.parseEther(totalRaise.toString());
    if (currentRaiseInWei.gte(totalRaiseInWei)) {
        return "complete";
    }

    if (currentRaiseInWei.gt(0)) {
        return "funding";
    }

    return "open";
}
