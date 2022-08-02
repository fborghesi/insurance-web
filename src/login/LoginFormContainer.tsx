import { Alert, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { CredentialsType, InsuranceApi, UserType } from "../api/InsuranceApi";
import { useAuthContext } from "../auth/AuthContext";
import { useAsync } from "../utils/useAsync";
import LoginForm, { LoginFormType } from "./LoginForm";

const LoginFormContainer = () => {
    const router = useRouter();
    const errorMessage = router.isReady ? router.query?.errorMessage : "";
    const { execute, status, value: user, error } = useAsync<
        UserType,
        CredentialsType
    >(InsuranceApi.login);
    const authContext = useAuthContext();

    useEffect(() => {
        if (status == "success" && user) {
            authContext!.setUser(user as UserType);
            router.push("/");
        }
    }, [authContext, status, user, router]);

    const onLoginHandler = (values: LoginFormType) => {
        execute({
            email: values.email as string,
            password: values.password as string,
        });
    };

    if (status == "success") {
        return <></>;
    }
    
    if (status != "idle") {
        return <CircularProgress />
    }

    return (
        <>
            <h1>Login</h1>
            {(error || errorMessage)&& <Alert severity="error">{error || errorMessage}</Alert>}
            <LoginForm onLogin={onLoginHandler} />
        </>
    );
};

export default LoginFormContainer;
