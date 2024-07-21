import "./index.scss";

export default function AppLogo({ width, height }: { width?: string; height?: string }) {
    let style: React.HTMLAttributes<HTMLDivElement> | undefined;

    if (width || height || width !== "" || height !== "") {
        style = { width: width, height: height } as React.HTMLAttributes<HTMLDivElement>;
    }

    return (
        <div className="app-logo" style={style}>
            <div className="app-logo__img-wrapper">
                <img src="/images/4-team-logo.png" alt="4-team-logo" />
            </div>

            <span>Crowdfunding</span>
        </div>
    );
}
