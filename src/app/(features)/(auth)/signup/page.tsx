"use client"
import { Api } from "@/app/_utils/endpoints";
import { ArrowLeftOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message, Select } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Option } = Select;

const prefixSelector = (
  <Form.Item name="prefix" noStyle>
    <Select style={{ width: 70 }}>
      <Option value="+234">+234</Option>
      <Option value="+233">+233</Option>
      <Option value="+441">+441</Option>
    </Select>
  </Form.Item>
);


function Signup() {
  const [messageApi, contextHolder] = message.useMessage();
  const [password, setPassword] = useState({
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isMinLength: false,
  });
  const router = useRouter()

  const [form] = Form.useForm();
  const {mutateAsync, isPending} =  useMutation({
    mutationFn: Api.signUp,
    mutationKey:['sign up']
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onValuesChange = (changedValues: any,) => {
    // console.log({ allValues });
    if (changedValues.password) {
      if (changedValues.password !== '') {
        const checks = {
          hasLowercase: /[a-z]/.test(changedValues.password),
          hasUppercase: /[A-Z]/.test(changedValues.password),
          hasNumber: /\d/.test(changedValues.password),
          hasSpecialChar: /[^A-Za-z0-9]/.test(changedValues.password),
          isMinLength: changedValues.password.length >= 8,
        };
        setPassword(checks)
      } else {
        setPassword({
          hasLowercase: false,
          hasUppercase: false,
          hasNumber: false,
          hasSpecialChar: false,
          isMinLength: false,
        })
      }
    }

  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = async (values: any) => {
    try {
     const response = await mutateAsync(values);
     if(response.data.payload){
       messageApi.success(`Company Information saved successfully.`);
       form.resetFields();
       router.push('/login')
     }else{
      messageApi.error(response.data.message);
     }
     
    } catch (error) {
      console.error(error);
    }

  };

  return (
    <>
      {contextHolder}
      <div className="md:max-w-[1540px] mx-auto relative isolate p-2 bg-bgyellow">
        <div className="border border-red-500 flex flex-col md:flex-row gap-4 ">
          <div className="w-[350px] mx-auto min-h-screen">
                <Form
                  layout="vertical"
                  form={form}
                  name="companyregister"
                  onFinish={onFinish}
                  onValuesChange={onValuesChange}
                  // onFinishFailed={onFinishFailed}
                  initialValues={{
                    suffix: "Naira",
                    prefix: '+234',
                    country: "Nigeria"
                  }}
                  style={{ width: "100%" }}
                  scrollToFirstError
                >
                  <div className="flex flex-col items-center justify-center w-full">
                    <Image
                      className="h-8 w-auto"
                      alt="Eden"
                      src="/eden.svg"
                      width={100}
                      height={100}
                    />
                    <p className="text-xl text-center font-bold  py-3">Contact Information</p>

                  </div>

                  <Form.Item
                    name="name"
                    label={<span style={{ fontWeight: "bold" }}>Name</span>}
                    // tooltip="What do you want others to call you?"
                    rules={[{ required: true, message: 'Please input your Name!', whitespace: true }]}
                  >
                    <Input
                      size="large"
                      placeholder="Enter name"
                      style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label={<span style={{ fontWeight: "bold" }}>E-mail</span>}
                    rules={[
                      {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                      },
                      {
                        required: true,
                        message: 'Please input your E-mail!',
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Enter email address"
                    />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label={<span style={{ fontWeight: "bold" }}>Phone</span>}
                    rules={[
                      { required: true, message: 'Please input your phone!' },

                    ]}                    >
                    <Input addonBefore={prefixSelector} style={{ width: '100%' }} size="large" placeholder="Enter phone" maxLength={11}
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label={<span style={{ fontWeight: 'bold' }}>Password</span>}
                    rules={[
                      {
                        required: true,
                        message: 'Please input your password!',
                      },
                      {
                        validator(_, value) {
                          // Combined regex to check all conditions at once
                          const passwordRegex =
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[a-zA-Z\d!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-]{8,}$/
                          // Validate the value against the regex
                          if (!value || passwordRegex.test(value)) {
                            return Promise.resolve();
                          }
                          // Return error if the conditions are not met
                          return Promise.reject(
                            new Error(
                              'Password must be at least 8 characters long, and include one lowercase letter, one uppercase letter, one number, and one special character.'
                            )
                          );
                        },
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password size="large" placeholder="password" />
                  </Form.Item>

                  <Form.Item
                    name="confirm"
                    label={<span style={{ fontWeight: "bold" }}>Confirm Password</span>}
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'Please confirm your password!',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('The new password that you entered do not match!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password size="large" placeholder="confirm password" />
                  </Form.Item>
                  <div className="pb-3">
                    <p className="text-sm font-bold pb-2">Password requirements</p>
                    <span className="block text-[#828282]">
                      <CheckCircleOutlined
                        className="mr-2"
                        style={{ color: password.hasLowercase ? 'green' : '#828282' }}
                      />
                      one lowercase character
                    </span>
                    <span className="block text-[#828282]">
                      <CheckCircleOutlined
                        className="mr-2"
                        style={{ color: password.hasUppercase ? 'green' : '#828282' }}
                      />
                      one uppercase character
                    </span>
                    <span className="block text-[#828282]">
                      <CheckCircleOutlined
                        className="mr-2"
                        style={{ color: password.hasNumber ? 'green' : '#828282' }}
                      />
                      one number
                    </span>
                    <span className="block text-[#828282]">
                      <CheckCircleOutlined
                        className="mr-2"
                        style={{ color: password.hasSpecialChar ? 'green' : '#828282' }}
                      />
                      one special character
                    </span>
                    <span className="block text-[#828282]">
                      <CheckCircleOutlined
                        className="mr-2"
                        style={{ color: password.isMinLength ? 'green' : '#828282' }}
                      />
                      8 characters minimum
                    </span>
                  </div>


                  <Form.Item>
                    <Button style={{ background: "#131313", color: "#FFF" }} htmlType="submit" size="large" block loading={isPending}>
                      Continue
                    </Button>
                  </Form.Item>
                </Form>
              <div className="flex justify-between py-4">
                <Button type={'text'} style={{ color: "#131313", fontWeight: "bold" }} icon={<ArrowLeftOutlined className="text-sm" />} size="large">Back</Button>

                <Link href={'/login'} className="font-bold">
                  Sign In
                </Link>
              </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup