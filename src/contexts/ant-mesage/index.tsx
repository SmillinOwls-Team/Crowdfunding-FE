import { message } from "antd";
import { MessageInstance } from "antd/es/message/interface";
import { ReactNode, createContext, useContext } from "react";

const AntMessage = createContext<MessageInstance | null>(null);

export const AntMessageProvider = ({ children }: { children: ReactNode }) => {
    const [messageApi, contextHolder] = message.useMessage();

    return (
        <AntMessage.Provider value={messageApi}>
            {children}
            {contextHolder}
        </AntMessage.Provider>
    );
};

export const useAntMessage = () => {
    const antMessageContext = useContext(AntMessage);

    if (antMessageContext === null) {
        throw new Error("useAntMessage must be used within a AntMessageProvider");
    }

    return antMessageContext;
};
