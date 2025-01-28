import SBreadcrumbs from "@/components/SBreadcrumbs";
import HomeIcon from "@assets/icons/home.svg?react";
import Cookies from "js-cookie";
import React from "react";
import { Breadcrumb } from "react-aria-components";
import { Breadcrumbs } from "react-aria-components";
import { NavLink } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import ArrowIcon from "@assets/icons/acrd-open.svg?react";

export default function Builder(props) {
	const [searchParams, setSearchParams] = useSearchParams();

	//If my host is localhost, make another statement
	let url = import.meta.env.VITE_BUILDER_URL;

	const tokenCookie = Cookies.get("token");

	let isAPIIDSet = false;
	if (searchParams.get("APIID")) {
		url = `${url}?APIID=${searchParams.get("APIID")}`;
		isAPIIDSet = true;
	}
	if (isAPIIDSet) {
		url = `${url}&token=${tokenCookie}`;
	} else {
		url = `${url}?token=${tokenCookie}`;
	}

	return (
		<>
			<div className="flex flex-grow flex-col">
				<div className="mx-8 mt-6 mb-4">
					<Breadcrumbs className="gap-[10px] flex ">
						<Breadcrumb>
							<NavLink
								to={"/dashboard"}
								className="flex items-center gap-[10px]"
							>
								<div className="flex items-center p-[8px] gap-[5px] bg-grey-2 rounded-[5px]">
									<HomeIcon alt="home" className="icon-grey-5" />
									<div class="text-[#aeaeae] text-xs font-semibold font-['Inter'] leading-3">
										Home
									</div>
								</div>

								<ArrowIcon alt="arrow" className="icon-white" />
							</NavLink>
						</Breadcrumb>

						<Breadcrumb>
							<NavLink
								to={"/dashboard"}
								className="flex items-center gap-[10px]"
							>
								<div className="flex items-center p-[8px] gap-[5px] bg-grey-2 rounded-[5px]">
									<HomeIcon alt="home" className="icon-grey-5" />
									<div class="text-[#aeaeae] text-xs font-semibold font-['Inter'] leading-3">
										Builder
									</div>
								</div>
							</NavLink>
						</Breadcrumb>
					</Breadcrumbs>
				</div>
				<div className="flex flex-grow items-center justify-center">
					<iframe
						title="builder"
						src={url}
						className="flex-grow h-full inline-block"
					/>
				</div>
			</div>
		</>
	);
}
