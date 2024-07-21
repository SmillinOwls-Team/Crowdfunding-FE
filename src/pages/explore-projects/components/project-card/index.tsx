import { Card, Space, Tooltip, Typography, theme } from "antd";
import { BigNumber, utils } from "ethers";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import EthSvg from "../../../../components/svg-components/eth-svg";
import { STATUS_BANNER_VARIANT } from "../../../../constants/project-card";
import { formatNumberStrWithCommas } from "../../../../utils/common-utils";
import { inferStatusBannerVariantV2, prepareVariantStyle } from "../../../../utils/project-card";
import ProjectCardBanner, { IProjectCardBannerProps } from "./components/project-card-banner";
import "./index.scss";

export interface IProjectCardData {
    id: number;
    slug: string;
    name: string;
    shortDescription: string;
    logoUrl: string;
    projectBanner: string;
    goal: BigNumber;
    tokenSymbol: string;
    maxAllocation: BigNumber;
    createdDate: Date;
    startDate: Date;
    endDate: Date;
}

interface IProjectCardProps {
    data: IProjectCardData;
    showStatus?: boolean;
    detailPath?: string;
}

const ICON_SIZE = 88;

export default function ProjectCard(props: IProjectCardProps) {
    const { data, detailPath, showStatus } = props;
    const {
        logoUrl: projectIcon,
        projectBanner,
        name,
        shortDescription,
        tokenSymbol,
        goal,
        maxAllocation,
        endDate,
        startDate,
    } = data;

    const navigate = useNavigate();
    const { token } = theme.useToken();

    const onClick = () => {
        if (detailPath && detailPath !== "") navigate(detailPath);
    };

    const cardTitle = () => {
        return (
            <div style={{ width: "100%", display: "flex" }}>
                <div style={{ width: "calc(100% - 32px)", display: "flex", flexDirection: "column" }}>
                    <Typography.Title level={4} style={{ margin: 0, width: "100%" }} ellipsis>
                        {name}
                    </Typography.Title>
                    <Typography.Text style={{ color: token.colorPrimary, width: "100%" }} ellipsis>
                        {tokenSymbol}
                    </Typography.Text>
                </div>
                <Tooltip title="Ethereum">
                    <div style={{ display: "flex", justifyContent: "center", marginLeft: "2px" }}>
                        <EthSvg width="30px" height="30px" />
                    </div>
                </Tooltip>
            </div>
        );
    };

    const cardDescription = () => {
        return (
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
                <Tooltip title={shortDescription}>
                    <Typography.Text type="secondary" ellipsis>
                        {shortDescription}
                    </Typography.Text>
                </Tooltip>

                <div style={{ display: "flex", gap: "4px" }}>
                    <Typography.Text type="secondary" ellipsis>
                        Target
                    </Typography.Text>
                    <div
                        style={{
                            flex: 1,
                            borderBottom: `1px dotted ${token.colorTextSecondary}`,
                            transform: "translateY(-6px)",
                        }}
                    ></div>
                    <Typography.Text strong>{formatNumberStrWithCommas(utils.formatEther(goal))} ETH</Typography.Text>
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                    <Typography.Text type="secondary" ellipsis>
                        Max Allocation
                    </Typography.Text>
                    <div
                        style={{
                            flex: 1,
                            borderBottom: `1px dotted ${token.colorTextSecondary}`,
                            transform: "translateY(-6px)",
                        }}
                    ></div>
                    <Typography.Text strong>
                        {formatNumberStrWithCommas(utils.formatEther(maxAllocation))} ETH
                    </Typography.Text>
                </div>
            </Space>
        );
    };

    const prepareDateBanner = (variant: STATUS_BANNER_VARIANT): IProjectCardBannerProps["date"] => {
        switch (variant) {
            case STATUS_BANNER_VARIANT.UPCOMING: {
                return {
                    label: "Starts on",
                    value: moment(startDate).format("MMM Do YYYY"),
                };
            }

            case STATUS_BANNER_VARIANT.FUNDING: {
                return {
                    label: "Ends on",
                    value: moment(endDate).format("MMM Do YYYY"),
                };
            }

            // case STATUS_BANNER_VARIANT.TOKEN_CLAIMING: {
            //     return {
            //         label: "Claim before",
            //         value: moment(idoCloseDate).format("MMM Do YYYY"),
            //     };
            // }

            // case STATUS_BANNER_VARIANT.CLOSED: {
            //     return {
            //         label: "Ended on",
            //         value: moment(idoCloseDate).format("MMM Do YYYY"),
            //     };
            // }

            case STATUS_BANNER_VARIANT.FUNDING_CLOSED: {
                return {
                    label: "Ended on",
                    value: moment(endDate).format("MMM Do YYYY"),
                };
            }

            default: {
                return undefined;
            }
        }
    };

    const bannerVariant = inferStatusBannerVariantV2({ startDate, endDate });
    const bannerStyle = prepareVariantStyle(bannerVariant, token);
    const dateBanner = prepareDateBanner(bannerVariant);

    return (
        <Link to={`./${data.slug}`} className="project-card-wrapper">
            <Card
                className="project-card"
                hoverable={true}
                cover={
                    projectBanner &&
                    projectBanner !== "" && (
                        <ProjectCardBanner
                            src={projectBanner}
                            cardIconSrc={projectIcon}
                            cardIconEdgeSize={ICON_SIZE}
                            dateBannerStyle={bannerStyle}
                            date={dateBanner}
                        />
                    )
                }
                onClick={onClick}
            >
                <Card.Meta
                    title={cardTitle()}
                    description={cardDescription()}
                    style={{ marginBottom: showStatus ? token.paddingLG + 6 : undefined, marginTop: ICON_SIZE / 2 - 6 }}
                />
                {showStatus && (
                    <div
                        className="project-card__status-indicator-banner"
                        style={{
                            height: token.paddingLG + 6,
                            maxHeight: token.paddingLG + 6,
                            borderRadius: `0 0 ${token.borderRadiusLG}px ${token.borderRadiusLG}px`,
                            paddingInline: token.paddingLG,
                            backgroundColor: bannerStyle.backgroundColor,
                        }}
                    >
                        <div className="status-indicator-banner__status-indicator">
                            <Typography.Text
                                strong
                                ellipsis
                                style={{ color: bannerStyle.color, textTransform: "uppercase" }}
                            >
                                {bannerVariant}
                            </Typography.Text>
                        </div>
                    </div>
                )}
            </Card>
        </Link>
    );
}
