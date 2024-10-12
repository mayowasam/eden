import db from "@/lib/db";
import { hash } from "bcrypt";

import { handleApiErrors } from "@/app/_utils/errorHandler";
import { Prisma } from "@prisma/client";
export async function GET() {
    try {
        return Response.json({
            success: true,
            payload: true
        })
    } catch (error) {
        return handleApiErrors(error)
    }

}

export async function POST(req: Request) {
    const body = await req.json()
    const { name, email, password, phone }: Prisma.UserCreateInput = body;
    try {
        let user = await db.user.findUnique({
            where: {
                email
            }
        })

        if (user) {
            return Response.json({
                success: false,
                message: 'User already Exist',
                payload: null
            });
        }
        const hashedPassword = await hash(password, 10);
        user = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                phone,
                name
            }
        })

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _ , ...rest } = user;
        
        return Response.json({
            success: true,
            message: 'User Successfully Created',
            payload: rest
        })
    } catch (error) {        
        return handleApiErrors(error)
    }

}