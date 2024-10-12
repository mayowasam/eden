import db from "@/lib/db";
import { handleApiErrors } from "@/app/_utils/errorHandler";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";



export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const page = searchParams.get('page') || '1';
        const pageSize = searchParams.get('pageSize') || '10';
        const keyWord = searchParams.get('keyWord');
        const pageNumber = parseInt(page as string, 10) || 1;
        const pageSizeNumber = parseInt(pageSize as string, 10) || 10

        const products = await db.product.findMany({
                skip: (pageNumber - 1) * pageSizeNumber,
                take: pageSizeNumber,
                where: {
                    ...(keyWord && {
                        name: {
                            contains: keyWord,
                            mode: 'insensitive',
                        },
                    }),
                }
            })

            const total = await db.product.count();

            return Response.json({
                success: true,
                message: 'Products successfully fetched',
                payload: {
                    products: products,
                    meta: {
                        total
                    }
                }
            })
    } catch (error) {
        return handleApiErrors(error)
    }
}

export async function POST(req: Request) {
    const body = await req.json()
    const { name }: Prisma.ProductCreateInput = body;
    try {
        let product = await db.product.findUnique({
            where: {
                name
            }
        })

        if (product) {
            return Response.json({
                success: false,
                message: 'Product already Exist',
                payload: null
            });
        }
        product = await db.product.create({
            data: {
                ...body
            }
        })

        return Response.json({
            success: true,
            message: 'Product Successfully Created',
            payload: product
        })
    } catch (error) {
        return handleApiErrors(error)
    }

}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const id = searchParams.get('id')
        if (id) {
            await db.product.delete({
                where: {
                    id: +id
                }
            })
            return Response.json({
                success: true,
                message: 'Products successfully deleted',
                payload: {
                    products: null,

                }
            })

        }
    } catch (error) {
        return handleApiErrors(error)
    }

}