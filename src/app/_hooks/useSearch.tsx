"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export default function UseSearch() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )


    const updateSearchParams = useCallback(
        (path:string, name:string, value: string ="0", next?:string) => {
            let newQueryString = createQueryString(name, value);
            if (next) {
                newQueryString += `&${next}`;
            }
            router.push(`${path}?${newQueryString}`);
        },
        [createQueryString, router]
    );

    return updateSearchParams;
}