import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import SSelectDropDown, { DropdownItem } from "@/components/SSelectDropdown";
import SSidebar from "@/components/SSidebar/SSidebar";
import Loading from "@/components/loaders/Loading";
import { PagesContext } from "@/contexts/PagesContext";
import { WizardContext } from "@/contexts/WizardContext";
import useGlobalStore from "@/store/globalStore";
import { ELEMENTS } from "@/store/uiSlice";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useStoreApi } from "@xyflow/react";
import Fuse from "fuse.js";
import { useContext, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import OperationNodeComponent from "./OperationNodeComponent";

const selector = (state) => ({
	operationNodesConfig: state.operationNodesConfig,
	addOperationNode: state.addOperationNode,
	setSidebar: state.UI.setSidebar,
});

export default function OperationNodesSidebar() {
	const { setModal, setSidebar } = useGlobalStore((s) => ({
		setModal: s.UI.setModal,
		setSidebar: s.UI.setSidebar,
	}));
	const { operationNodesConfig, addOperationNode } = useGlobalStore(
		useShallow(selector),
	);
	const store = useStoreApi();
	const { setShowDataInspector } = useContext(WizardContext);
	const [operationNodes, setOperationNodes] = useState(operationNodesConfig);
	const [searchString, setSearchString] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [selectedFilter, setSelectedFilter] = useState("All");
	const { speccID } = useContext(PagesContext);
	const [openIndex, setOpenIndex] = useState(-1);
	
	const handleToggleAccordion = (index) => {
		setOpenIndex(openIndex === index ? -1 : index);
	}

	useEffect(() => {
		if (!operationNodesConfig) return;
		setIsLoading(false);
		setOperationNodes(operationNodesConfig);
	}, [operationNodesConfig]);

	const fuseOptions = {
		// isCaseSensitive: false,
		includeScore: true,
		// shouldSort: true,
		includeMatches: true,
		findAllMatches: true,
		minMatchCharLength: 1,
		// location: 0,
		threshold: 0.1,
		// distance: 100,
		//useExtendedSearch: true,
		//ignoreLocation: true,
		// ignoreFieldNorm: false,
		// fieldNormWeight: 1,
		keys: ["name"],
	};

	useEffect(() => {
		if (searchString === "") {
			setOperationNodes(operationNodesConfig);
			return;
		}
		const fuse = new Fuse(operationNodesConfig, fuseOptions);
		const result = fuse.search(searchString);
		const list = [];
		result.map((item) => {
			list.push(item.item);
		});
		setOperationNodes(list);
	}, [searchString, operationNodes, operationNodesConfig]);

	const addNodeHandler = async (node) => {
		addOperationNode(node.id);
	}

	const filterItems = (filterOption) => {
		if (filterOption === "All") {
			setOperationNodes(operationNodesConfig);
			return;
		}
		if (filterOption === "Transformative") {
			setOperationNodes(
				operationNodesConfig.filter((item) => {
					return item.package === "TypeTransformation";
				}),
			);
			return;
		}
		setOperationNodes(
			operationNodesConfig.filter((item) => {
				return item.package === filterOption;
			}),
		);
	};

	return (
		<SSidebar sidebarClassName=" bg-[#1e2125] py-3 operation-node-sidebar flex flex-col col-width-[2.5/12] gap-6 max-w-[332px] h-full rounded-api-component max-h-[695px]">
			<div className="flex justify-between items-center px-3">
				<div class="text-custom-ghostWhite text-lg font-medium font-['Inter'] leading-[11px] tracking-normal">
					Insert operation node
				</div>
				<div class="flex gap-2 items-center text-[#aeaeae] text-[10px] font-medium font-['Inter'] leading-[11px] tracking-normal">
					{/* Showing {operationNodesConfig.length} */}
					<div onClick={() => setSidebar(ELEMENTS.SIDEBAR.RUN_PROGRESS)} className="cursor-pointer h-4 w-4 flex items-center justify-center">
						<CloseRoundedIcon fontSize="small" className="text-white" />
					</div>
				</div>
			</div>
			<Button onClick={() => {
				setModal(ELEMENTS.MODAL.DATA_INSPECTOR);
			}} className="flex items-center justify-center mx-3 font-semibold rounded-containers text-custom-ghostWhite bg-grey-13 py-2 cursor-pointer">Open data inspector</Button>
			<div className="flex flex-col gap-3 px-3">
				<CustomInput
					onChange={(e) => {
						setSearchString(e.target.value);
					}}
					variant="searchBox"
					SearchIconClassName="icon-grey-21"
					placeholder="Search" inputClassName={"w-full placeholder:text-sm placeholder:text-grey-21"}
				/>
				<div className="flex justify-between items-center operation-nodes-filters">
					<SSelectDropDown
						defaultValue="Show all"
						width="160px"
						onChange={(val) => {
							filterItems(val);
							setSelectedFilter(val);
						}}
					>
						<DropdownItem item="Show all" />
						{/* <DropdownItem item="Transformative" />
						<DropdownItem item="Conditional" />
						<DropdownItem item="Reference" /> */}
					</SSelectDropDown>
				</div>
			</div>
			<div className="overflow-y-auto px-3">
				{isLoading ? (
					<Loading className="h-full w-full flex justify-center items-center" />
				) : operationNodes.length === 0 ? (
					<div className="rounded-label p-2 text-custom-ghostWhite font-medium bg-grey-13 bg-opacity-20">
						<span>No operation nodes available</span>
					</div>
				) : (
					operationNodesConfig &&
					operationNodesConfig.length > 0 && (
						<div className="overflow-y-auto overflow-x-hidden flex flex-col gap-2">
							{operationNodes.map((el, index) => {
								return (
									<OperationNodeComponent
										openAccordionIndex={openIndex}
										nodeIndex={index}
										el={el}
										addNodeHandler={(nodeData) => addNodeHandler(nodeData)}
										handleToggleAccordion={(index) => handleToggleAccordion(index)}
									/>
								);
							})}
						</div>
					)
				)}
			</div>
			{/* {selectedNode && (
				<div className="node-info-wrapper">
					<div className="flex justify-between">
						<div class="text-[#f5c519] text-xs font-medium font-['Inter'] leading-[11px]">
							{selectedNode?.name}
						</div>
						<Operations className="icon-grey-5" />
					</div>
					<div class="text-white text-[10px] italic font-light font-['Inter'] leading-[13px]">
						Brief description of the operation node etc etc etc etc etc if
						longer text blah blah blah blah.....{" "}
					</div>
					<div>
						<span className="text-white text-[10px] font-semibold font-['Inter'] leading-[13px]">
							Example - Text example
						</span>
					</div>
				</div>
			)} */}
		</SSidebar>
	);
}
