import { Button } from 'antd'
import Link from 'next/link'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import Navbar from './_components/navbar';
import Image from 'next/image';

export default function NotFound() {

    const links = [
        {
            title: "Frequently asked questions",
            text: "See our FAQs for further informations",
            href: "/faqs",
            image: "/notfound/question.svg"
        },
        {
            title: "Our blog",
            text: "Read the latest posts on our blog.",
            href: "/",
            image: "/notfound/blog.svg"

        },
        {
            title: "Contact us",
            text: "Can’t find what you’re looking for?",
            href: "/contact",
            image: "/notfound/contact.svg"

        }
    ]
    return (
        <>
            <Navbar />
            <section className="bg-bgyellow  isolate px-6 pt-3 lg:px-8 min-h-[80vh]">
                <div className='md:max-w-[1540px] mx-auto h-full flex flex-col items-center justify-center'>
                    <p className="border-2 border-[#D0D5DD] rounded-xl px-6 py-2 text-[#344054] font-bold relative before:content-[''] before:h-3 before:w-3 before:rounded-full before:bg-[#12B78F] before:absolute before:top-[50%] before:left-3 before:transform before:translate-y-[-50%] pl-8">404 error</p>

                    <h2 className='font-bold text-3xl md:text-6xl text-center pt-8'>We can’t find this page</h2>
                    <p className='md:text-xl pt-3 text-center'>The page you are looking for doesn&apos;t exist or has been moved.</p>
                    <div className='py-6'>
                        <Link href="/"><Button style={{ color: "#344054" }} size='large' icon={<ArrowLeftOutlined />} iconPosition={'start'}>Go Back</Button></Link>
                    </div>

                    <div className='md:w-[600px] flex flex-col gap-3 my-12'>
                        {
                            links.map((item, index) => (
                                <Link href={item.href} className='p-2 rounded-lg flex items-start md:gap-6 gap-2 w-full hover:bg-edengreen hover:text-white' key={index}>
                                    <div>
                                        <Image
                                            className="h-10 w-auto"
                                            alt={item.title}
                                            src={item.image}
                                            width={40}
                                            height={40}
                                            priority
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <p className='font-bold pb-1 md:text-xl'>{item.title}</p>
                                        <span className='text-sm md:text-base'>{item.text}</span>
                                    </div>
                                    <div className='flex justify-end'>
                                        <ArrowRightOutlined color='#98A2B3' />
                                    </div>
                                </Link>

                            ))
                        }
                    </div>
                </div>
            </section>
        </>
    )
}