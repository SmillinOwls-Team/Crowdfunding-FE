import "./styles.scss"

export interface ICoverItemProps {
    src: string;
}

export default function CoverItem(props: ICoverItemProps) {
    const { src } = props;

    return (
        <div className="project-detail-cover-wrapper">
            <img src={src} />
        </div>
    );
}
