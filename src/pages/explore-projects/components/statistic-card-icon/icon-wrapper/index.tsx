import "./index.scss";

interface IIconWrapperProps {
    color?: string;
    backgroundColor?: string;
    icon: JSX.Element;
}

export default function IconWrapper(props: IIconWrapperProps) {
    const { color, backgroundColor, icon } = props;
    return (
        <div className="icon-wrapper" style={{ color: color, backgroundColor: backgroundColor }}>
            {icon}
        </div>
    );
}
