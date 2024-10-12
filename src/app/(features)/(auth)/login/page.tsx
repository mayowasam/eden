"use client"
import { Button, Form, Input, message } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";


function Page() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [loading, setLoading] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const response = await signIn("credentials", {
        ...values,
        redirect: false, // This ensures you get a response object back
      });
      if (response?.error) {
        messageApi.error(`Credentials Incorrect`);
        setLoading(false)
      } else if (response?.ok) {
        messageApi.success(`Login Successful.`);
        setLoading(false)
        router.push('/dashboard')
      
      }
    } catch (error) {
      setLoading(false)
      console.log(error);
      messageApi.error(`Credentials Incorrect`);
    }

  };

  // if (isAuth) {
  //   redirect("/dashboard");
  // }
  return (
    <section className="bg-[#FAFEF5] ">
      {contextHolder}
      <div className="md:max-w-[1540px] min-h-screen mx-auto relative isolate p-2">
        <div className="flex md:justify-end p-4 text-center">
          <span>
            Don’t have an account? <Link href={'/signup'} className="font-bold">
              Create Account
            </Link>
          </span>

        </div>
        <div className="flex justify-center items-center">
          <div className="w-full md:max-w-[500px] mx-auto">
            <Form
              layout="vertical"
              form={form}
              name="login"
              onFinish={onFinish}
              // onFinishFailed={onFinishFailed}
              style={{ width: "100%" }}
              scrollToFirstError
            >
              <div className="w-full flex items-center justify-center p-4">
                <Image
                  className="h-8 w-auto"
                  alt="Eden"
                  src="/eden-logo.svg"
                  width={100}
                  height={100}

                />
              </div>
              <p className="text-xl text-center font-bold  pb-3">Login with valid credentials</p>


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
                name="password"
                label={<span style={{ fontWeight: "bold" }}>Password</span>}
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
                hasFeedback
              >
                <Input.Password size="large" placeholder="password" />
              </Form.Item>

              <Form.Item>
                <Button style={{ background: "#131313", color: "#FFF" }} htmlType="submit" size="large" block loading={loading}>
                  Continue
                </Button>
              </Form.Item>
            </Form>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Page

