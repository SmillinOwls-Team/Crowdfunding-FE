export default function EthSvg(props: { width: string; height: string }) {
    const { width, height } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width, height }}>
            <g>
                <path
                    d="M12 24c6.629 0 12-5.371 12-12S18.629 0 12 0 0 5.371 0 12s5.371 12 12 12zm0 0"
                    fill="#627eea"
                ></path>
                <path d="M12.371 3v6.652l5.625 2.512zm0 0" fill="#fff" fillOpacity="0.604"></path>
                <path d="M12.375 3L6.75 12.164l5.625-2.512zm0 0" fill="#fff"></path>
                <path d="M12.371 16.477v4.52L18 13.21zm0 0" fill="#fff" fillOpacity="0.604"></path>
                <path d="M12.375 20.996v-4.52L6.75 13.212zm0 0" fill="#fff"></path>
                <path d="M12.371 15.43l5.625-3.266-5.625-2.512zm0 0" fill="#fff" fillOpacity="0.2"></path>
                <path d="M6.75 12.164l5.625 3.266V9.652zm0 0" fill="#fff" fillOpacity="0.604"></path>
            </g>
        </svg>
    );
}
