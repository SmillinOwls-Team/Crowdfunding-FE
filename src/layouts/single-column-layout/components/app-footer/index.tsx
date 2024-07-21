import { theme } from "antd";
import "./index.scss";

const { useToken } = theme;

export default function AppFooter() {
    const { token } = useToken();

    return (
        <footer
            className="single-column-layout__app-footer"
            style={{ backgroundColor: token.colorPrimary, color: token.colorWhite }}
        >
            <span>Crowdfunding by Team 4</span>
        </footer>
    );
}
