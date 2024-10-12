"use client"

import UseSearch from "@/app/_hooks/useSearch";
import { Api } from "@/app/_utils/endpoints";
import { changeCurrency, exportCsv } from "@/app/_utils/util";
import { DownloadOutlined, EyeFilled, FileTextOutlined, SearchOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import type { TableProps, TabsProps } from 'antd';
import { Avatar, Button, Card, DatePicker, Drawer, Input, Table, Tabs, Tag } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const { RangePicker } = DatePicker;

const Transaction = ({ status }: {
    status: STATUS
}) => {
    const [loading, setLoading] = useState(false)
    const pathname = usePathname();
    const [keyWord, setKeyWord] = useState('')
    const router = useRouter();
    const updateSearchParams = UseSearch();
    const [transactions, setTransactions] = useState<Transactions<Transaction>>();
    const [page, setPage] = useState({
        current: 1,
        pageSize: 10,
        total: 1
    })
    const [view, setView] = useState<Transaction>();

    const [open, setOpen] = useState(false);

    const columns = [
        { title: 'Reference', dataIndex: 'reference', key: 'reference' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Total', key: 'total',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (_: any, { total }: { total: number }) => {
                return <span>{changeCurrency(total)}</span>
            }
        },
        {
            title: 'Status', key: 'status',
            render: (record: Transaction) => {
                console.log({ record });
                return <Tag color={record?.status === 'PENDING' ? 'orange' : record?.status === 'APPROVED' ? 'green' : 'volcano'}><span className="font-bold">{record?.status}</span></Tag>
            }

        },
        {
            title: 'Date', key: 'created_at',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (_: any, { created_at }: { created_at: string }) => {
                return <span>{new Date(created_at).toLocaleString()}</span>
            }
        },
        {
            title: 'View', key: 'id',
            render: (record: Transaction) => {
                console.log({ record });
                return <Button icon={<EyeFilled />} onClick={() => {
                    setView(record)
                    setOpen(true)
                }
                }
                ></Button>
            }
        }

    ]
    const drawerColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Price', dataIndex: 'price', key: 'price' },
        { title: 'Qty', dataIndex: 'quantity', key: 'quantity' },
        {
            title: 'Total', key: 'total',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (_: any, { total }: { total: string }) => {
                return <span>{changeCurrency(+total)}</span>
            }
        },


    ]

    const { mutateAsync } = useMutation({
        mutationFn: Api.getTransactions,
        mutationKey: ["get transactions"],

    })


    const onInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        try {

            if (e.target.value) {
                setKeyWord(e.target.value)
                updateSearchParams(pathname, "item", e.target.value)
                const response = await mutateAsync({
                    keyWord: e.target.value,
                    status: status
                })
                if (response.data.success) {
                    setTransactions(response.data.payload);
                } else {
                    setTransactions(transactions)
                }
            } else {
                setKeyWord('')
                router.push(pathname)
                fetcher()
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onDateChange: RangePickerProps['onChange'] = async (dates, dateStrings: [string, string]) => {

        const [startDate, endDate] = dateStrings;
        console.log({ dates });
        console.log({ startDate, endDate });

        try {
            if (dates) {
                const response = await mutateAsync({
                    keyWord,
                    status: status,
                    startDate,
                    endDate,
                    page: page.current,
                    pageSize: page.total
                })
                if (response.data.success) {
                    setTransactions(response.data.payload);
                } else {
                    fetcher()
                }

            } else {
                fetcher()
            }

        } catch (error) {
            console.error(error)
        }
    }

    const exportAllCsv = async () => {
        try {

            exportCsv(transactions?.transactions ?? [], ['Reference', 'Name', 'Email', 'Date', 'Amount', 'Status'], ['employee.fullname', 'employee.email', 'employee.created_at', 'requested_amount', 'status'])


        } catch (error) {
            console.error(error)

        }

    }

    const fetcher = async () => {
        try {
            setLoading(true)
            const response = await Api.getTransactions({
                page: 1,
                pageSize: 10,
                status: status
            })
            if (response.data.success) {
                setLoading(false)
                setTransactions(response.data.payload);
                setPage({
                    ...page,
                    total: response.data.payload?.meta?.total
                })
            } else {
                setLoading(false)

            }

        }
        catch (error) {
            setLoading(false)
            console.error(error)
        }
    }

    useEffect(() => {
        fetcher()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onPageChange: TableProps<Transaction>['onChange'] = async (pagination) => {
        try {
            setPage({
                pageSize: 10,
                current: pagination.current ?? 1,
                total: transactions?.meta.total ?? 1
            })
            const response = await mutateAsync({
                page: pagination.current,
                pageSize: 10,
                keyWord
            })
            if (response.data.success) {
                setTransactions(response.data.payload);
            } else {
                setTransactions(transactions)
            }

        } catch (error) {
            console.log(error);
        }

    };


    return (
        <div>
            <div className="flex gap-6">
                <Card className="" style={{ width: 200, height: 100, border: "2px solid #EAECF0" }} hoverable>
                    <div className="space-y-2">
                        <p className="">Total amount</p>
                        <p className="font-bold text-2xl">{changeCurrency(100000)}</p>
                    </div>
                </Card>
            </div>
            <div className=" flex gap-2 items-center justify-between py-8">
                <div className="w-1/3">
                    <Input prefix={<SearchOutlined />} placeholder="Search by name" allowClear onChange={onInputChange} size="large" />
                </div>
                <div className="w-1/3"></div>


                <div className="w-1/3 flex gap-4" >
                    <RangePicker onChange={onDateChange} />
                    <Button shape="round" style={{ color: "#fff", background: '#151515' }} onClick={exportAllCsv} icon={<DownloadOutlined className="text-sm" />} size="large">Export</Button>
                </div>
            </div>
            <Table dataSource={transactions?.transactions} columns={columns} pagination={page} onChange={onPageChange} loading={loading} />
            {
                view &&
                <Drawer
                    title={
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2 items-center">
                                <div className="border-2 w-8 h-8 flex justify-center rounded-lg">
                                    <FileTextOutlined />
                                </div>
                                <div>
                                    <p className="font-bold text-xl">Transaction Details</p>
                                </div>

                            </div>

                        </div>
                    }
                    // width={500}
                    open={open}
                    onClose={() => setOpen(false)}
                >

                    <div className="">
                        {/* <p className="font-bold text-xl py-2">Details</p> */}

                        <div className="flex justify-end py-2">
                            <Avatar src={"https://api.dicebear.com/7.x/miniavs/svg?seed=1"} shape='circle' size="large" />
                        </div>

                        <div className="space-y-2">
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[#344054]">Name:</span>
                                    <span className="font-bold">{view?.name}</span>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[#344054]">Reference:</span>
                                    <span className="font-bold">{view?.reference}</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[#344054]">Date:</span>
                                    <span className="font-bold">{new Date(view?.created_at)?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>


                        <br />
                        <div className="py-2">
                            <p className="text-xl font-bold py-4">Items Details</p>
                            <div className="py-2">
                                <Table dataSource={view?.items} columns={drawerColumns} pagination={false} />


                            </div>



                        </div>
                        <br />
                        <p className="font-bold text-xl py-2">Invoice Details</p>

                        <div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between"> <span> Total Amount:</span> <span className="font-bold">{changeCurrency(view?.total)}</span></div>

                                <div className="flex items-center justify-between">
                                    <span className="text-[#344054]">Payment Status:</span>
                                    <Tag color={view?.status === 'PENDING' ? 'orange' : view?.status === 'APPROVED' ? 'green' : 'volcano'}><span className="font-bold">{view?.status}</span></Tag>
                                </div>
                            </div>

                        </div>

                    </div>

                </Drawer>
            }
        </div>
    )
}

export default function Page() {
    const [current, setCurrent] = useState('PENDING');


    const onChange = async (key: string) => {
        setCurrent(key);
    };


    const items: TabsProps['items'] = [

        {
            key: 'PENDING',
            label: <p className="font-bold text-black">{current === 'PENDING' ? <span className="h-2 w-2 rounded-full bg-eden inline-block"></span> : null}<span className="inline-block ml-2">Pending</span></p>,
            children: <Transaction status={'PENDING'} />,
        },
        {
            key: 'APPROVED',
            label: <p className="font-bold text-black">{current === 'APPROVED' ? <span className="h-2 w-2 rounded-full bg-eden inline-block"></span> : null}<span className="inline-block ml-2">Approved</span></p>,
            children: <Transaction status={'APPROVED'} />,
        },
        {
            key: 'DECLINED',
            label: <p className="font-bold text-black">{current === 'DECLINED' ? <span className="h-2 w-2 rounded-full bg-eden inline-block"></span> : null}<span className="inline-block ml-2">Declined</span></p>,
            children: <Transaction status={'DECLINED'} />,
        },
    ]
    return (
        <div>
            <Tabs
                onChange={onChange}
                type="card"
                items={items}
                activeKey={current}
            />





        </div>
    )
}