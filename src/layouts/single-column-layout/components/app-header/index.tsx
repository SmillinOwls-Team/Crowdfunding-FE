import { DownOutlined } from "@ant-design/icons";
import { ConnectWallet } from "@thirdweb-dev/react";
import { Button, Divider, Dropdown, MenuProps, Space, theme } from "antd";
import { Link, NavLink } from "react-router-dom";
import AppLogo from "../../../../components/app-logo";
import { navigation } from "../../../../constants/navigation";
import { useQuery } from "../../../../hooks/use-query";
import "./index.scss";

export default function AppHeader() {
    const { token } = theme.useToken();
    const { isMatching: isSmallScreen } = useQuery("(max-width: 730px)");

    const dropdownItems: MenuProps["items"] = navigation.map((nav, index) => ({
        key: index,
        label: <Link to={nav.path}>{nav.label}</Link>,
    }));

    return (
        <header className="single-column-layout__app-header" id="#header">
            {isSmallScreen ? (
                <Dropdown menu={{ items: dropdownItems }} trigger={["click"]}>
                    <nav onClick={(e) => e.preventDefault()} style={{ height: "100%" }}>
                        <div style={{ display: "flex", height: "100%", cursor: "pointer" }}>
                            <div style={{ height: "100%" }}>
                                <AppLogo />
                            </div>
                            <DownOutlined />
                        </div>
                    </nav>
                </Dropdown>
            ) : (
                <Link to="/" style={{ height: "100%" }}>
                    <AppLogo />
                </Link>
            )}

            <div className="single-column-layout__app-header__right">
                <Space style={{ height: "100%" }} split={<Divider type="vertical" />}>
                    {!isSmallScreen && (
                        <nav className="single-column-layout__app-header__navigation">
                            <Space style={{ height: "100%" }}>
                                {navigation.map((nav, index) =>
                                    nav.path === "/" ? null : (
                                        <NavLink key={index} to={nav.path} className="nav-btn" end>
                                            <Button
                                                type="text"
                                                size="large"
                                                style={{
                                                    color: token.colorPrimary,
                                                    textTransform: "uppercase",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                {nav.label}
                                            </Button>
                                        </NavLink>
                                    )
                                )}
                            </Space>
                        </nav>
                    )}

                    <ConnectWallet theme="light" btnTitle="Connect Wallet" className="custom-connect-wallet" />
                </Space>
            </div>
        </header>
    );
}
