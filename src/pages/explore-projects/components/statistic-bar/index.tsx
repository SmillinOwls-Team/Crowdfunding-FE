import { Col, Row, Space, Typography } from "antd";
import { BigNumber, utils } from "ethers";
import { formatNumberStrWithCommas } from "../../../../utils/common-utils";
import StatisticCard from "../statistic-card";
import FundedProjectsIcon from "../statistic-card-icon/funded-projects";
import IconWrapper from "../statistic-card-icon/icon-wrapper";
import RaisedCapital from "../statistic-card-icon/raised-capital";
import UniqueParticipants from "../statistic-card-icon/unique-participants";

export interface IStatisticData {
    totalProjects: BigNumber;
    uniqueParticipants: BigNumber;
    totalRaised: BigNumber;
}

export interface IStatisticBarProps {
    data: IStatisticData;
    isLoading: boolean;
}

export default function StatisticBar(props: IStatisticBarProps) {
    const { data, isLoading } = props;

    return (
        <Row gutter={[8, 24]} align={"middle"}>
            <Col xxl={9} xl={9} lg={9} md={24} xs={24}>
                <Space align="center" direction="vertical">
                    <Typography>
                        <Typography.Title level={2} style={{ fontWeight: "bolder", margin: 0 }}>
                            Funded Projects
                        </Typography.Title>

                        <Typography.Title type="secondary" level={4} style={{ margin: 0 }}>
                            We bring new technologies to our community
                        </Typography.Title>
                    </Typography>
                </Space>
            </Col>

            <Col xxl={15} xl={15} lg={15} md={24} xs={24}>
                <Row gutter={[8, 8]}>
                    <Col xxl={8} xl={8} lg={8} md={8} xs={24}>
                        <StatisticCard
                            label="Funded Projects"
                            value={data.totalProjects.toString()}
                            iconComponent={
                                <IconWrapper
                                    color="rgb(245, 158, 11)"
                                    backgroundColor="rgba(245, 158, 11, 0.16)"
                                    icon={<FundedProjectsIcon />}
                                />
                            }
                            textColor="rgb(245, 158, 11)"
                            formatters={[formatNumberStrWithCommas]}
                            loading={isLoading}
                        />
                    </Col>

                    <Col xxl={8} xl={8} lg={8} md={8} xs={24}>
                        <StatisticCard
                            label="Unique Participants"
                            value={data.uniqueParticipants.toString()}
                            iconComponent={
                                <IconWrapper
                                    color="rgb(33, 188, 201)"
                                    backgroundColor="rgba(33, 188, 201, 0.16)"
                                    icon={<UniqueParticipants />}
                                />
                            }
                            textColor="rgb(33, 188, 201)"
                            formatters={[formatNumberStrWithCommas]}
                            loading={isLoading}
                        />
                    </Col>

                    <Col xxl={8} xl={8} lg={8} md={8} xs={24}>
                        <StatisticCard
                            label="Raised Capital"
                            value={utils.formatEther(data.totalRaised)}
                            iconComponent={
                                <IconWrapper
                                    color="rgb(71, 98, 225)"
                                    backgroundColor="rgba(71, 98, 225, 0.16)"
                                    icon={<RaisedCapital />}
                                />
                            }
                            textColor="rgb(71, 98, 225)"
                            formatters={[formatNumberStrWithCommas, (str) => `${str} ETH`]}
                            loading={isLoading}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}
