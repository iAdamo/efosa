import React from "react";
import Filter from "@/assets/icons/filter.svg?react";
import tasksEmptyComponent from "@/layout/wizard/ai/emptyStates/tasksEmptyComponent";
import ActionsEmptyComponent from "@/layout/wizard/ai/emptyStates/actionsEmptyComponent";
import useGlobalStore from "@/store/globalStore";
import LinkParams from "./actions/LinkParams";
import AddONWithLinks from "./actions/AddONWithLinks";
import AddActiveField from "./actions/AddActiveField";
import AddActiveNode from "./actions/AddActiveNode";
import SSelectDropdown, { DropdownItem } from "@/components/SSelectDropdown";

function Tasks() {
	const { AISuggestions } = useGlobalStore((s) => ({
		AISuggestions: s.AI.suggestions.allIds.map(
			(id) => s.AI.suggestions.byId[id],
		),
	}));
	const renderTasks = (suggestion) => {
		switch (suggestion.type) {
			case "ADD_FIELD":
				return (
					<>
						<AddActiveField field={suggestion.field} id={suggestion.id} />
					</>
				);
			case "ADD_NODE":
				return (
					<>
						<AddActiveNode node={suggestion.node} id={suggestion.id} />
					</>
				);
			case "ADD_ON":
				return (
					<>
						<AddONWithLinks
							inputs={suggestion.sourceFields}
							outputs={suggestion.destinationFields}
							ON={suggestion.ON}
							id={suggestion.id}
						/>
					</>
				);
			case "ADD_LINK":
				return (
					<>
						<LinkParams
							sourceHandle={suggestion.field1}
							targetHandle={suggestion.field2}
							id={suggestion.id}
						/>
					</>
				);
		}
	};
	return (
		<div className="flex flex-col pt-[20px] ai-tasks-wrapper">
			<div className="flex justify-between">
				<div class="text-white text-xs font-bold font-['Inter'] leading-[11px] tracking-tight">
					Tasks
				</div>
				<div className="flex gap-1">
					<span className="text-[#ed6a7d] text-[10px] font-medium font-['Inter'] leading-[11px] tracking-tight">
						Pending{" "}
						{
							AISuggestions.filter(
								(suggestion) => suggestion.status === "SUGGESTED",
							).length
						}
						{"  "}
					</span>
					<span className="text-[#aeaeae] text-[10px] font-medium font-['Inter'] leading-[11px] tracking-tight">
						| Total {AISuggestions.length}
					</span>
				</div>
			</div>
			<div className="mt-5 mb-[10px] flex justify-between items-center tasks-dropdown">
				<SSelectDropdown onChange={() => {}} width="150px">
					<DropdownItem item="Show all" />
					<DropdownItem item="Transformative" />
					<DropdownItem item="Conditional" />
					<DropdownItem item="Reference" />
				</SSelectDropdown>
				<Filter className="icon-grey-5" />
			</div>
			<div className=" flex flex-col gap-[10px] h-[65vh] overflow-y-scroll">
				{AISuggestions.length > 0
					? AISuggestions.filter(
							(suggestion) => suggestion.status === "SUGGESTED",
						).map((suggestion) => (
							<div class="text-white flex flex-col" key={suggestion.id}>
								{renderTasks(suggestion)}
							</div>
						))
					: tasksEmptyComponent()}
			</div>
		</div>
	);
}

export default Tasks;
