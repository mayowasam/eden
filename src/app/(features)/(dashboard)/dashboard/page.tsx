'use client'
import UseSearch from '@/app/_hooks/useSearch';
import { Api } from '@/app/_utils/endpoints';
import { changeCurrency, printInvoice } from '@/app/_utils/util';
import { DeleteOutlined, FileTextOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import {
    Button,
    Col,
    Form,
    Input,
    InputNumber,
    Pagination,
    PaginationProps,
    Row,
    Table
} from 'antd';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
    const [form] = Form.useForm();
    const pathname = usePathname();
    const [foodOptions, setFoodOptions] = useState<Products<Product>>();
    const router = useRouter();
    const updateSearchParams = UseSearch();
    const [keyWord, setKeyWord] = useState('')
    const [page, setPage] = useState({
        current: 1,
        pageSize: 10,
        total: 1
    })
    const [showAddition, setShowAddition] = useState(false)
    const [name, setName] = useState('Eden Lounge')
    const [items, setItems] = useState<(Product & { total: number, key: number })[]>([]);

    const { mutateAsync } = useMutation({
        mutationFn: Api.getItems,
        mutationKey: ["get items"],

    })

    const { mutateAsync: mutateTransaction } = useMutation({
        mutationFn: Api.addTransactions,
        mutationKey: ["add transaction"],

    })
    const fetcher = async () => {
        try {
            const response = await Api.getItems({
                page: 1,
                pageSize: 10,
            })
            if (response.data.success) {
                setFoodOptions(response.data.payload);
                setPage({
                    ...page,
                    total: response.data.payload?.meta?.total
                })
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetcher()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const columns = [
        { title: 'Item', dataIndex: 'name', key: 'name' },
        { title: 'Price', dataIndex: 'price', key: 'price' },
        {
            title: 'Quantity', key: 'quantity',
            render: (record: Product) => {
                console.log({ record });
                return <InputNumber
                    min={1}
                    defaultValue={record.quantity}
                    onChange={(value) => handleQuantityChange(value!, record)}
                />
            },
        },
        {
            title: 'Total', key: 'total',
            render: (record: Product & { total: number }) => {
                console.log({ record });
                return <span>{changeCurrency(record.total)}</span>
            },
        },
        {
            title: 'Actions', key: 'action', render: (record: Product) => {
                console.log({ record });
                return <Button type='text' danger icon={<DeleteOutlined />} onClick={() => RemoveItem(record)}></Button>
            },
        }
    ]

    const RemoveItem = (item: Product) => {
        const newItems = [...items];
        const findIndex = newItems.findIndex(newItem => newItem.id === item.id);
        if (findIndex > -1) {
            const val = newItems.splice(findIndex, 1);
            console.log({ val });
            setItems((newItems))
        }
    }

    const handleQuantityChange = (quantity: number, record: Product) => {
        const updatedItems = items.map(item => {
            if (item.id === record.id) {
                return {
                    ...item,
                    quantity,
                    total: quantity * item.price
                };
            }
            return item;
        });
        setItems(updatedItems);
    };

    const handleAddItem = (values: Product) => {
        const exist = items.find(item => item.id == values.id)
        if (exist) return;
        const newItem = {
            ...values,
            key: items.length + 1,
            quantity: 1,
            total: 1 * values.price,
        };
        setItems([...items, newItem]);
    };

    const handleAddAdditionalItem = (values: Product) => {
        const exist = items.find(item => item.id == values.id)
        if (exist) return;
        const newItem = {
            ...values,
            key: items.length + 1,
            quantity: values.quantity,
            total: values.quantity * values.price,
            // created_at: new Date().toISOString(),
            description: values.name,
            id: page.total + 1,
            // image: '',
            // rating: 5,
            // type: "MISC",
            // updated_at: new Date().toISOString(),
        };
        setItems([...items, newItem]);
        form.resetFields()
        setShowAddition(false)
    };

    const onInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        try {

            if (e.target.value) {
                setKeyWord(e.target.value)
                updateSearchParams(pathname, "item", e.target.value)
                const response = await mutateAsync({
                    keyWord: e.target.value
                })
                if (response.data.success) {
                    setFoodOptions(response.data.payload);
                } else {
                    setFoodOptions(foodOptions)
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

    const onChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setName(e.target.value)
    };

    const calculateTotal = () => {
        return (items.reduce((acc, item) => acc + item?.total, 0));
    };

    const handlePrint = async () => {
        const data = {
            name,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            items: items.map(({key, ...rest}) => rest),
            total: calculateTotal()
        }
        try {
            const response = await mutateTransaction(data)
            if (response.data.payload) {
                printInvoice(data);
            }

        } catch (error) {
            console.error(error)
        }
        // Save the original content of the body
        // window.print();
    };

    const onPageChange: PaginationProps['onChange'] = async (pageNumber) => {
        console.log('Page: ', pageNumber);
        try {
            setPage({
                pageSize: 10,
                current: pageNumber,
                total: foodOptions?.meta.total ?? 1
            })
            const response = await mutateAsync({
                page: pageNumber,
                pageSize: 10,
                keyWord
            })
            if (response.data.success) {
                setFoodOptions(response.data.payload);
            } else {
                setFoodOptions(foodOptions)
            }

        } catch (error) {
            console.log(error);
        }

    };

    return (
        <div className='md:max-w-[1540px] mx-auto relative isolate p-2 bg-bgyellow'>
            <div className='flex max-h-screen overflow-hidden'>
                <div className={items?.length > 0 ? 'w-[60%]' : 'w-full'}>
                    <Row>
                        <Col xs={24} sm={12}>
                            <Input prefix={<SearchOutlined />} placeholder="Search by name" allowClear onChange={onInputChange} size="large" />
                        </Col>

                    </Row>

                    <div className="max-h-[540px] overflow-auto">
                        <div className='grid grid-cols-[repeat(auto-fit,_minmax(min(180px,_200px),_250px))] gap-10  justify-center py-6  grid-flow-row auto-rows-[330px]'>
                            {
                                foodOptions?.products?.map((item) => (
                                    <div className='rounded-lg shadow-2xl' key={item.id}>
                                        <div className="h-[120px]">
                                            <Image
                                                className="w-full h-full object-contain"
                                                alt={item.name}
                                                src={item.image}
                                                width={80}
                                                height={30} />

                                        </div>

                                        <div className='p-4'>
                                            <p className='font-bold'>{item.name}</p>
                                            <p className='text-sm pb-2'>{item.description}</p>

                                            <p className='flex justify-between text-sm'>
                                                <span>Price:</span>
                                                <span className='font-bold'>{item.price}</span>
                                            </p>
                                            <p className='flex justify-between text-sm'>
                                                <span>Qty:</span>
                                                <span className='font-bold'>{item.quantity}</span>
                                            </p>
                                            <p className='flex justify-between text-sm'>
                                                <span>Type:</span>
                                                <span className='font-bold'>{item.type}</span>
                                            </p>
                                            <div className='flex justify-end py-3'>
                                                <Button onClick={() => handleAddItem(item)}>Add Item</Button>
                                            </div>

                                        </div>

                                    </div>
                                ))
                            }
                        </div>
                        <div className="py-12 ">
                            {
                                foodOptions?.products && foodOptions?.products?.length > 0 &&
                                <Pagination onChange={onPageChange} align="center" defaultCurrent={1} total={foodOptions?.meta?.total ?? 1} />
                            }
                        </div>

                    </div>
                </div>

                <div className={items?.length > 0 ? 'w-[40%] bg-white px-2 py-4' : 'hidden'}>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2 items-center pb-8">
                            <div className="border-2 w-8 h-8 flex justify-center rounded-lg">
                                <FileTextOutlined />
                            </div>
                            <div>
                                <p className="font-bold text-xl">Transaction Details</p>
                            </div>

                        </div>
                    </div>

                    <div>
                        <Table dataSource={items} columns={columns} pagination={false} />
                        <div className='py-8 flex justify-between items-center'>
                            <p className='font-bold text-lg'>Total:</p>
                            <p className='font-bold text-lg'>{calculateTotal()}</p>
                        </div>

                        {
                            showAddition &&
                            <Form
                                layout="vertical"
                                form={form}
                                name="additems"
                                // onValuesChange={onValuesChange}
                                // onFinishFailed={onFinishFailed}
                                initialValues={{
                                    suffix: "Naira",
                                    prefix: '+234',
                                    country: "Nigeria"
                                }}
                                style={{ width: "100%" }}
                                scrollToFirstError
                                onFinish={handleAddAdditionalItem}
                            >
                                <Row gutter={16} align="middle" justify='space-between'>
                                    <Col xs={24} sm={6}>
                                        <Form.Item name="name" label="Item" rules={[{ required: true }]}>
                                            <Input style={{ width: "100%" }} size="large" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={6}>
                                        <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                                            <InputNumber style={{ width: "100%" }} size="large" min={0} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={6}>
                                        <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                                            <InputNumber style={{ width: "100%" }} size="large" min={1} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={6}>
                                        <Form.Item>
                                            <Button size="large" type="primary" htmlType="submit" >Add item</Button>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        }

                        <Input value={name} style={{ width: "100%" }} size="large" placeholder='Customer Name' onChange={onChange} />


                        <div className='flex gap-6 justify-between py-3'>
                            <Button onClick={() => setShowAddition(!showAddition)}>{!showAddition ? 'Add Other Items' : 'Close'}</Button>
                            <Button danger onClick={() => setItems([])}>Clear</Button>
                            <Button type='primary' onClick={handlePrint}>Save Invoice</Button>
                        </div>


                    </div>

                </div>

            </div>

            <div className="p-4 hidden" id="print-section">
                <div className="invoice-content">
                    <h2 className="text-2xl font-bold mb-4">Invoice</h2>
                    <p className="mb-4">
                        <strong>Name:</strong> {name}
                    </p>

                    <table className="w-full border-collapse mb-6">
                        <thead>
                            <tr>
                                <th className="border p-2 text-left">Item</th>
                                <th className="border p-2 text-left">Price</th>
                                <th className="border p-2 text-left">Quantity</th>
                                <th className="border p-2 text-left">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td className="border p-2">{item.name}</td>
                                    <td className="border p-2">{item.price}</td>
                                    <td className="border p-2">{item.quantity}</td>
                                    <td className="border p-2">{item.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className='py-8 flex justify-between items-center'>
                        <p className='font-bold text-lg'>Total:</p>
                        <p className='font-bold text-lg'>{calculateTotal()}</p>
                    </div>
                    <Button type='primary' onClick={() => window.print()}>Print Invoice</Button>

                </div>
            </div>


        </div >
    );
};

