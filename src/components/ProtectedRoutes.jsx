import React from "react";

import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import GeneralWrapper from "../contexts/GeneralContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/layout/dashboard/Sidebar";

const ProtectedRoutes = () => {
	const navigate = useNavigate();
	useEffect(() => {
		if (!Cookies.get("token")) navigate("/login");
	}, [navigate]);

	return (
		<GeneralWrapper>
			<Outlet />
		</GeneralWrapper>
	);
};

export default ProtectedRoutes;
