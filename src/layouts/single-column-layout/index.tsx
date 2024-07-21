import { Outlet } from "react-router-dom";
import AppFooter from "./components/app-footer";
import AppHeader from "./components/app-header";
import "./index.scss";

export default function SingleColumnLayout() {
    return (
        <>
            <AppHeader />
            <div className="single-column-layout__scroll-wrapper">
                <main className="single-column-layout__main">
                    <Outlet />
                </main>
                <AppFooter />
            </div>
        </>
    );
}
