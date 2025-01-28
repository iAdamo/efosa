import React from "react";
import SInput from "../../components/SInput";
import SForm from "../../components/SForm";
import SButton from "../../components/SButton";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { login } from "../../axios/apiCalls";
import Logo from "@assets/icons/logo.svg?react";
import { Group } from "react-aria-components";
import { SCheckbox } from "../../components/SCheckbox";
import { useState } from "react";
import loadingGif from "@assets/loaders/specc_loader_grad_dark.gif";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { routeAnim } from "@/animations";

function Login() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (Cookies.get("token") !== undefined) {
			navigate("/dashboard");
		}
	}, [navigate]);
	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			const formData = Object.fromEntries(new FormData(e.currentTarget));
			setLoading(true);
			const data = await login({
				email: formData.email,
				password: formData.password,
			});
			Cookies.set("token", data.access_token, { path: "/" });
			navigate("/dashboard");
			setLoading(false);
		} catch (err) {
			console.error("err", err);
			setError(err.response.data.message);
			setLoading(false);
		}
	};
	return (
		<div className="flex flex-col justify-center items-center h-screen gap-[40px]">
			<AnimatePresence mode="wait">
				<motion.form
					{...routeAnim}
					layout
					onSubmit={submitHandler}
					onChange={() => setError("")}
					className="flex flex-col gap-4 bg-[#080808] rounded-containers px-5 py-[100px] w-[350px] shadow-2xl"
				>
					{loading ? (
						<img src={loadingGif} className="p-[100px]" alt="loading" />
					) : (
						<>
							<Logo className="h-[100px] w-fit self-center" />
							<div className="flex flex-col gap-[5px] ">
								<label className="text-grey-5">Email</label>
								<SInput
									name="email"
									type="email"
									required
									placeholder="Enter email"
								/>
							</div>
							<div className="flex flex-col gap-[5px] ">
								<label className="text-grey-5">Password</label>
								<SInput
									name="password"
									type="password"
									required
									placeholder="Enter password"
								/>
							</div>

							<SCheckbox>
								<span className="label-large flex gap-x-1">
									<span className="text-grey-5">Remember Me</span>
								</span>
							</SCheckbox>

							<Group
								className={"mt-[40px] flex items-center justify-end gap-5"}
							>
								<span className="text-grey-5 underline cursor-pointer">
									Forgot Password?
								</span>
								<SButton type="submit" sType={"build"} className={"w-[110px]"}>
									Submit
								</SButton>
							</Group>
							{error && (
								<span className="text-status-error capitalize">{error}</span>
							)}
						</>
					)}
				</motion.form>
			</AnimatePresence>
		</div>
	);
}

export default Login;
