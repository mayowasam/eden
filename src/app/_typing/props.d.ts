import type { FormInstance, GetProp, UploadFile, UploadProps } from 'antd';
import { AxiosResponse } from 'axios';
import { Dispatch, SetStateAction, ReactNode } from "react";
import { UseMutateAsyncFunction } from "@tanstack/react-query";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type UploadComponentProps = {
    fileList: UploadFile[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFileList: Dispatch<SetStateAction<UploadFile<any>[]>>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutateAsync: UseMutateAsyncFunction<AxiosResponse<ApiFileUploadResponse, any>, Error, FormData, unknown>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: FormInstance<any>,
    fileName: string,
    previewImage: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setPreviewImage: Dispatch<any>,
    previewOpen: boolean,
    setPreviewOpen: Dispatch<SetStateAction<boolean>>,
    dragAreaText?: ReactNode | string,
    validType?: string[]
}