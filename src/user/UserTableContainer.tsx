import { CircularProgress } from "@mui/material";
import { useCallback, useEffect } from "react";
import { InsuranceApi } from "../api/InsuranceApi";
import { UserType } from "../api/UserType";
import { useAsync } from "../utils/useAsync";
import Backdrop from "@mui/material/Backdrop";
import UserTable from "./UserTable";

const UserTableContainer = () => {
    const {
        execute: getUsers,
        status: getUsersStatus,
        value: users,
        error: usersError,
    } = useAsync<UserType[], undefined>(InsuranceApi.getUsers);

    const {
        execute: toggleAdmin,
        status: toggleAdminStatus,
        value: toggleAdminUser,
        error: toggleAdminError,
    } = useAsync<UserType, string>(async (userId: string) => {
        const user = await InsuranceApi.getUser(userId);
        user.is_admin = !user.is_admin;        
        await InsuranceApi.updateUser(user);
        return user;
    });

    const {
        execute: toggleActive,
        status: toggleActiveStatus,
        value: toggleActiveUser,
        error: toggleActiveError,
    } = useAsync<UserType, string>(async (userId: string) => {
        const user = await InsuranceApi.getUser(userId);
        user.is_active = !user.is_active;
        await InsuranceApi.updateUser(user);
        return user;
    });


    const deleteUserHandler = async (userId: string) => {
        await InsuranceApi.deleteUser(userId as string);
        getUsers(undefined);
    };

    const toggleAdminHandler = async (userId: string) => {
        toggleAdmin(userId);
    };

    const toggleActiveHandler = async (userId: string) => {
        toggleActive(userId);
    };

    useEffect(() => {
        if (getUsersStatus === "idle") {
            getUsers(undefined);
        }
    }, [getUsers, getUsersStatus]);

    const updateUser = useCallback((user: UserType) => {
        for (let i = 0; i < users!.length; i++) {
            let u = users![i] as UserType;
            if (u.id == user.id) {
                u.is_admin = user.is_admin;
                u.is_active = user.is_active;
            }
        }
    }, [users]);

    useEffect(() => {
        if (toggleAdminStatus === "success") {
            updateUser(toggleAdminUser!);
        }
        if (toggleActiveStatus === "success") {
            updateUser(toggleActiveUser!);
        }
    }, [getUsers, toggleAdminStatus, toggleActiveStatus, users, toggleAdminUser, toggleActiveUser, updateUser]);


    const inProgress = getUsersStatus === "pending" || toggleAdminStatus === "pending" || toggleActiveStatus === "pending";

    return (
        <>
            <h1>Users</h1>
            <Backdrop open={inProgress} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                {inProgress && <CircularProgress color="inherit" />}
            </Backdrop>
            <UserTable
                    users={(users ?? new Array()) as UserType[]}
                    onDelete={deleteUserHandler}
                    onToggleAdmin={toggleAdminHandler}
                    onToggleActive={toggleActiveHandler}
                />

        </>
    );
};

export default UserTableContainer;
