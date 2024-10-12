import db from "@/lib/db";
import { handleApiErrors } from "@/app/_utils/errorHandler";
import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";



export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const page = searchParams.get('page') || '1';
        const pageSize = searchParams.get('pageSize') || '10';
        const keyWord = searchParams.get('keyWord');
        const status = searchParams.get('status') as STATUS;
        const endDate = searchParams.get('endDate');
        const startDate = searchParams.get('startDate');
        const pageNumber = parseInt(page as string, 10) || 1;
        const pageSizeNumber = parseInt(pageSize as string, 10) || 10;


        const transactions = await db.transaction.findMany({
            skip: (pageNumber - 1) * pageSizeNumber,
            take: pageSizeNumber,
            where: {
                ...(keyWord && {
                    name: {
                        contains: keyWord,
                        mode: 'insensitive',
                    },
                }),
                ...(status && {
                    status: {
                        equals: status,
                    },
                }),
                ...(startDate && endDate && {
                    created_at: {
                        gte: startDate,
                        lte: endDate,
                    },
                }),
            },
            include: {
                items: true
            }
        })

        const total = await db.transaction.count();

        return Response.json({
            success: true,
            message: 'Transactions successfully fetched',
            payload: {
                transactions: transactions,
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
    const body: Prisma.TransactionCreateInput = await req.json();
    if (!body.items || !Array.isArray(body.items)) {
        throw new Error("Items array is required.");
    }

    console.log(
        body.items.map(item => ({
            description: item.description,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.total,
            productId: item.id
        }))
    );

    try {
        const transaction = await db.transaction.create({
            data: {
                name: body.name,
                total: body.total,
                items: {
                    createMany: {
                        data: body.items.map(item => ({
                            description: item.description,
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity,
                            total: item.total,
                            product_id: item.id
                        }))
                    }
                }
            }
        })

        return Response.json({
            success: true,
            message: 'Transaction Successfully Created',
            payload: transaction
        })
    } catch (error) {
        return handleApiErrors(error)
    }

}