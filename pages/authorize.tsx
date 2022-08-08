import { CircularProgress, Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { UserType } from "../src/api/UserType";
import { useAuthContext } from "../src/auth/AuthContext";
import LoginIcon from '@mui/icons-material/Login';
import { Box } from "@mui/system";


const Authorize = () => {
    const router = useRouter();
    const authContext = useAuthContext();

    useEffect(() => {
        if (router.isReady && router.query.id) {
            const {id, first_name, last_name, email, is_admin, is_active, token} = router.query;
            const user = {
                id: id as string,
                first_name: first_name as string,
                last_name: last_name as string,
                email: email as string,
                is_admin: (is_admin as string).toLowerCase() === "true",
                is_active: (is_active as string).toLowerCase() === "true",
                token: token as string,
            }
            
            authContext!.setUser(user as UserType);
            router.replace("/");
        }
    }, [authContext, router]);

    if (!router.isReady) {
        return <CircularProgress />;
    }
    console.log(router.query);

    if (!router.query.noaccess && router.query.id) {
        return <><CircularProgress />You will be redirected soon</>;
    }

    return (
            <Box width="600px">
            <h1>Thank you for registering.</h1>
            <p>An account for you has been created on the system, but it is peding approval by the administrator.</p>
            <p>Please try again later or contact the Aministrator to check for status.</p>
            <Box style={{display: 'block', width: '250px', marginTop: '50px', margin: '0 auto',}}>
            <Button style={{width: '100%'}} variant="contained" startIcon={<LoginIcon />} onClick={() => router.replace("/login")}>Back to login</Button>
            </Box>
            </Box>
        );

};

export default Authorize;