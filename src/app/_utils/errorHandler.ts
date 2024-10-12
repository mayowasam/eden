import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";


export function handleApiErrors(error: unknown) {
    if (error instanceof PrismaClientValidationError || error instanceof PrismaClientKnownRequestError) {
        return new Response(
            JSON.stringify({
                success: false,
                message: `${error.message.replaceAll(/\n/g, ' ')}`,
                payload: null
            })
            , {
                status: 422,
            });
    } else if (error instanceof Error) {
        return new Response(JSON.stringify({
            success: false,
            message: `Server error: ${error.message}`,
            payload: null
        })
            , {
                status: 500,
            });
    } else {
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Unknown error occurred',
                payload: null
            })
            , {
                status: 500,
            });
    }
}


