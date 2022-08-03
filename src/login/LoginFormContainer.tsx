import { Alert, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { CredentialsType, InsuranceApi, UserType } from "../api/InsuranceApi";
import { useAuthContext } from "../auth/AuthContext";
import { useAsync } from "../utils/useAsync";
import GoogleButton from "react-google-button";
import LoginForm, { LoginFormType } from "./LoginForm";
import { Box } from "@mui/system";

const GOOGLE_SCOPE = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
].join(" ");


const LoginFormContainer = () => {
    const router = useRouter();
    const errorMessage = router.isReady ? router.query?.errorMessage : "";
    const {
        execute,
        status,
        value: user,
        error,
    } = useAsync<UserType, CredentialsType>(InsuranceApi.login);
    const authContext = useAuthContext();

    const openGoogleLoginPage = () => {
        const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
        const redirectUri = "user/login";

        console.log("process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
        console.log("process.env.NEXT_PUBLIC_BACKEND_URL", process.env.NEXT_PUBLIC_BACKEND_URL);

        const params: URLSearchParams = {
            response_type: "code",
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            redirect_uri: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${redirectUri}`,
            prompt: "select_account",
            access_type: "offline",
            scope: GOOGLE_SCOPE,
        };

        const urlParams = new URLSearchParams(params).toString();
        //const authWindow = window.open(`${googleAuthUrl}?${urlParams}`, 'Authentication', 'toolbar=1,location=1,directories=1,status=1,menubar=1,scrollbars=1,resizable=1');
        //authWindow.close();
        router.replace(`${googleAuthUrl}?${urlParams}`);

    };

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
        return <CircularProgress />;
    }

    return (
        <>
            <h1>Login</h1>
            {(error || errorMessage) && (
                <Alert severity="error">{error || errorMessage}</Alert>
            )}
            <LoginForm onLogin={onLoginHandler} />

            <Box
                width={"100%"}
                display="flex"
                justifyContent={"center"}
                marginTop={"40px"}
            >
                <GoogleButton
                    onClick={openGoogleLoginPage}
                />
            </Box>
        </>
    );
};

export default LoginFormContainer;
