import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { InsuranceApi } from "../src/api/InsuranceApi";
import { UserType } from "../src/api/UserType";
import { useAuthContext } from "../src/auth/AuthContext";


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

    if (!router.query.noaccess) {
        return <><CircularProgress />You will be redirected soon</>;
    }

    return (
            <>
            <h1>Thank you for registering.</h1>
            <p>An account for you has been created on the system, but it's peding approval by the administrator.</p>
            <p>Please try again later or contact the Aministrator to check for status.</p>
            </>
        );

};

export default Authorize;