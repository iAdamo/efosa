import { ProjectContext } from "@/contexts/ProjectContext";
import { WizardContext } from "@/contexts/WizardContext";
import useGlobalStore from "@/store/globalStore";
import { ELEMENTS } from "@/store/uiSlice";
import XIcon from "@assets/icons/x-icon.svg?react";
import { useContext } from "react";
import WizardInput from "../../WizardInput";
import { useShallow } from "zustand/react/shallow";

const selector = (state) => ({
	webhookVariables: state.webhookVariables,
  });

const OperationNodeBlockInputSection = ({
	ON,
	ONConfig,
	operationNodeInput,
	inputDetails,
	value,
}) => {
	const {
		updateOperationNodeInput,
		setSidebar,
		setSelectedFieldID,
		setSelectedVariableID,
		setVariableObjectType
	} = useGlobalStore((state) => ({
		updateOperationNodeInput: state.updateOperationNodeInput,
		activeFields: state.activeFields,
		setActiveFieldDefaultValue: state.setActiveFieldDefaultValue,
		setSidebar: state.UI.setSidebar,
		setSelectedFieldID: state.setSelectedFieldID,
		setSelectedVariableID: state.setSelectedVariableID,
		setVariableObjectType: state.setVariableObjectType
	}));
	const { usedVariables } = useContext(WizardContext);
	const { variables } = useContext(ProjectContext);
	const { webhookVariables } = useGlobalStore(useShallow(selector));

	const getSelectedVariableData = usedVariables?.find(
		(item) => item?.ONInputID === Number(operationNodeInput?.operationnodeID)
	);

	const getVariable = variables?.find(
		(item) => item?.id === getSelectedVariableData?.variableID
	);

	const getWebhookVariable = webhookVariables?.find(
		(item) => item?.id === getSelectedVariableData?.variableID
	);

	const onChangeHandler = async (e) => {
		const payload = {
			value: e.target.value,
		};
		updateOperationNodeInput(ON.id, operationNodeInput.id, payload);
	};


	const handleXIconClick = () => {
		setSidebar(ELEMENTS.SIDEBAR.VARIABLE_MENU);
		if (operationNodeInput) {
			setSelectedFieldID(operationNodeInput?.operationnodeID);
		}
		setVariableObjectType("ONINPUT");
		setSelectedVariableID(getVariable ? getVariable?.id : getWebhookVariable?.id)
	}

	return (
		<>
			{/* <div className="flex flex-row items-center ml-2">
				<div className="text-sm">{operationNodeInput.config.inputname}</div>

				<SInput
					sType={"STRING"}
					objectType={"ONINPUT"}
					objectID={operationNodeInput.id}
					onBlur={onChangeHandler}
					defaultValue={value}
				/>
			</div> */}
			{!(getVariable || getWebhookVariable) ? (
				<WizardInput
					label={operationNodeInput.config.inputname}
					sType={"STRING"}
					objectType={"ONINPUT"}
					objectID={operationNodeInput.id}
					onBlur={onChangeHandler}
					defaultValue={value}
					suffix={<XIcon className={"icon-white"} />}
					onSuffixClick={handleXIconClick}
				/>
			) : (
				<div className="rounded mt-s4 bg-grey-13 max-h-[18px] overflow-hidden pl-s4 py-s4 text-sm text-gradient-grey-7 bg-opacity-20 flex items-center justify-between pr-s12">
					{getVariable?.name || getWebhookVariable?.name}
					<span
						className="cursor-pointer"
						onClick={() => handleXIconClick()}
					>
						<XIcon className={"w-s12 h-s12 icon-white"} />
					</span>
				</div>
			)}
		</>
	);
};

export default OperationNodeBlockInputSection;
