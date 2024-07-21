import { LoadingOutlined } from "@ant-design/icons";
import { Col, Input, Pagination, PaginationProps, Row, Space, Typography, theme } from "antd";
import { BigNumber } from "ethers";
import moment from "moment";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useSmartContract } from "../../contexts/smart-contract";
import ProjectCard, { IProjectCardData } from "./components/project-card";
import StatisticBar, { IStatisticData } from "./components/statistic-bar";
import "./index.scss";

export default function ExploreProjects() {
    const searchBarRef = useRef<ElementRef<"div">>(null);
    const debounceFuncRef = useRef<NodeJS.Timeout>();

    const { token } = theme.useToken();
    const { contract } = useSmartContract();

    const [searchStr, setSearchStr] = useState("");
    const [pagination, setPagination] = useState<{
        current: number;
        pageSize: number;
        total: number;
    }>({ current: 1, pageSize: 10, total: 50 });

    const [statistics, setStatistics] = useState<IStatisticData>({
        totalProjects: BigNumber.from(0),
        totalRaised: BigNumber.from(0),
        uniqueParticipants: BigNumber.from(0),
    });
    const [isStatisticLoading, setIsStatisticLoading] = useState(true);

    const [projectsList, setProjectsList] = useState<IProjectCardData[]>([]);
    const [isProjectLoading, setIsProjectLoading] = useState(true);

    const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const value = e.target.value;

        if (debounceFuncRef.current) clearTimeout(debounceFuncRef.current);

        debounceFuncRef.current = setTimeout(() => setSearchStr(value), 500);
    };

    const onPaginationChange: PaginationProps["onChange"] = (current, pageSize) => {
        setPagination((val) => ({ ...val, current: current, pageSize: pageSize }));
        searchBarRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const prepareListToDisplay = () => {
        const searchQuery = searchStr.trim();
        const filteredList =
            searchQuery !== ""
                ? projectsList.filter(
                      (project) =>
                          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          //   project.projectContractAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.tokenSymbol.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                : projectsList;

        return {
            listTotalLength: filteredList.length,
            items: filteredList
                .sort((a, b) => moment(a.createdDate).diff(moment(b.createdDate)))
                .slice(
                    pagination.current * pagination.pageSize - pagination.pageSize,
                    pagination.current * pagination.pageSize
                ),
        };
    };

    const listToDisplay = prepareListToDisplay();

    const fetchProjectList = async () => {
        try {
            const result = await contract.call("getProjectList");
            setIsProjectLoading(false);

            const mappedResult: IProjectCardData[] = result.map((item: any) => {
                return {
                    id: item.id.toNumber(),
                    slug: item.slug,
                    name: item.name,
                    shortDescription: item.shortDescription,
                    logoUrl: item.logoUrl,
                    projectBanner: item.coverBackgroundUrl,
                    goal: item.allocation.totalRaise,
                    maxAllocation: item.allocation.maxAllocation,
                    tokenSymbol: item.tokenInformation.symbol,
                    createdDate: new Date(item.schedule.createdAt.toNumber()),
                    startDate: new Date(item.schedule.opensAt.toNumber()),
                    endDate: new Date(item.schedule.endsAt.toNumber()),
                } as IProjectCardData;
            });

            setProjectsList(mappedResult);
        } catch (error) {
            setIsProjectLoading(false);
            console.log(error);
        }
    };

    const fetchDexMetrics = async () => {
        try {
            const result = await contract.call("getDexMetris");
            setIsStatisticLoading(false);

            const { totalProjects, totalRaised, uniqueParticipants } = result;

            setStatistics({
                totalProjects: totalProjects,
                totalRaised: totalRaised,
                uniqueParticipants: uniqueParticipants,
            });
        } catch (error) {
            console.log(error);
            setIsStatisticLoading(false);
        }
    };

    useEffect(() => {
        if (!contract) {
            return;
        }

        fetchProjectList();
        fetchDexMetrics();
    }, [contract]);

    return (
        <Space direction="vertical" style={{ width: "100%", marginTop: "24px" }} size={32}>
            <StatisticBar data={statistics} isLoading={isStatisticLoading} />
            <Row ref={searchBarRef} className="explore__search-bar">
                <Col span={24}>
                    <div>
                        <Input
                            placeholder="Search by project name or token symbol"
                            size="large"
                            allowClear
                            onChange={onInputChange}
                            disabled={isStatisticLoading}
                        />
                    </div>
                </Col>
            </Row>

            <Row className="explore__projects-list-container" gutter={[24, 24]}>
                {isProjectLoading && (
                    <Col span={24}>
                        <Space
                            style={{
                                width: "100%",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBlock: "24px",
                            }}
                            direction="vertical"
                        >
                            <LoadingOutlined style={{ fontSize: 48, color: token.colorPrimary }} spin />

                            <Typography.Text style={{ color: token.colorPrimary, fontSize: "16px", fontWeight: 500 }}>
                                Project list is loading ...
                            </Typography.Text>
                        </Space>
                    </Col>
                )}
                {!isProjectLoading &&
                    listToDisplay.items.map((project) => (
                        <Col key={project.slug} xxl={8} xl={8} lg={12} md={12} xs={24}>
                            <ProjectCard data={project} showStatus />
                        </Col>
                    ))}
            </Row>

            <Row className="explore__projects-list-pagination">
                <Col span={24} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Pagination
                        current={pagination.current}
                        pageSize={pagination.pageSize}
                        showSizeChanger
                        onChange={onPaginationChange}
                        total={listToDisplay.listTotalLength}
                        disabled={isProjectLoading}
                    />
                </Col>
            </Row>
        </Space>
    );
}
