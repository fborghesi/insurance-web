import { useRouter } from "next/router";
import { useEffect } from "react";
import { InsuranceApi, UserType } from "../src/api/InsuranceApi";
import { useAuthContext } from "../src/auth/AuthContext";


const Authorize = () => {
    const router = useRouter();
    const authContext = useAuthContext();

    useEffect(() => {
        if (router.isReady) {
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

    return <>You will be redirected soon</>;
};

export default Authorize;