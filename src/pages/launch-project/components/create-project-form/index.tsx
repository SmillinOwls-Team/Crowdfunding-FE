import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Space } from "antd";
import moment from "moment";
import * as React from "react";
import { DATETIME_FORMAT } from "../../../../constants/datetime";
import { createSlugFromVietnameseName } from "../../../../utils/common-utils";
import { isImageUrlValid } from "../../../../utils/image-checker";
import "./index.scss";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

export interface IProjectFormData {
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    logoUrl: string;
    coverBackgroundUrl: string;
    maxAllocation: number;
    totalRaise: number;
    tokenSymbol: string;
    tokenSwapRaito: number;
    fundingPeriod: {
        startsAt: Date;
        endsAt: Date;
    };
    // tokenClaimingPeriod: {
    //     startsAt: Date;
    //     endsAt: Date;
    // };
}

export interface ICreateProjectFormProps {
    onCancel: () => void | undefined;
    onSubmit: (data: IProjectFormData) => void | Promise<void> | undefined;
}

export default function CreateProjectForm(props: ICreateProjectFormProps) {
    const { onSubmit, onCancel } = props;

    const [form] = Form.useForm();

    const handleFormFinish = (value: any) => {
        const sanitizedValue: IProjectFormData = {
            name: value.name,
            slug: value.slug,
            shortDescription: value.shortDescription,
            description: value.description,
            logoUrl: value.logoUrl,
            coverBackgroundUrl: value.coverBackgroundUrl,
            maxAllocation: value.maxAllocation,
            totalRaise: value.totalRaise,
            tokenSymbol: value.tokenSymbol,
            tokenSwapRaito: value.tokenSwapRaito,
            fundingPeriod: {
                startsAt: value.fundingPeriod[0].toDate(),
                endsAt: value.fundingPeriod[1].toDate(),
            },
            // tokenClaimingPeriod: {
            //     startsAt: value.tokenClaimingPeriod[0].toDate(),
            //     endsAt: value.tokenClaimingPeriod[1].toDate(),
            // },
        };

        onSubmit && onSubmit(sanitizedValue);
    };

    const handleOnBlurProjectTitle = (event: React.FocusEvent<HTMLInputElement, Element>) => {
        const { target } = event;
        const { value } = target;

        if (!value || !value.trim()) {
            return;
        }

        const slug = createSlugFromVietnameseName(value);
        form.setFieldValue("slug", slug);
    };
    return (
        <Form layout="vertical" requiredMark={false} form={form} onFinish={handleFormFinish}>
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
                <Row gutter={{ lg: 16 }}>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            className="form-item"
                            name="name"
                            label="Project Title"
                            rules={[
                                {
                                    required: true,
                                    whitespace: true,
                                    type: "string",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Your project title"
                                size="large"
                                autoFocus
                                onBlur={handleOnBlurProjectTitle}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} lg={12}>
                        <Form.Item
                            className="form-item"
                            name="slug"
                            label="Project Slug"
                            rules={[
                                { required: true, whitespace: true, type: "string" },
                                {
                                    pattern: new RegExp(/^[a-z0-9]+(?:(?:-|_)+[a-z0-9]+)*$/),
                                    message: "Invalid format",
                                },
                            ]}
                        >
                            <Input placeholder="your-project-slug" size="large" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={{ lg: 16 }}>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            className="form-item"
                            name="logoUrl"
                            label="Logo URL"
                            tooltip={"An image that represented for your project"}
                            rules={[
                                () => ({
                                    async validator(_, value) {
                                        if (!value || !value.trim()) {
                                            return Promise.reject(new Error("Please enter Logo URL"));
                                        }

                                        const isValid = await isImageUrlValid(value);
                                        if (!isValid) {
                                            return Promise.reject(new Error("Logo is not an url"));
                                        }

                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <Input placeholder="Put your logo url" size="large" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} lg={12}>
                        <Form.Item
                            className="form-item"
                            name="coverBackgroundUrl"
                            label="Cover Image URL"
                            tooltip={
                                "This image will be displayed as card background and cover background in the detail page"
                            }
                            rules={[
                                () => ({
                                    async validator(_, value) {
                                        if (!value || !value.trim()) {
                                            return Promise.reject(new Error("Please enter Cover Image URL"));
                                        }

                                        const isValid = await isImageUrlValid(value);
                                        if (!isValid) {
                                            return Promise.reject(new Error("Cover Image is not an url"));
                                        }

                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <Input placeholder="Put your cover image url" size="large" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    className="form-item"
                    name="shortDescription"
                    label="Short Description"
                    rules={[{ required: true, whitespace: true, type: "string", max: 100 }]}
                    tooltip={"Short description of your project. It will be displayed on card"}
                >
                    <Input placeholder="Write your short description" size="large" showCount maxLength={100} />
                </Form.Item>

                <Form.Item
                    className="form-item"
                    name="description"
                    label="Full Description"
                    rules={[{ required: true, whitespace: true, type: "string" }]}
                >
                    <TextArea
                        placeholder="Write your full description"
                        size="large"
                        autoSize={{ minRows: 5, maxRows: 15 }}
                        showCount
                    />
                </Form.Item>

                <Row gutter={{ lg: 16 }}>
                    <Col xs={24} lg={12}>
                        <Row gutter={{ lg: 16 }}>
                            <Col xs={12}>
                                <Form.Item 
                                    name="tokenSymbol"
                                    label="Token Symbol"
                                    rules={[
                                        { required: true, type: "string" },
                                        {
                                            pattern: new RegExp(/[A-Z]/),
                                            message: "Token symbol must include only uppercase letters",
                                        },
                                    ]}
                                >
                                    <Input placeholder="ETH" size="large" />
                                </Form.Item>
                            </Col>

                            <Col xs={12}>
                                <Form.Item
                                    name="tokenSwapRaito"
                                    label="Token Swap Raito"
                                    rules={[
                                        () => ({
                                            validator(_, value) {
                                                if (!value || value <= 0) {
                                                    return Promise.reject(
                                                        new Error("Token swap raito must be larger than 0")
                                                    );
                                                }

                                                return Promise.resolve();
                                            },
                                        }),
                                    ]}
                                    tooltip={"The proportion of your token compared to 1 ETH"}
                                >
                                    <InputNumber size="large" placeholder="0.05" min={0} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>

                    <Col xs={24} lg={12}>
                        <Form.Item
                            className="form-item"
                            name="fundingPeriod"
                            label="Funding Period"
                            rules={[
                                () => {
                                    return {
                                        validator(_, value) {
                                            if (!value) {
                                                return Promise.reject(new Error("Please enter Funding Period"));
                                            }

                                            // const endDate = value[1];
                                            // const tokenClaimingPeriod = getFieldValue("tokenClaimingPeriod");

                                            // if (tokenClaimingPeriod && tokenClaimingPeriod[0].isBefore(endDate)) {
                                            //     return Promise.reject(
                                            //         new Error(
                                            //             "Funding end date must be before token claiming start date"
                                            //         )
                                            //     );
                                            // }

                                            return Promise.resolve();
                                        },
                                    };
                                },
                            ]}
                            tooltip={"Investors can stake money between this time. Start date also means 'Launch date'"}
                        >
                            <RangePicker
                                showTime
                                format={DATETIME_FORMAT.rangePickerFormat}
                                size="large"
                                allowClear
                                disabledDate={(current) => {
                                    return current && current < moment();
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={{ lg: 16 }}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="maxAllocation"
                            label="Max Allocation"
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || value <= 0) {
                                            return Promise.reject(new Error("Max allocation must be larger than 0"));
                                        }

                                        const target = getFieldValue("target");
                                        if (target && value >= target) {
                                            return Promise.reject(
                                                new Error("Max allocation must be smaller than target money")
                                            );
                                        }

                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                            tooltip={"Maximum money which an investor can stake"}
                        >
                            <InputNumber addonAfter="ETH" size="large" placeholder="0.005" min={0} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="totalRaise"
                            label="Target"
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || value <= 0) {
                                            return Promise.reject(new Error("Target money must be larger than 0"));
                                        }

                                        const maxAllocation = getFieldValue("maxAllocation");
                                        if (maxAllocation && value <= maxAllocation) {
                                            return Promise.reject(
                                                new Error("Target money must be larger than max allocation")
                                            );
                                        }

                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <InputNumber addonAfter="ETH" size="large" placeholder="2.5" min={0} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={{ lg: 16 }}>
                    {/* <Col xs={24} lg={12}>
                        <Form.Item
                            name="tokenClaimingPeriod"
                            label="Token Claiming Period"
                            rules={[
                                ({ getFieldValue }) => {
                                    return {
                                        validator(_, value) {
                                            if (!value) {
                                                return Promise.reject(new Error("Please enter Token Claiming Period"));
                                            }

                                            const startDate = value[0];
                                            const fundingPeriod = getFieldValue("fundingPeriod");

                                            if (fundingPeriod && fundingPeriod[1].isAfter(startDate)) {
                                                return Promise.reject(
                                                    new Error(
                                                        "Token claiming start date must be after funding start date"
                                                    )
                                                );
                                            }

                                            return Promise.resolve();
                                        },
                                    };
                                },
                            ]}
                            tooltip={
                                "Investors can claim rewards between this time. Start date must be the date after funding period's end date"
                            }
                        >
                            <RangePicker
                                showTime
                                format={DATETIME_FORMAT.rangePickerFormat}
                                size="large"
                                allowClear
                                disabledDate={(current) => {
                                    return current && current < moment();
                                }}
                            />
                        </Form.Item>
                    </Col> */}
                </Row>

                <Space
                    align="center"
                    direction="horizontal"
                    size="middle"
                    style={{ width: "100%", justifyContent: "center" }}
                >
                    <Button type="dashed" htmlType="button" size="large" onClick={() => onCancel && onCancel()}>
                        Cancel
                    </Button>

                    <Button type="primary" htmlType="submit" size="large">
                        Submit
                    </Button>
                </Space>
            </Space>
        </Form>
    );
}
