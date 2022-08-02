import { getCookie, deleteCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { Context, useCallback, useEffect } from "react";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { InsuranceApi, UserType } from "../api/InsuranceApi";

//import jwt_decode from "jwt-decode";

const USER_KEY = "user";

export type AuthContextType = {
    user: UserType | null;
    setUser: (User: UserType) => void;
    unsetUser: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = (props: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [isUserReady, setUserReady] = useState<boolean>(false);
    const router = useRouter();

    const logout = useCallback(() => {
        router.replace(
            `/logout?errorMessage=${encodeURIComponent(
                "Your session has expired, please log in again."
            )}`
        );
    }, [router]);

    const setAuthUser = useCallback(
        (newUser: UserType | null) => {
            if (user?.token != newUser?.token) {
                setCookie(USER_KEY, JSON.stringify(newUser));
                setUser(newUser);
                InsuranceApi.setApiToken(newUser?.token, logout);
                setUserReady(true);
            }
        },
        [logout, user]
    );

    const unsetAuthUser = useCallback(() => {
        setUser(null);
        deleteCookie(USER_KEY);
        InsuranceApi.setApiToken(undefined, logout);
    }, [logout]);

    useEffect(() => {
        const jsonUser = getCookie(USER_KEY)?.toString();
        if (jsonUser) {
            const cookieUser = JSON.parse(jsonUser);
            setAuthUser(cookieUser);
        }
        setUserReady(true);
    }, [setAuthUser]);

    const authContextMemo = useMemo(
        () => ({
            user,
            setUser: setAuthUser,
            unsetUser: unsetAuthUser,
        }),
        [setAuthUser, unsetAuthUser, user]
    );

    if (!isUserReady) {
        return <></>;
    }

    return (
        <AuthContext.Provider value={authContextMemo}>
            {props.children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw Error("Attempted to read context value outside of provider");
    }

    return context;
};
