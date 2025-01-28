import DraggableLinkPoint from "@pages/wizard/transformation/Components/DraggableLinkPoint";
import { Handle } from "@xyflow/react";
import HandlerPoints from "../UI/HandlerPoints";

const OperationNodeOutputArea = (props) => {
	const { ONConfig, ON, isCollapsed } = props;
	let result = null;

	for (let i = 0; i < ON.result?.length; i++) {
		result = ON.result[i];
	}

	return (
		<>
			{ONConfig.generatesMultiple == 1 && (
				<>
					<div className="flex justify-end flex-row items-center p-3 relative">
						<div className="ml-3 text-sm text text-teal-500 font-bold"></div>
						<div className="text-sm">:Output</div>
						<span className="absolute z-20 -right-3 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-lightGreen dot-number" />
					</div>
					<div className="flex justify-end flex-row items-center p-3 relative">
						<div className="ml-3 text-sm text text-teal-500 font-bold"></div>
						<div className="text-sm">:Output</div>
						<span className="absolute z-20 -right-3 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-lightGreen dot-number" />
					</div>
					<div className="flex justify-end flex-row items-center p-3 relative">
						<div className="ml-3 text-sm text text-teal-500 font-bold"></div>
						<div className="text-sm">:Output</div>
						<span className="absolute z-20 -right-3 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-lightGreen dot-number" />
					</div>
				</>
			)}
			<div className="flex justify-end flex-row items-center p-3 relative">
				<div className="ml-3 text-sm text text-teal-500 font-bold"></div>
				<div className="text-[12px]">{result}:Output</div>

				{/* <DraggableLinkPoint
                    activeField={null}
                    direction={null}
                    isCollapsed={false}
                    isInGroupModal={false}
                    isInOperationNode={true}
                    dragStarted={null}
                    dragEnded={null}
                    handleDrag={null}
                    ONConfig={ONConfig}
                    ON={ON}
                    isInput={false}
                    inputName={null}
                    isOutput={true}
                    indexOfOutput={0}
                    isNodeAsONField={false}
                /> */}
				<HandlerPoints />
			</div>
		</>
	);
};

export default OperationNodeOutputArea;
