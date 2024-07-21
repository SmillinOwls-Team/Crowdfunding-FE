import { Card, Space, Typography } from "antd";
import "./styles.scss";

export interface IProjectScheduleProps {
    data: {
        startDate: string;
        endDate: string;
        // idoStartDate: string;
        // idoEndDate: string;
    };
}

export default function ProjectSchedule(props: IProjectScheduleProps) {
    const { data } = props;

    return (
        <Space style={{ width: "100%" }} direction="vertical" size={0} className="project-schedule-container">
            <Card className="project-schedule-item-head">Schedule</Card>

            <Card className="project-schedule-item">
                <Space direction="horizontal" align="center" style={{ width: "100%", justifyContent: "space-between" }}>
                    <Typography.Text className="project-schedule-item-title">Funding Start At</Typography.Text>
                    <Typography.Text className="project-schedule-item-value">{data.startDate}</Typography.Text>
                </Space>
            </Card>

            <Card className="project-schedule-item">
                <Space direction="horizontal" align="center" style={{ width: "100%", justifyContent: "space-between" }}>
                    <Typography.Text className="project-schedule-item-title">Funding End At</Typography.Text>
                    <Typography.Text className="project-schedule-item-value">{data.endDate}</Typography.Text>
                </Space>
            </Card>

            {/* <Card className="project-schedule-item">
                <Space direction="horizontal" align="center" style={{ width: "100%", justifyContent: "space-between" }}>
                    <Typography.Text className="project-schedule-item-title">Claiming Token At</Typography.Text>
                    <Typography.Text className="project-schedule-item-value">{data.idoStartDate}</Typography.Text>
                </Space>
            </Card> */}

            {/* <Card className="project-schedule-item">
                <Space direction="horizontal" align="center" style={{ width: "100%", justifyContent: "space-between" }}>
                    <Typography.Text className="project-schedule-item-title">Claiming Token End</Typography.Text>
                    <Typography.Text className="project-schedule-item-value">{data.idoEndDate}</Typography.Text>
                </Space>
            </Card> */}
        </Space>
    );
}
