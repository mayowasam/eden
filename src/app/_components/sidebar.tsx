'use client'

import { HomeOutlined, TransactionOutlined, UploadOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [current, setCurrent] = useState('dashboard');

    useEffect(() => {
        const path = pathname.split('/')[1];
        setCurrent(path);
        router.push(`/${path}`);
    }, [pathname, router]);


    const menuItems = [
        {
            label: 'Dashboard',
            icon: <HomeOutlined />,
            key: 'dashboard',
            children: []
        },
        {
            label: 'Transactions',
            icon: <TransactionOutlined />,
            key: 'transactions',
            children: []
        },
        {
            label: 'Admin',
            icon: <UploadOutlined />,
            key: 'admin',
            children: []
        },


    ];

    // const bottomMenuItems = [
    //     {
    //         label: 'Settings',
    //         icon: <SettingOutlined />,
    //         key: 'settings',
    //     },
    //     {
    //         label: 'Support',
    //         icon: <QuestionCircleOutlined />,
    //         key: 'support',
    //     },

    // ];

    const onClick = (item: {
        label: string;
        icon: JSX.Element;
        key: string;
    }) => {
        if (item.key === 'support') {
            console.log('support');

        } else {
            setCurrent(item.key);
            router.push(`/${item.key}`);
        }
    };



    return (
        <div className="w-full py-8 ">
            <div className="flex items-center justify-between pb-10 px-6">
                <Link href="/dashboard">
                    <span className="sr-only">Eden Lounge</span>
                    <Image
                        className="h-8 w-auto"
                        alt="Eden"
                        src="/eden-logo.svg"
                        width={100}
                        height={100}
                    />
                </Link>
            </div>

            <div>

                <ul className="">
                    {
                        menuItems.map(item => (
                            <a href={item.key} key={item.key} onClick={() => onClick(item)} className={``}>
                                <li className={`flex items-center gap-2 px-6 py-3 w-full hover:bg-eden hover:font-bold hover:text-white ${current === item.key ? "text-eden" : ""} `}>
                                    <span> {item.icon}</span>
                                    <span>{item.label}</span>
                                </li>
                            </a>
                        )

                        )

                    }
                </ul>

            </div>


            {/* <div className="absolute bottom-0 left-0 w-full py-8 ">

                <ul className="">
                    {
                        bottomMenuItems.map(item => (
                            <a key={item.key} onClick={() => onClick(item)} className={`cursor-pointer`}>
                                <li className={`flex items-center gap-2 px-6 py-3 w-full hover:bg-eden hover:font-bold hover:text-white ${current === item.key ? "text-eden" : ""} `}>
                                    <span> {item.icon}</span>
                                    <span>{item.label}</span>
                                </li>
                            </a>

                        ))
                    }
                </ul>

            </div> */}


        </div>
    )
}