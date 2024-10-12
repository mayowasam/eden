'use client'

import Uploads from "@/app/_components/uploads";
import { Api } from "@/app/_utils/endpoints";
import { useMutation } from "@tanstack/react-query";
import { Button, Col, Form, Input, InputNumber, message, Row, Select, } from "antd";
import type { UploadFile } from 'antd'
import { useEffect, useState } from "react";
const { Option } = Select;

export default function AddItem({ showModal, initialValues, fetcher }: {
    showModal: () => void,
    fetcher: () => void;
    initialValues?: Partial<Product>,
}) {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues); // Set form values when editing
        }
    }, [initialValues, form]);

    const { mutateAsync } = useMutation({
        mutationFn: Api.upload,
        mutationKey: ["upload file"],

    })

    const { mutateAsync: mutate, isPending } = useMutation({
        mutationFn: Api.addItem,
        mutationKey: ["add item"],

    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onFinish = async (values: any) => {
        console.log(values);
        try {
            const response = await mutate({
                ...values,
                image: 'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp'
            })
            if (response.data.payload) {
                form.resetFields()
                messageApi.success(`Items successfully added.`);
                fetcher()
                showModal()
            }else{
                messageApi.error(response.data.message);
            }

        } catch (error) {
            console.log(error);
            messageApi.error('error occured');

        }

    }

    return (
        <>
            {contextHolder}
            <div className="md:max-w-[1540px] mx-auto">
                <div className="md:max-w-[600px] mx-auto">
                    <Form
                        layout="vertical"
                        form={form}
                        name="additems"
                        // onValuesChange={onValuesChange}
                        // onFinishFailed={onFinishFailed}
                        initialValues={{
                           ...initialValues
                        }}
                        style={{ width: "100%" }}
                        scrollToFirstError
                        onFinish={onFinish}
                    >
                        <Row gutter={16} align="middle" justify='space-between'>
                            <Col xs={24} sm={24}>
                                <Form.Item name="name" label="Item" rules={[{ required: true }]}>
                                    <Input style={{ width: "100%" }} size="large" />
                                </Form.Item>
                                <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                                    <InputNumber style={{ width: "100%" }} size="large" min={0} />
                                </Form.Item>
                                <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                                    <Input style={{ width: "100%" }} size="large" />
                                </Form.Item>

                                <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                                    <InputNumber style={{ width: "100%" }} size="large" min={1} />
                                </Form.Item>


                                <Form.Item
                                    name="image"
                                    label={<span style={{ fontWeight: "bold" }}
                                    >Image</span>}
                                    rules={[{ required: false, message: 'Please select an item to Upload, and make sure that the file size is less than 1mb!' }]}
                                >

                                    <Uploads
                                        fileList={fileList}
                                        fileName='image'
                                        form={form}
                                        mutateAsync={mutateAsync}
                                        previewImage={previewImage}
                                        previewOpen={previewOpen}
                                        setFileList={setFileList}
                                        setPreviewImage={setPreviewImage}
                                        setPreviewOpen={setPreviewOpen}
                                        validType={['image/jpg', 'image/png', 'image/jpeg', 'application/pdf']}
                                    />

                                </Form.Item>

                                <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                                    <Input style={{ width: "100%" }} size="large" />
                                </Form.Item>
                                <Form.Item
                                    name="rating"
                                    label={<span style={{ fontWeight: "bold" }}>Rating</span>}
                                    rules={[{ required: true, message: 'Please select rating!' }]}
                                >
                                    <Select placeholder="select your rating" size="large">
                                        {[...Array(5)].map((_, index) => (
                                            <Option key={index} value={index + 1}>
                                                {index + 1}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item>
                                    <Button size="large" type="primary" htmlType="submit" loading={isPending}>Add item</Button>
                                </Form.Item>
                            </Col>

                        </Row>
                    </Form>

                </div>
            </div>
        </>
    )
}