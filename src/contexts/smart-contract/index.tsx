import { useAddress, useBalance, useContract } from "@thirdweb-dev/react";
import { ReactNode, createContext, useContext } from "react";
import { APP_CONFIGS } from "../../configs";
import { BigNumber } from "ethers";

interface ISmartContract {
    address: string | undefined;
    contract: any;
    getBalance?: () =>
        | {
              symbol: string;
              value: BigNumber;
              name: string;
              decimals: number;
              displayValue: string;
          }
        | undefined;
}

const SmartContract = createContext<ISmartContract>({ address: "", contract: null });

export const SmartContractProvider = ({ children }: { children: ReactNode }) => {
    const { contract }: { contract: any } = useContract(APP_CONFIGS.contractAddress);

    const address = useAddress();
    const { data } = useBalance(address);

    const getWalletBalance = () => {
        return data;
    };

    return (
        <SmartContract.Provider value={{ address, contract, getBalance: getWalletBalance }}>
            {children}
        </SmartContract.Provider>
    );
};

export const useSmartContract = () => {
    const smartContractContext = useContext(SmartContract);

    if (smartContractContext === undefined) {
        throw new Error("useSmartContract must be used within a SmartContractProvider");
    }

    return smartContractContext;
};
