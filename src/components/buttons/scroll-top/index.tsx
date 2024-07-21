import { UpOutlined } from "@ant-design/icons";
import { Button } from "antd";
import "./styles.scss";
import { useEffect, useRef } from "react";

export interface IScrollTopButton {}

export default function ScrollTopButton(_props: IScrollTopButton) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleScrollTop = () => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    };

    useEffect(() => {
        const onVisible = () => {
            const scrollY = window.scrollY;
            const maxY = 500;
            if (scrollY > maxY) {
                wrapperRef.current?.classList.add("active");
            } else {
                wrapperRef.current?.classList.remove("active");
            }
        };

        window.addEventListener("scroll", onVisible);

        return () => {
            window.removeEventListener("scroll", onVisible);
        };
    }, []);

    return (
        <div className="scroll-top-wrapper" ref={wrapperRef}>
            <Button
                type="default"
                shape="circle"
                size="large"
                icon={<UpOutlined />}
                className="scroll-top-btn"
                onClick={handleScrollTop}
            ></Button>
        </div>
    );
}
