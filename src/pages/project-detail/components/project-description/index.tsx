import { Typography } from "antd";

export interface IProjectDescriptionProps {
    content: string;
}

export function ProjectDescription(props: IProjectDescriptionProps) {
    const { content } = props;

    return <Typography.Paragraph style={{ fontSize: "1rem" }}>{content}</Typography.Paragraph>;
}
