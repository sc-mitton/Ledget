import React from "react";
import { Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const UserContextLayout = () => {
    return (
        <AuthContext>
            <Outlet />
        </AuthContext>
    );
}

export default UserContextLayout;
