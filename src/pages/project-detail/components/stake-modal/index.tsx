import { useWallet } from "@thirdweb-dev/react";
import { Alert, Button, Col, InputNumber, Modal, Row, Space, Typography, theme } from "antd";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { useSmartContract } from "../../../../contexts/smart-contract";
import "./styles.scss";

export interface IStakeModalProps {
    show: boolean;
    title: string;
    maxAllocation?: BigNumber;
    currentRaise?: BigNumber;
    onConfirm: (value: number) => Promise<void> | void | undefined;
    onCancel: () => void | undefined;
}

export default function StakeModal(props: IStakeModalProps) {
    const { show, title, onConfirm, onCancel } = props;

    const { token } = theme.useToken();
    const wallet = useWallet();
    const { address } = useSmartContract();

    const [amount, setAmount] = useState(0);

    const [userWallet, setUserWallet] = useState<{ balance: BigNumber; currencySymbol: string; display: string }>({
        balance: BigNumber.from(0),
        currencySymbol: "",
        display: "0",
    });

    // const getMaxStakeAmount = () => {};

    const loadBalance = async () => {
        try {
            const walletBalance = await wallet!.getBalance();
            setUserWallet({
                ...userWallet,
                balance: walletBalance.value,
                currencySymbol: walletBalance.symbol,
                display: walletBalance.displayValue,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleConfirm = () => {
        onConfirm && onConfirm(amount);
    };

    useEffect(() => {
        if (!show) {
            return;
        }

        setAmount(0);
        if (!wallet) {
            return;
        }

        loadBalance();
    }, [wallet, address, show]);

    return (
        <Modal
            title={
                <Typography.Title level={3} style={{ margin: 0 }}>
                    {title}
                </Typography.Title>
            }
            centered
            open={show}
            onOk={handleConfirm}
            onCancel={onCancel}
            okText="Submit"
            footer={[
                <Space key={"button-group"} style={{ width: "100%", justifyContent: "center" }} align="center">
                    <Button size="large" onClick={onCancel}>
                        Cancel
                    </Button>

                    <Button size="large" type="primary" onClick={handleConfirm}>
                        Submit
                    </Button>
                </Space>,
            ]}
        >
            <Space direction="vertical" style={{ width: "100%" }} size={16}>
                <Space direction="vertical" style={{ width: "100%" }} size={4}>
                    <Row>
                        <Col sm={6} xs={24}>
                            <Typography.Text>Stake Amount</Typography.Text>
                        </Col>

                        <Col sm={18} xs={24} style={{ textAlign: "end", flexGrow: 1 }}>
                            <Typography.Text>
                                Your balance: {userWallet.display} {userWallet.currencySymbol}
                            </Typography.Text>
                        </Col>
                    </Row>

                    <div className="stake-input-wrapper" style={{ border: `1px solid ${token.colorBorder}` }}>
                        <InputNumber
                            autoFocus
                            decimalSeparator=","
                            size="large"
                            min={0}
                            bordered={false}
                            placeholder="0.0001"
                            value={amount}
                            onChange={(value) => value !== null && setAmount(value)}
                        />

                        {/* <Button
                            type="text"
                            className="stake-input-btn"
                            style={{ color: token.colorPrimary, backgroundColor: token.colorPrimaryBg }}
                            // onClick={getMaxStakeAmount}
                        >
                            MAX
                        </Button> */}
                    </div>
                </Space>

                <Alert
                    message="Before you submit"
                    description={
                        <>
                            <Typography.Text style={{ display: "block" }}>
                                - You will pay for your stake amount and gas fee.
                            </Typography.Text>
                            <Typography.Text>
                                - When the funding ends, you will be refunded if the target is{" "}
                                <strong>not completed</strong>.
                            </Typography.Text>
                        </>
                    }
                    type="warning"
                    showIcon
                    style={{ marginBottom: "24px" }}
                />
            </Space>
        </Modal>
    );
}
