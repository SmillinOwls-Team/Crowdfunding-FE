import { Avatar, Typography, theme } from "antd";
import "./index.scss";

export interface IProjectCardBannerProps {
    height?: string;
    src?: string;
    cardIconSrc?: string;
    cardIconEdgeSize?: number;
    dateBannerStyle?: {
        backgroundColor: string;
        color: string;
    };
    date?: {
        label: string;
        value: string;
    };
}

const PROJECT_CARD_BANNER_CONSTANTS = {
    CARD_MAX_HEIGHT: "230px",
};

export default function ProjectCardBanner(props: IProjectCardBannerProps) {
    const { height, src, cardIconSrc, cardIconEdgeSize, dateBannerStyle, date } = props;
    const { token } = theme.useToken();

    return (
        <div
            className="project-card-banner__container"
            style={{
                maxHeight: PROJECT_CARD_BANNER_CONSTANTS.CARD_MAX_HEIGHT,
                height: height ? height : PROJECT_CARD_BANNER_CONSTANTS.CARD_MAX_HEIGHT,
            }}
        >
            <img className="project-card-banner__image" alt="default" src={src} />
            {cardIconSrc !== "" ? (
                <Avatar
                    className="project-card__project-icon"
                    src={cardIconSrc}
                    shape="square"
                    style={{
                        left: token.paddingLG,
                        background: token.colorWhite,
                        transform: `translateY(50%)`,
                        width: `calc(${cardIconEdgeSize}px)`,
                        height: `calc(${cardIconEdgeSize}px)`,
                        border: `3px solid ${token.colorWhite}`,
                    }}
                />
            ) : undefined}
            <div
                className="project-card__project-date"
                style={{
                    left: token.paddingLG + (cardIconEdgeSize || 0),
                    height: (cardIconEdgeSize || 66) / 3,
                    backgroundColor: dateBannerStyle ? dateBannerStyle.backgroundColor : "#FFD6B4",

                    fontWeight: "600",
                }}
            >
                <Typography.Text
                    style={{
                        width: "40%",
                        color: dateBannerStyle ? dateBannerStyle.color : token.colorPrimary,
                    }}
                    ellipsis
                >
                    {date ? date.label : "Date:"}
                </Typography.Text>
                <Typography.Text
                    style={{
                        width: "60%",
                        textAlign: "right",
                        color: dateBannerStyle ? dateBannerStyle.color : token.colorPrimary,
                    }}
                    ellipsis
                >
                    {date ? date.value : "N/A"}
                </Typography.Text>
            </div>
        </div>
    );
}
