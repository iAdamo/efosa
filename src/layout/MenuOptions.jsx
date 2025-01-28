import { SMenuItem } from "@/components/MenuDropdown";
import SBadge from "@/components/SBadge";
import Cookies from "js-cookie";
import React from "react";
import { Header } from "react-aria-components";
import { Section } from "react-aria-components";
import { Button } from "react-aria-components";
import { useNavigate } from "react-router-dom";
import Modules from "@assets/icons/modules.svg?react";
import LightMode from "@assets/icons/light-mode.svg?react";
import Help from "@assets/icons/help.svg?react";
import Signout from "@assets/icons/sign-out.svg?react";
import Tick from "@assets/icons/tick.svg?react";
import { GeneralContext } from "@/contexts/GeneralContext";
import { useContext } from "react";

const LogoutButton = () => {
	const navigate = useNavigate();
	return (
		<SMenuItem
			className="flex gap-1 justify-start items-center"
			onAction={() => {
				Cookies.remove("token", { path: "/" });
				navigate("/login");
			}}
		>
			<div className="h-5 w-5 flex justify-center items-center">
				<Signout alt="signOut" />
			</div>
			Sign Out
		</SMenuItem>
	);
};

function MenuOptions() {
	const { companyName } = useContext(GeneralContext);
	return (
		<>
			<Section className="pb-[8px] menu-item-divider-bottom">
				<Header className="p-[5px] text-grey-5">
					<div class="text-[#aeaeae] text-xs font-medium font-['Inter'] leading-3">
						My account
					</div>
				</Header>
				<SMenuItem className="flex items-center gap-[10px]">
					<div className="flex gap-1">
						<Tick alt="tick" className="icon-grey-5" />
						<span>{companyName}</span>
					</div>
					<SBadge label="PARTNER" />
				</SMenuItem>
			</Section>

			<Section>
				<LogoutButton />
			</Section>
		</>
	);
}

export default MenuOptions;
