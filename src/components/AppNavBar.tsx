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
import { UserType } from "../api/UserType";
import { useAuthContext } from "../auth/AuthContext";

const formatUserName = (user: UserType) => {
    return `${user.first_name} ${user.last_name}`;
};

const DEFAULT_LOGOUT_PATH = "/logout";

type AppNavBarProps = {
    logoutPath?: string;
};

const AppNavBar = (props: AppNavBarProps) => {
    const {user} = useAuthContext();
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
                        sx={{ flexGrow: 0, margin: "14" }}
                    >
                        <Link href={"/car-model"}>Cars</Link>
                    </Typography>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 0, margin: "15px" }}
                    >
                        <Link href={"/object-model"}>Objects</Link>
                    </Typography>
                    {user && user.is_admin && (
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 0, margin: "15px" }}
                        >
                            <Link href={"/admin/users"}>Users</Link>
                        </Typography>
                    )}
                    <Typography component="div" sx={{ flexGrow: 1, margin: "5px" }} />
                    {user && (
                        <Button color="inherit" onClick={logoutClickHandler}>
                            Logout {formatUserName(user)}
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default AppNavBar;
