import EyeIcon from "@/Icons/EyeIcon";
import NodeIcon from "@/Icons/NodeIcon";
import useGlobalStore from "@/store/globalStore";
import { ELEMENTS, VALUES } from "@/store/uiSlice";
import DataBaseIcon from "@assets/icons/database.svg?react";
import { colors } from "@constants";
import { Tooltip } from "@mui/material";
import { Position, useNodeId } from "@xyflow/react";
import { Button } from "react-aria-components";
import { useShallow } from "zustand/react/shallow";
import HandlerPoints from "../UI/HandlerPoints";

const selector = (state) => ({
  deactivateNode: state.deactivateNode,
  isNodeAsOnConnected: state.isNodeAsOnConnected,
  nodes: state.nodes.allIds.map((id) => state.nodes.byId[id]),
  activeConnectionLine: state.activeConnectionLine,
  deactivateNode: state.deactivateNode,
  setSidebar: state.UI.setSidebar,
  setValue: state.UI.setValue,
  evaluateMonitors: state.UI.evaluateMonitors,
  deactivateONNode: state.deactivateONNode,
});

const NodeComponentHeader = ({ direction, nodeName, isCollapsed, isInOperationNode, fullNode, renderType, isShowModal, handleDataBaseIconClick, ON }) => {
  const { nodes, activeConnectionLine, isNodeAsOnConnected, deactivateNode, setSidebar, setValue, evaluateMonitors, deactivateONNode } = useGlobalStore(
    useShallow(selector)
  );
  const nodeId = useNodeId();

  const shouldShowConnectionDotForNodeAsOn = () => {
    if (isNodeAsOnConnected()) {
      return true;
    }
    if (activeConnectionLine === null) {
      return false;
    }

    if (activeConnectionLine.type !== "connection") {
      return false;
    }

    const nodeAsON = nodes.find((node) => node.id == activeConnectionLine.nodeId);

    const nodeThatNodeAsOnRepresents = nodeAsON.data.ON.nodeID;

    return nodeThatNodeAsOnRepresents == fullNode.id;
  };

  const renderEyeIcon = (renderType) => {
    switch (renderType) {
      case "wizard":
      case "matching":
        return false;
      case "executionSummary":
        return false;

      default:
        return false;
    }
  };

  const renderDotIcon = (renderType) => {
    switch (renderType) {
      case "wizard":
      case "matching":
        return true;
      case "executionSummary":
        return false;
      default:
        return false;
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    ON ? deactivateONNode(fullNode) : deactivateNode(fullNode);
  };

  const handleHeaderClick = (e) => {
    e.stopPropagation();
    !isShowModal && setSidebar(ELEMENTS.SIDEBAR.NODE_PROPERTIES);
    setValue(VALUES.SELECTED_NODE, fullNode.id);
    ON && setValue(VALUES.SELECTED_OPERATION_NODE, ON.id);
    evaluateMonitors();
  };

  return (
    <div type="button" className="flex flex-col">
      <div className="flex justify-between w-full">
        <button className="flex-grow overflow-hidden flex" onClick={handleHeaderClick}>
          <div>
            <Button className="flex justify-center items-center mr-2">
              {direction === "DESTINATION" ? (
                <NodeIcon firstColor={isInOperationNode ? "#5C6A8D" : colors.secondary["aqua-1"]} width="10" height="10" />
              ) : (
                <NodeIcon firstColor={isInOperationNode ? "#5C6A8D" : colors.secondary["pink-light-1"]} width="10" height="10" />
              )}
            </Button>
          </div>
          <div>
            <div className="grow flex">
              <div className={`text-base pr-2.5 font-bold capitalize text-secondary-aqua-1 ${direction === "DESTINATION" ? "text-secondary-aqua-1" : "text-secondary-pink-light-1"}`}>
                {!fullNode.parentNode && <>{fullNode.endpoint.length > 35 ? `${fullNode.endpoint.substring(0, 35)}...` : fullNode.endpoint}</>}

                {fullNode.parentNode && <>{nodeName > 35 ? `${nodeName.substring(0, 35)}...` : nodeName}</>}
              </div>
            </div>
          </div>
        </button>
        <div className="flex gap-2">
          {isShowModal === false && handleDataBaseIconClick && (
            <Tooltip
              title="Get data"
              arrow
              placement="top"
              slotProps={{
                tooltip: {
                  sx: {
                    backgroundColor: "#1E2125",
                    color: "#F8F9FA",
                  },
                },
                arrow: {
                  sx: {
                    color: "#1E2125",
                  },
                },
              }}>
              <button onClick={(e) => handleDataBaseIconClick(e)}>
                <DataBaseIcon />
              </button>
            </Tooltip>
          )}
          {(isInOperationNode && !isCollapsed) ||
            (renderEyeIcon(renderType) && (
              <div className="flex items-center gap-2">
                <button type="button">
                  <EyeIcon />
                </button>
              </div>
            ))}
          <button type="button" onClick={handleDelete}>
            <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_11126_14292)">
                <path d="M1.75 4H2.91667H12.25" stroke="#454C54" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="M11.0837 3.99935V12.166C11.0837 12.4754 10.9607 12.7722 10.7419 12.991C10.5232 13.2098 10.2264 13.3327 9.91699 13.3327H4.08366C3.77424 13.3327 3.47749 13.2098 3.2587 12.991C3.03991 12.7722 2.91699 12.4754 2.91699 12.166V3.99935M4.66699 3.99935V2.83268C4.66699 2.52326 4.78991 2.22652 5.0087 2.00772C5.22749 1.78893 5.52424 1.66602 5.83366 1.66602H8.16699C8.47641 1.66602 8.77316 1.78893 8.99195 2.00772C9.21074 2.22652 9.33366 2.52326 9.33366 2.83268V3.99935"
                  stroke="#454C54"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_11126_14292">
                  <rect width="14" height="14" fill="white" transform="translate(0 0.5)" />
                </clipPath>
              </defs>
            </svg>
          </button>
          {/* <div className="flex">
					{renderDotIcon(renderType) && <Button className="flex items-center" onClick={openToolbar}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="15"
							viewBox="0 0 20 15"
							fill="none"
						>
							<title>Connect</title>
							<path
								d="M2 7.32407C2 6.774 2.21852 6.24645 2.60748 5.85748C2.99645 5.46852 3.524 5.25 4.07407 5.25C4.62415 5.25 5.1517 5.46852 5.54067 5.85748C5.92963 6.24645 6.14815 6.774 6.14815 7.32407C6.14815 7.87415 5.92963 8.4017 5.54067 8.79067C5.1517 9.17963 4.62415 9.39815 4.07407 9.39815C3.524 9.39815 2.99645 9.17963 2.60748 8.79067C2.21852 8.4017 2 7.87415 2 7.32407ZM7.92593 7.32407C7.92593 6.774 8.14444 6.24645 8.53341 5.85748C8.92237 5.46852 9.44992 5.25 10 5.25C10.5501 5.25 11.0776 5.46852 11.4666 5.85748C11.8556 6.24645 12.0741 6.774 12.0741 7.32407C12.0741 7.87415 11.8556 8.4017 11.4666 8.79067C11.0776 9.17963 10.5501 9.39815 10 9.39815C9.44992 9.39815 8.92237 9.17963 8.53341 8.79067C8.14444 8.4017 7.92593 7.87415 7.92593 7.32407ZM15.9259 5.25C16.476 5.25 17.0036 5.46852 17.3925 5.85748C17.7815 6.24645 18 6.774 18 7.32407C18 7.87415 17.7815 8.4017 17.3925 8.79067C17.0036 9.17963 16.476 9.39815 15.9259 9.39815C15.3758 9.39815 14.8483 9.17963 14.4593 8.79067C14.0704 8.4017 13.8519 7.87415 13.8519 7.32407C13.8519 6.774 14.0704 6.24645 14.4593 5.85748C14.8483 5.46852 15.3758 5.25 15.9259 5.25Z"
								fill="#AEAEAE"
							/>
						</svg>
					</Button>}
				</div> */}
        </div>
      </div>
      {shouldShowConnectionDotForNodeAsOn() && nodeId === "API2" && (
        <HandlerPoints id={"API2-ON-connection"} type="target" position={Position.Left} index={0} dataType="connection" label={"Connection"} />
      )}
    </div>
  );
};

export default NodeComponentHeader;
