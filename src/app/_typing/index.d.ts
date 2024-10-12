
interface Product {
    id: number,
    name: string,
    quantity: number,
    price: number,
    image: string,
    description: string,
    rating: string,
    type: string
}

interface Products<T>{
    products: T[],
    meta:{
        total: number
    }
}

interface Transactions<T>{
    transactions: T[],
    meta:{
        total: number
    }
}

interface Paged<T>{
    success: boolean,
    message: string,
    payload: T

}

interface User {
    id: string,
    name: string,
    email: string,
    phone: string,
    created_at: string,
    updated_at: string
}

type STATUS = 'PENDING' | 'DECLINED' | 'APPROVED' | 'DISBURSED';

interface Item {
    id:number,
    product_id: number,
    transactionId:number,
    name: string,
    description: string,
    price: number,
    quantity: number,
    total: number,
}

interface Transaction {
    id:number,
    reference: string,
    status: STATUS,
    name: string,
    total: number,
    created_at: string,
    updated_at: string,
    items: Partial<item>[]
}


interface FileUploadResponse {
    payload: {
        url: string
    }
}


interface RequestSignUp {
    name: string,
    email: string,
    phone: string,
    password: string,
}

interface ResponseResult<T>{
    success: boolean,
    message: string,
    payload: T
}

interface ResponseError {
    success: boolean,
    message: string,
    payload: null
}


