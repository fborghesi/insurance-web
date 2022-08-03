import axios, { AxiosError, AxiosRequestConfig } from "axios";


type ExpiredTokenCallback = () => void;

export type CredentialsType = {
    email: string;
    password: string;
};

export type UserType = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    is_admin: boolean;
    is_active: boolean;
    token: string;
};

export type ServerLoginResponseType = {
    message: string;
    data: UserType;
};

const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
    headers: {
        "Content-Type": "application/json",
    },
});

const extract_error_msg = (
    e: unknown,
    defaultMsg: string = "Operation failed. Please check your connectivity and try again."
): string => {
    let msg = defaultMsg;

    if (e) {
        if (e instanceof AxiosError) {
            msg = e.response?.data ?? e.message;
        } else if (e instanceof Error) {
            msg = (e as Error).message;
        } else {
            msg = e as string;
        }
    }

    return msg;
};

let reqInterceptorId = -1;
let resInterceptorId = -1;

export const InsuranceApi = {
    setApiToken: (
        token: string | undefined,
        expiredTokenHandler: ExpiredTokenCallback
    ) => {
        if (reqInterceptorId >= 0) {
            axiosInstance.interceptors.request.eject(reqInterceptorId);
        }

        reqInterceptorId = axiosInstance.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                if (config && config.headers) {
                    // config.headers["x-access-token"] = token as string;
                    config.headers["Authorization"] = token as string;
                    return config;
                }
            }
        );

        if (resInterceptorId >= 0) {
            axiosInstance.interceptors.response.eject(resInterceptorId);
        }
        resInterceptorId = axiosInstance.interceptors.response.use(
            (res) => res,
            (err) => {
                if (err instanceof AxiosError) {
                    if (err.response && err.response.status === 401) {
                        expiredTokenHandler();
                    }
                    throw err.response?.data ?? err.message;
                }
            }
        );
    },

    login: async (credentials: CredentialsType): Promise<UserType> => {
        try {
            const response = await axiosInstance.post("/user/login", {
                email: credentials.email,
                password: credentials.password,
                // provider: "local",
            });
            if (response.data.message === "Success") {
                return Promise.resolve(response.data.data);
            } else {
                return Promise.reject(
                    JSON.parse(response.data.error)._schema[0]
                );
            }
        } catch (e) {
            return Promise.reject(extract_error_msg(e));
        }
    },

    carModel: async (file: File): Promise<string> => {
        const response = await axiosInstance.post("/car-model", file, {
            headers: {
                "Content-Type": file.type,
            },
        });
        if (response.data.message === "Success") {
            return Promise.resolve(response.data.data);
        }
        else {
            console.log("ERROR on CarModel response", response);
            return Promise.reject(response.data.message);
        }
    },
};
