'use client'

import UseSearch from "@/app/_hooks/useSearch";
import { Api } from "@/app/_utils/endpoints";
import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, Input, message, Modal, Pagination, PaginationProps, Popconfirm } from "antd";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddItem from "./addItem";

export default function Page() {
    const pathname = usePathname();
    const [foodOptions, setFoodOptions] = useState<Products<Product>>();
    const [editItem, setEditItem] = useState<Product>();
    const router = useRouter();
    const updateSearchParams = UseSearch();
    const [keyWord, setKeyWord] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState({
        current: 1,
        pageSize: 10,
        total: 1
    })


    const { mutateAsync } = useMutation({
        mutationFn: Api.getItems,
        mutationKey: ["get items"],

    })

    const { mutateAsync: mutateDelete } = useMutation({
        mutationFn: Api.deleteItem,
        mutationKey: ["delete items"],

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

    const showModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
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

    const handleEditItem = async (item: Product) => {
        const pickedItem = foodOptions?.products.find(product => product.id === item.id);
        console.log({ pickedItem });

        if (pickedItem) {
            setEditItem(pickedItem)
            showModal()
        }
    }

  
    const confirm = async(item:Product) => {
        console.log(item);
        try {
            const response =  await mutateDelete(item.id);
            if(response.data.success){
                message.success('item successsfully deleted')
                fetcher()  
            }
            
        } catch (error) {
            console.error(error)
        }
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
        <div className="md:max-w-[1540px] mx-auto">

            <div>
                <div className="flex py-3">
                    <div className="w-1/3">
                        <Input prefix={<SearchOutlined />} placeholder="Search by name" allowClear onChange={onInputChange} size="large" />

                    </div>
                    <div className="w-1/3" />
                    <div className="w-1/3 flex justify-end">
                        <Button onClick={showModal}>Add Item</Button>
                    </div>
                </div>
                <div className="max-h-[540px] overflow-auto">
                    <div className='grid grid-cols-[repeat(auto-fit,_minmax(min(180px,_200px),_250px))] gap-10 grid-flow-row auto-rows-[330px]  justify-center py-6 '>
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
                                            <span >Price:</span>
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
                                            <Button type="text" icon={<EditOutlined />} onClick={() => handleEditItem(item)}></Button>
                                            <Popconfirm
                                                title="Delete the item"
                                                description="Are you sure to delete this item?"
                                                onConfirm={() => confirm(item)}
                                                // onCancel={cancel}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                            <Button type="text" danger icon={<DeleteOutlined />}></Button>
                                            </Popconfirm>
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


            <Modal
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
            >
                <AddItem showModal={showModal} initialValues={editItem} fetcher={fetcher} />
            </Modal>

        </div>
    )
}