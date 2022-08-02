import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserInfo } from "os";
import React from "react";
import { UserType } from "../api/InsuranceApi";
import { useAuthContext } from "../auth/AuthContext";

const formatUserName = (user: UserType) => {
    return `${user.first_name} ${user.last_name}`;
};

const DEFAULT_LOGOUT_PATH = "/logout";

type AppNavBarProps = {
    logoutPath?: string;
};

const AppNavBar = (props: AppNavBarProps) => {
    const authContext = useAuthContext();
    const router = useRouter();

    const logoutClickHandler = () => {
        router.push(props.logoutPath ?? DEFAULT_LOGOUT_PATH);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 0, margin: "5px" }}
                    >
                        <Link href={"/car-model"}>Car Model</Link>
                    </Typography>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 0, margin: "5px" }}
                    >
                        <Link href={"/object-model"}>Object Model</Link>
                    </Typography>
                    <Typography component="div" sx={{ flexGrow: 1, margin: "5px" }} />
                    {authContext.user && (
                        <Button color="inherit" onClick={logoutClickHandler}>
                            Logout {formatUserName(authContext.user)}
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default AppNavBar;
