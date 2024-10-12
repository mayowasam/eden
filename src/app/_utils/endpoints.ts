
import { AxiosError, AxiosResponse } from "axios";
import {  baseInstance, uploadInstance } from "./query";

class API {
  async upload(data: FormData): Promise<AxiosResponse<FileUploadResponse>> {
    try {
      const response = await uploadInstance.post("/upload", data);
      return response;
    } catch (error) {
      throw error as AxiosError;
    }
  }

 
  async signUp(data: RequestSignUp): Promise<AxiosResponse<ResponseResult<User>>> {
    try {
      const response = await baseInstance.post("/user", data);
      return response;
    } catch (error) {
      throw error as Promise<AxiosError<ResponseError>>;
    }
  }

  async addItem(data: Product): Promise<AxiosResponse<ResponseResult<Product>>> {
    try {
      const response = await baseInstance.post("/food", data);
      return response;
    } catch (error) {
      throw error as Promise<AxiosError<ResponseError>>;
    }
  }

  async getItems({   
    page,
    pageSize,
    keyWord
  }: {  
    page?: number;
    pageSize?: number;
    keyWord?: string;
  }): Promise<AxiosResponse<Paged<Products<Product>>>> {
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', String(page));
      if (pageSize) params.append('pageSize', String(pageSize));
      if (keyWord) params.append('keyWord', keyWord);

      const queryString = params.toString(); // Generate query string
      const url = `/food${queryString ? `?${queryString}` : ''}`;
      const response = await baseInstance.get(url);
      return response;
    } catch (error) {
      throw error as Promise<AxiosError<ResponseError>>;
    }
  }

  async deleteItem(id: number): Promise<AxiosResponse<ResponseResult<null>>> {
    try {
      const response = await baseInstance.delete(`/food?id=${id}`);
      return response;
    } catch (error) {
      throw error as Promise<AxiosError<ResponseError>>;
    }
  }
  async addTransactions(data: Partial<Transaction>): Promise<AxiosResponse<ResponseResult<Transaction>>> {
    try {
      const response = await baseInstance.post("/transaction", data);
      return response;
    } catch (error) {
      throw error as Promise<AxiosError<ResponseError>>;
    }
  }

  async getTransactions({   
    page,
    pageSize,
    keyWord,
    status,
    startDate,
    endDate
  }: {  
    page?: number;
    pageSize?: number;
    keyWord?: string;
    startDate?: string;
    endDate?: string;
    status?: string;

  }): Promise<AxiosResponse<Paged<Transactions<Transaction>>>>{
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', String(page));
      if (pageSize) params.append('pageSize', String(pageSize));
      if (keyWord) params.append('keyWord', keyWord);
      if (startDate) params.append('startDate', new Date(startDate).toISOString());
      if (endDate) params.append('endDate', new Date(endDate).toISOString());
      if (status) params.append('status', status);
      const queryString = params.toString(); // Generate query string
      const url = `/transaction${queryString ? `?${queryString}` : ''}`;
      const response = await baseInstance.get(url);
      return response;
    } catch (error) {
      throw error as Promise<AxiosError<ResponseError>>;
    }
  }

}

export const Api = new API();
