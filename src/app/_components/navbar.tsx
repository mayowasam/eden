'use client'
import { DownOutlined, FileTextOutlined, HomeOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Button, Dropdown, Menu, Space, } from 'antd';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';


export default function Navbar({user}:{user?: {
    name?: string | null;
    image?: string | null;
    email?: string | null;
}}) {
    const pathName = usePathname();
    const path = pathName?.split('/')[1]?.charAt(0)?.toUpperCase() + pathName?.split('/')[1]?.slice(1)
    const [openNav, setOpenNav] = useState(false);
    const menuItems = [
        {
            label: 'Dashboard',
            icon: <HomeOutlined />,
            key: 'dashboard',
        },
        {
            label: 'Transactions',
            icon: <Image src="/sidebar/transactions.svg" alt="transactions" width={10} height={10} />,
            key: 'transactions',
        },
        // {
        //     label: 'Roles',
        //     icon: <Image src="/sidebar/roles.svg" alt="roles" width={10} height={10} />,
        //     key: 'roles',
        // },
        {
            label: 'Settlements',
            icon: <Image src="/sidebar/roles.svg" alt="roles" width={10} height={10} />,
            key: 'settlements',
        },
        {
            label: 'Developers',
            icon: <Image src="/sidebar/developers.svg" alt="developers" width={10} height={10} />,
            key: 'developers',
        },
    ];


    const Logout = async () => {
        await signOut({
            // redirect: false,
            callbackUrl: '/login',  
        });
    };

    const items: MenuProps['items'] = [
        {
            label: <div>
                <div className='flex items-center gap-3 border-b-2 py-2'>
                    <Avatar src={user?.image} shape='circle' size="large" />
                    <div className=''>
                        <p className='font-bold'>{user?.name}</p>
                        <p>{user?.email}</p>
                    </div>
                </div>
                <div>

                </div>
                <div className='border-b-2 py-2'>
                    <Button type='text' href='/settings' icon={<UserOutlined />}
                    >Profile</Button>

                </div>
                <div className='py-2'>
                    <Button type='text' style={{ fontWeight: '700' }} danger icon={<LogoutOutlined />} onClick={Logout}>Logout</Button>

                </div>

            </div>,
            key: '0',
        },
    ]


    return (
        <header className="relative h-[70px] w-full border-b-2 border-[#344054CC] flex items-center justify-between px-2 md:px-6">
            {/* hamburger */}
            <button
                onClick={() => setOpenNav(!openNav)}
                className={`outline-none border-none text-black text-3xl  md:hidden cursor-pointer relative w-8 h-8  ${openNav ? "toggle-btn" : ""}`}>
                <span className="sr-only">Open main menu</span>
                <div className="bg-black w-8 h-1 rounded absolute top-4 -mt-0.5 before:content-[''] transition-all duration-500 before:bg-black before:w-8 before:h-1 before:rounded before:absolute
                    before:transition-all before:duration-500 before:-translate-x-4 before:-translate-y-3 after:content-[''] after:bg-black after:w-8 after:h-1 after:rounded after:absolute
                    after:transition-all after:duration-500 after:-translate-x-4 after:translate-y-3
                    ">

                </div>
            </button>

            <div className='hidden md:flex items-center gap-2'>
                <FileTextOutlined className='text-xl' />
                <span className='text-xl font-semibold'>{path}</span>
            </div>

            <div className='flex items-center gap-4'>
                {/* <div className='flex items-center gap-2'>
                    <span className='font-bold'>Test</span>
                    <Switch defaultChecked onChange={onChange} />
                    <span className='font-bold'>Live</span>
                </div> */}
                <Dropdown menu={{ items }} trigger={['click']}>
                    <Space align='center' className='cursor-pointer'>
                        <Avatar src={user?.image} shape='circle' size="large" />
                        <DownOutlined className='text-sm' />
                    </Space>
                </Dropdown>
            </div>

            <div className={`${openNav ? 'block md:hidden' : 'hidden'} fixed top-[70px] left-0 bottom-0 origin-top animate-open-menu lg:hidden z-50`}>

                <div>
                    <Menu
                        // defaultSelectedKeys={['1']}
                        // defaultOpenKeys={['sub1']}
                        mode="inline"
                        theme="light"
                        inlineCollapsed={false}
                        items={menuItems}
                    />
                </div>

                <div className=''>

                </div>
            </div>

        </header>
    )
}