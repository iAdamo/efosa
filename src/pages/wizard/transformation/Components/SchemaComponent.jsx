import { DIRECTION } from "@/constants";
import { Position, useNodeId } from "@xyflow/react";
import HandlerPoints from "./UI/HandlerPoints";

export default function SchemaComponent(props) {
  const { index, activeField, direction, isNodeAsON, isShowModal, isON } = props;

  const nodeId = useNodeId();

  return isON ? (
    <div className="flex justify-between">
      <HandlerPoints
        key={`ON-input-${nodeId}-${activeField.id}`}
        type={"target"}
        position={Position.Left}
        id={`ON-input-${nodeId}-${activeField.id}`}
        dataType={activeField.type}
        // label={activeField.name}
        isShowModal={isShowModal}
      />
      <HandlerPoints
        key={`ON-output-${nodeId}-${activeField.id}`}
        type={"source"}
        position={Position.Right}
        id={`ON-output-${nodeId}-${activeField.id}`}
        dataType={activeField.type}
        label={activeField.name}
        isShowModal={isShowModal}
      />
    </div>
  ) : (
    <HandlerPoints
      key={isNodeAsON ? `ON-input-${nodeId}-${activeField.id}` : String(activeField.id)}
      type={direction === DIRECTION.SOURCE ? "source" : "target"}
      position={direction === DIRECTION.SOURCE ? Position.Right : Position.Left}
      id={isNodeAsON ? `ON-input-${nodeId}-${activeField.id}` : String(activeField.id)}
      isActiveField={true}
      dataType={activeField.type}
      label={activeField.name}
      isShowModal={isShowModal}
    />
  );
}
