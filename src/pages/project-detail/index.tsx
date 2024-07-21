import {
    Avatar,
    Breadcrumb,
    Button,
    Card,
    Col,
    Modal,
    Progress,
    Row,
    Skeleton,
    Space,
    Tabs,
    Tooltip,
    Typography,
    theme,
} from "antd";
import { BigNumber, utils } from "ethers";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EthSvg from "../../components/svg-components/eth-svg";
import { STATUS_BANNER_VARIANT } from "../../constants/project-card";
import { useAntMessage } from "../../contexts/ant-mesage";
import { useBlockUI } from "../../contexts/block-ui";
import { useSmartContract } from "../../contexts/smart-contract";
import { formatNumberStrWithCommas } from "../../utils/common-utils";
import { inferStatusBannerVariantV2, prepareVariantStyle } from "../../utils/project-card";
import CoverItem from "./components/cover-item";
import { ProjectDescription } from "./components/project-description";
import ProjectSchedule from "./components/project-schedule";
import ProjectTokenInformation from "./components/project-token-information";
import StakeModal from "./components/stake-modal";
import "./styles.scss";

export interface IProjectDetailPageProps {}

interface IProjectDetail {
    id: number;
    owner: string;
    slug: string;
    name: string;
    shortDescription: string;
    description: string;
    logoUrl: string;
    projectBanner: string;
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

export default function ProjectDetailPage(_props: IProjectDetailPageProps) {
    const { projectSlug } = useParams();
    const { contract } = useSmartContract();
    const { token: themeToken } = theme.useToken();
    const { address } = useSmartContract();
    const { blockUI, unblockUI } = useBlockUI();
    const antMessage = useAntMessage();

    const [modal, contextHolder] = Modal.useModal();

    const [project, setProject] = useState<IProjectDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [stakeModal, setStakeModal] = useState({ show: false });

    const fetchProject = async () => {
        try {
            const result = await contract.call("getProjectDetail", [projectSlug]);
            setIsLoading(false);

            const mappedResult: IProjectDetail = {
                id: result.id.toNumber(),
                owner: result.owner,
                slug: result.slug,
                name: result.name,
                shortDescription: result.shortDescription,
                description: result.description,
                logoUrl: result.logoUrl,
                projectBanner: result.coverBackgroundUrl,
                totalRaise: result.allocation.totalRaise,
                maxAllocation: result.allocation.maxAllocation,
                tokenSymbol: result.tokenInformation.symbol,
                tokenSwapRaito: result.tokenInformation.swapRaito,
                createdAt: new Date(result.schedule.createdAt.toNumber()),
                opensAt: new Date(result.schedule.opensAt.toNumber()),
                endsAt: new Date(result.schedule.endsAt.toNumber()),
                totalParticipants: result.totalParticipants.toNumber(),
                currentRaise: result.currentRaise,
                status: raisingStatus(result.currentRaise, result.allocation.totalRaise),
            };

            setProject(mappedResult);

            // if (address) {
            //     getStakedMoney();
            // }
        } catch (error: any) {
            setIsLoading(false);
            console.log(error);
            modal.error({
                title: "Project not found",
                centered: true,
                footer: [
                    <Space key={"explore-btn"} style={{ width: "100%", justifyContent: "center" }}>
                        <Link to="/explore">
                            <Button type="primary">Explore more project</Button>
                        </Link>
                    </Space>,
                ],
            });
        }
    };

    // const getStakedMoney = async () => {
    //     try {
    //         const result = await contract.call("getProjectStakingByInvestor", [project?.id]);
    //         console.log(result);
    //     } catch (error: any) {
    //         if (error.reason === "staking_not_found") {

    //         }
    //     }
    // };

    const handleConfirmStake = async (value: number) => {
        try {
            blockUI("Transaction is in progress, please wait ...");
            await contract!.call("stakingInProject", [project?.id || 0], {
                value: utils.parseEther(value.toString()),
            });
            unblockUI();

            setStakeModal({ ...stakeModal, show: false });
            antMessage.success("Transaction completed", 4);

            // update card UI
            fetchProject();
        } catch (error: any) {
            unblockUI();
            const reason = error.reason;
            antMessage.error(getStakeErrorMessage(reason), 4);
        }
    };

    useEffect(() => {
        if (!contract) {
            return;
        }

        fetchProject();
    }, [projectSlug, contract, address]);

    const projectLoaded = !isLoading && project;

    const bannerVariant = inferStatusBannerVariantV2({
        startDate: project?.opensAt || new Date(),
        endDate: project?.endsAt || new Date(),
    });
    const bannerStyle = prepareVariantStyle(bannerVariant, themeToken);

    return (
        <>
            <Space direction="vertical" style={{ width: "100%" }} size={24} className="project-detail-container">
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: <Link to={"/explore"}>Projects</Link>,
                        },
                        {
                            title: project?.name,
                        },
                    ]}
                />
                <Space direction="horizontal" align="center" size={32} className="project-detail-top">
                    {!projectLoaded && (
                        <>
                            <Skeleton.Avatar active shape="circle" size={"large"} />
                            <Space direction="vertical" align="start" className="projet-detail-top-general">
                                <Skeleton active paragraph={{ rows: 1 }} />
                            </Space>
                        </>
                    )}
                    {projectLoaded && (
                        <>
                            <Avatar size={96} src={project.logoUrl} />
                            <Space direction="vertical" align="start" className="projet-detail-top-general">
                                <Typography.Title level={1}>{project.name}</Typography.Title>
                                <Typography.Text ellipsis>{project.shortDescription}</Typography.Text>
                            </Space>
                        </>
                    )}
                </Space>
                <Row gutter={[{ lg: 16 }, 16]} className="project-detail-content">
                    <Col xs={24} lg={16}>
                        {!projectLoaded && <Skeleton.Input active block size="large" />}
                        {projectLoaded && <CoverItem src={project.projectBanner} />}
                    </Col>
                    <Col xs={24} lg={8}>
                        <Card bordered>
                            {!projectLoaded && <Skeleton active />}
                            {projectLoaded && (
                                <>
                                    {" "}
                                    <Card.Meta
                                        description={
                                            <Space direction="vertical" size={8} style={{ width: "100%" }}>
                                                <Space
                                                    direction="horizontal"
                                                    align="start"
                                                    size={32}
                                                    className="project-detail-content-general"
                                                >
                                                    <Space
                                                        direction="vertical"
                                                        align="start"
                                                        className="project-detail-content-title"
                                                        size={projectLoaded ? 0 : 1}
                                                        style={{ width: "100%" }}
                                                    >
                                                        {project.status === "open" && (
                                                            <>
                                                                <Typography.Text className="project-detail-content-meta">
                                                                    Target
                                                                </Typography.Text>
                                                                <Typography.Text className="project-detail-content-allocation">
                                                                    {formatNumberStrWithCommas(
                                                                        utils.formatEther(project.totalRaise)
                                                                    )}{" "}
                                                                    ETH
                                                                </Typography.Text>
                                                            </>
                                                        )}
                                                        {project.status === "funding" && (
                                                            <>
                                                                <Typography.Text className="project-detail-content-meta">
                                                                    Total Raised
                                                                </Typography.Text>
                                                                <Typography.Text className="project-detail-content-allocation">
                                                                    {formatNumberStrWithCommas(
                                                                        utils.formatEther(project.currentRaise)
                                                                    )}{" "}
                                                                    ETH
                                                                </Typography.Text>
                                                            </>
                                                        )}
                                                        {project.status === "complete" && (
                                                            <>
                                                                <Typography.Text className="project-detail-content-allocation">
                                                                    {formatNumberStrWithCommas(
                                                                        utils.formatEther(project.currentRaise)
                                                                    )}{" "}
                                                                    ETH
                                                                </Typography.Text>
                                                                <Typography.Text className="project-detail-content-meta">
                                                                    Target reached
                                                                </Typography.Text>
                                                            </>
                                                        )}
                                                    </Space>
                                                    <Tooltip title="Ethereum">
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                marginLeft: "2px",
                                                            }}
                                                        >
                                                            <EthSvg width="40px" height="40px" />
                                                        </div>
                                                    </Tooltip>
                                                </Space>

                                                <TooltipProgress
                                                    value={parseFloat(
                                                        project.currentRaise.mul(100).div(project.totalRaise).toString()
                                                    )}
                                                />

                                                <Space direction="vertical" className="project-detail-content-info">
                                                    {project.status === "funding" && (
                                                        <Space
                                                            direction="horizontal"
                                                            align="baseline"
                                                            className="project-detail-content-info-title"
                                                        >
                                                            <Typography.Text>Target</Typography.Text>
                                                            <hr />
                                                            <Typography.Text>
                                                                {formatNumberStrWithCommas(
                                                                    utils.formatEther(project.totalRaise)
                                                                )}{" "}
                                                                ETH
                                                            </Typography.Text>
                                                        </Space>
                                                    )}

                                                    <Space
                                                        direction="horizontal"
                                                        align="baseline"
                                                        className="project-detail-content-info-title"
                                                    >
                                                        <Typography.Text>Max Allocation</Typography.Text>
                                                        <hr />
                                                        <Typography.Text>
                                                            {formatNumberStrWithCommas(
                                                                utils.formatEther(project.maxAllocation)
                                                            )}{" "}
                                                            ETH
                                                        </Typography.Text>
                                                    </Space>

                                                    <Space
                                                        direction="horizontal"
                                                        align="baseline"
                                                        className="project-detail-content-info-title"
                                                    >
                                                        <Typography.Text>Investors</Typography.Text>
                                                        <hr />
                                                        <Typography.Text>{project.totalParticipants}</Typography.Text>
                                                    </Space>

                                                    <Space
                                                        direction="horizontal"
                                                        align="baseline"
                                                        className="project-detail-content-info-title"
                                                    >
                                                        <Typography.Text>Token Symbol</Typography.Text>
                                                        <hr />
                                                        <Typography.Text>
                                                            {project.tokenSymbol || "TBA"}
                                                        </Typography.Text>
                                                    </Space>
                                                </Space>

                                                {address &&
                                                    project.status !== "complete" &&
                                                    address !== project.owner &&
                                                    bannerVariant === STATUS_BANNER_VARIANT.FUNDING && (
                                                        <Button
                                                            type="primary"
                                                            block
                                                            size="large"
                                                            style={{
                                                                fontWeight: "600",
                                                            }}
                                                            onClick={() => setStakeModal({ show: true })}
                                                        >
                                                            Stake Money
                                                        </Button>
                                                    )}
                                            </Space>
                                        }
                                        style={{
                                            marginBottom: themeToken.paddingLG + 6,
                                        }}
                                    />
                                    <div
                                        className="project-detail-content-status"
                                        style={{
                                            height: themeToken.paddingLG + 6,
                                            maxHeight: themeToken.paddingLG + 6,
                                            borderRadius: `0 0 ${themeToken.borderRadiusLG}px ${themeToken.borderRadiusLG}px`,
                                            paddingInline: themeToken.paddingLG,
                                            backgroundColor: bannerStyle.backgroundColor,
                                        }}
                                    >
                                        <Typography.Text strong ellipsis style={{ color: bannerStyle.color }}>
                                            {bannerVariant}
                                        </Typography.Text>
                                    </div>
                                </>
                            )}
                        </Card>
                    </Col>
                </Row>
                <Row gutter={[{ lg: 40 }, 16]} className="project-detail-content">
                    <Col xs={24} lg={16}>
                        {!projectLoaded && <Skeleton active paragraph={{ rows: 5 }} />}
                        {projectLoaded && (
                            <Tabs
                                size="large"
                                defaultActiveKey="project-description"
                                items={[
                                    {
                                        key: "project-description",
                                        label: "Description",
                                        children: <ProjectDescription content={project.description} />,
                                    },
                                    {
                                        key: "token-information",
                                        label: "Token Information",
                                        children: (
                                            <ProjectTokenInformation
                                                data={{
                                                    swapRaito: project.tokenSwapRaito,
                                                    symbol: project.tokenSymbol,
                                                }}
                                            />
                                        ),
                                    },
                                    {
                                        key: "project-schedule",
                                        label: "Schedule",
                                        children: (
                                            <ProjectSchedule
                                                data={{
                                                    startDate: moment(project.opensAt).format("MMMM Do YYYY h:mm:ss AZ"),
                                                    endDate: moment(project.endsAt).format("MMMM Do YYYY h:mm:ss AZ"),
                                                }}
                                            />
                                        ),
                                    },
                                ]}
                            />
                        )}
                    </Col>
                </Row>
            </Space>

            <StakeModal
                show={stakeModal.show}
                title={"Stake in project"}
                maxAllocation={project?.maxAllocation}
                currentRaise={project?.currentRaise}
                onConfirm={handleConfirmStake}
                onCancel={() => setStakeModal({ ...stakeModal, show: false })}
            />
            {contextHolder}
        </>
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

function getStakeErrorMessage(reason: string): string {
    switch (reason) {
        case "project_owner":
            return "Onwer cannot stake";
        case "staking_not_open":
            return "Funding period is not opened";
        case "target_reached":
            return "Target has reached";
        case "not_enough":
            return "Please stake more money";
        case "max_allocation":
            return "You have reached max allocation";
        case "too_much":
            return "You have staked too much";
        default:
            return "Transaction failed, please try again later!";
    }
}

const TooltipProgress = ({ value }: { value: number }) => {
    return (
        <Tooltip title={value + "%"}>
            <Progress showInfo={false} percent={value} strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }} />
        </Tooltip>
    );
};
