import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/app.css";
import { routes } from "./routes";
import { Toaster } from "sonner";
import ReactionsHandler from "./layout/reactions/ReactionsHandler";

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")).render(
	<>
		<Toaster
			position="bottom-left"
			toastOptions={{
				unstyled: true,
				classNames: {
					toast: "flex p-[15px] gap-[10px] items-center rounded-base w-full",
					success:
						"bg-status-success/[.5] backdrop-blur-lg border border-status-success/[.8]",
					error:
						"bg-status-error/[.5] backdrop-blur-lg border border-status-error/[.8]",
					warning:
						"bg-status-warning/[.5] backdrop-blur-lg border border-status-warning/[.8]",
				},
			}}
		/>
		<ReactionsHandler />
		<RouterProvider router={router} />
	</>,
);
