
// import axios from "axios";
// export const axiosInstance = axios.create({});

// export const apiConnector = (method,url,bodyData,headers,params)=>{
//     return axiosInstance({
//         method:`${method}`,
//         url:`${url}`,
//         data:bodyData?bodyData:null,
//         headers:headers?headers:null,
//         params:params?params:null
//     })
// }

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export const axiosInstance: AxiosInstance = axios.create({});

export const apiConnector = (
  method: string,
  url: string,
  bodyData?: any,
  headers?: any,
  params?: any
): Promise<AxiosResponse> => {
    console.log("dattttt",bodyData);
  const config: AxiosRequestConfig = {
    method: method,
    url: url,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null
  };

  return axiosInstance(config);
};

