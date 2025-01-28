import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import SBreadcrumbs from "@/components/SBreadcrumbs";
import STabs from "@/components/STabs";
import ApiCubes from "@assets/icons/api-cubes.svg?react";
import PlusIcon from "@assets/icons/plusIcon.svg?react";
import SButton from "@components/SButton";
import { GeneralContext } from "@contexts/GeneralContext.jsx";
import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiCards from "./ApiCards";
import PublicApis from "./PUBLICApisDumyData.json";

export default function MyApis() {
	const {myAPIs} = useContext(GeneralContext);

	const navigate = useNavigate();
	const [searchText, setSearchText] = useState('');
	const [selectedTab, setSelectedTab] = useState("My APIs");
	const getSelectedtab = (value) => {
		setSelectedTab(value);
	};

	const filteredAPIs = useMemo(() => {
		let list = [];
		if (searchText === "") {
			list = [...myAPIs];
		} else {
			list = [...myAPIs.filter(myApi => {
				const {API = {}} = myApi;
				return API.name?.toLowerCase().includes(searchText.toLowerCase())
			})]
		}

		return list;
	}, [searchText, myAPIs]);

	return (
		<div className="w-full h-screen flex flex-col gap-10 pl-8 p-10">
			<SBreadcrumbs />
			<div className="w-full flex items-center">
				<STabs
					getSelectedTab={getSelectedtab}
					childWithSibling="flex"
					tabListBSibling={
						<div className="w-1/2 flex flex-col gap-2">
							<span className="text-[28px] font-medium leading-larger">
								{selectedTab}
							</span>
							<span
								className="w-full max-w-[585px] text-base font-normal text-grey-17 font-['Inter'] tracking-wide">
								Here you can see all the APIs you've integrated into your projects. Feel free to upload any new API you'd like to use.
							</span>
						</div>
					}
					tabListSibling={
						<div className="flex gap-5 items-center">
							<CustomInput
								variant="searchBox"
								className="max-w-[365px] w-full"
								inputClassName="w-full"
								placeholder="Search"
								onChange={(e) => setSearchText(e.target.value)}
							/>
							<div className="flex items-center">
								<Button
									className="gap-2 w-max"
									variant="primary"
									onClick={() => navigate(`/my-apis/add-api`)}
								>
									<PlusIcon />
									<span className="text-lg font-bold">New API</span>
								</Button>

								<div className="flex gap-5">
									<SButton
										sType="button"
										onClick={() => { }}
										className=" px-[15px] !h-10 ml-4 py-2 bg-grey-2 rounded-[50px] shadow justify-center items-center gap-0.5 inline-flex w-max"
									>
										<div className="flex gap-[5px] grow shrink basis-0 text-center !text-white text-xs font-semibold font-['Inter'] leading-[14px] tracking-normal items-center">
											<ApiCubes className="icon-grey-5 h-[14px]" />
											API Builder
										</div>
									</SButton>
								</div>
							</div>
						</div>
					}
					tabStyles={{
						tabContent: "!p-0 !w-full flex flex-col gap-6",
						tabChild: "justify-between items-center",
						tabListStyle: "flex w-[200px] bg-grey-15 px-2 py-0 h-11 text-grey-17 rounded items-center mr-5",
						activeTab: "!bg-grey-13"
					}}
					tabs={[
						{
							name: "My APIs",
							children: <ApiCards filteredAPIs={filteredAPIs} />
						},
						{
							name: "Public APIs",
							children: <ApiCards isPublic filteredAPIs={PublicApis} />
						},
					]}
				/>
			</div>
		</div>
	);
}
