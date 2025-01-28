import MarkdownViewer from "@/components/MarkdownViewer";
import SAccordion from "@/components/SAccordion";
import useGlobalStore from "@/store/globalStore";
import { getTypeColor } from "@/utils/typeColour";
import { colors, DIRECTION } from "@constants";
import { useCallback, useEffect, useMemo, useState } from "react";

const APiContent = ({ directionInfo, endpointsExpanded, setEndpointsExpanded }) => {
  const {
    selectedNode,
    activeNodes,
    activeFields,
    addActiveField,
    deleteActiveField,
    addActiveNode,
    deactivateNode,
    addONActiveField,
    deleteONActiveField,
    activateONNode,
    deactivateONNode,
  } = useGlobalStore((state) => ({
    selectedNode: state.UI.VALUES.SELECTED_NODE,
    activeNodes: state.activeNodes,
    activeFields: state.activeFields,
    addActiveField: state.addActiveField,
    addONActiveField: state.addONActiveField,
    deleteActiveField: state.deleteActiveField,
    deleteONActiveField: state.deleteONActiveField,
    addActiveNode: state.addActiveNode,
    deactivateNode: state.deactivateNode,
    activateONNode: state.activateONNode,
    deactivateONNode: state.deactivateONNode,
  }));

  const { apiName, apiDescription, isMatching, direction, isON, ON, isOperationNodeSelected } = directionInfo;

  const memoizedActiveNodes = useMemo(() => (isON ? ON?.activeNodes : activeNodes), [isON, ON?.activeNodes, activeNodes]);
  const memoizedActiveFields = useMemo(() => (isON ? ON?.activeFields : activeFields), [isON, ON?.activeFields, activeFields]);

  const [node, setNode] = useState(null);
  const [nodeOrParameters, setNodeOrParameters] = useState("PARAMETERS");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const selectedNodeData = memoizedActiveNodes.byId[selectedNode];
    setNode(selectedNodeData);
  }, [selectedNode, memoizedActiveNodes]);

  const handleFieldClick = useCallback(
    (field, isActive, activeField) => {
      if (isActive) {
        if (isOperationNodeSelected) {
          deleteONActiveField(activeField.id, ON.id);
        } else {
          deleteActiveField(activeField.id);
        }
      } else {
        if (isOperationNodeSelected) {
          addONActiveField(node.id, ON.id, field.name);
        } else {
          addActiveField(node.id, field);
        }
      }
    },
    [deleteActiveField, addActiveField, node?.id, isOperationNodeSelected, deleteONActiveField, addONActiveField, ON?.id]
  );

  const handleNodeClick = useCallback(
    async (relatedNode, isActive, activeNode) => {
      if (isActive) {
        if (isOperationNodeSelected) {
          deactivateONNode(activeNode);
        } else {
          deactivateNode(activeNode);
        }
      } else {
        if (isOperationNodeSelected) {
          activateONNode({ name: relatedNode.name, parentNode: node.id, ONID: ON.id, direction });
        } else {
          addActiveNode(relatedNode.name, node.id, false, direction);
        }
      }
    },
    [deactivateNode, addActiveNode, node?.id, direction, isOperationNodeSelected, deactivateONNode]
  );

  const renderSelectedNode = useMemo(() => {
    if (!node) return null;

    const { availableFields, availableRelatedNodes, id: nodeID, name, description } = node;

    const renderFields = availableFields.map((field) => {
      const activeField = memoizedActiveFields.allIds
        .map((id) => memoizedActiveFields.byId[id])
        .filter((activeField) => (isOperationNodeSelected ? activeField.onNodeID === node.id : activeField.nodeID === node.id))
        .find((activeField) => activeField.name === field.name);


      if (searchTerm && !field.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return null;
      }

      const isActive = !!activeField;
      let fieldType = null;
      switch (field.type) {
        case "string":
          fieldType = "Text";
          break;
        case "number":
          fieldType = "Number";
          break;
        case "boolean":
          fieldType = "Boolean";
          break;
        case "object":
          fieldType = "Object";
          break;
        case "array":
          fieldType = "Array";
          break;
        case "integer":
          fieldType = "Integer";
          break;
        default:
          fieldType = "Unknown";
      }



      return (
        <div className="px-1 pt-1 pb-3 rounded border-b border-[#454c54]/40 justify-start items-start gap-6 inline-flex" key={field.id}>
          <div className="justify-start items-start gap-2 flex">
            <div className="w-4 h-4  rounded justify-center items-center flex overflow-hidden" onClick={() => handleFieldClick(field, isActive, activeField)}>
              {isActive && (
                <div className={`w-4 h-4 relative flex-col justify-start items-start flex overflow-hidden ${direction === DIRECTION.DESTINATION ? 'bg-[' + colors.secondary["aqua-1"] + ']' : 'bg-[' + colors.secondary["pink-light-1"] + ']'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.3346 3.92871L6.0013 11.262L2.66797 7.92871" stroke="#141619" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
              )}
              {!isActive && (
                <div className="w-4 h-4 relative rounded border border-[#a8a9ab]"></div>
              )}

            </div>
            <div className="flex-col justify-center items-start gap-0.5 inline-flex">
              <div className="justify-start items-center gap-2 inline-flex">
                <div className="text-[#f8f9fa] text-xs font-medium font-['Inter']">{field.name}</div>
              </div>
              {field.required && (
                <div className="text-[#ffc67b] text-[10px] font-light font-['Inter']">Required</div>
              )}

            </div>
          </div>
          <div className="grow shrink basis-0 flex-col justify-center items-start gap-1 inline-flex">
            <div className="justify-start items-center gap-1.5 inline-flex">
              <div className={`w-2 h-2 bg-[${getTypeColor(field.type)}] rounded-full`} />
              <div className="text-[#a8a9ab] text-[10px] font-normal font-['Inter']">{fieldType}</div>
            </div>
            <div className="self-stretch justify-start items-center gap-1.5 inline-flex">
              <div className="grow shrink basis-0 text-[#a8a9ab] text-[10px] font-light font-['Inter']">{field.description}</div>
            </div>
          </div>
        </div>

      );


    });

    const renderRelatedNodes = availableRelatedNodes.map((relatedNode) => {
      const activeNode = memoizedActiveNodes.allIds
        .map((id) => memoizedActiveNodes.byId[id])
        .filter((activeNode) => activeNode.isPostResponse !== 1)
        .find((activeNode) => activeNode.name === relatedNode.name && activeNode.parentNode === nodeID);
      const isActive = !!activeNode;

      if (searchTerm && !relatedNode.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return null;
      }

      return (
        <>
          <div className="px-1 pt-1 pb-3 rounded border-b border-[#454c54]/40 justify-start items-start gap-6 inline-flex" key={relatedNode.id}>
            <div className="justify-start items-start gap-2 flex">
              <div className="w-4 h-4  rounded justify-center items-center flex overflow-hidden" onClick={() => handleNodeClick(relatedNode, isActive, activeNode)}>
                {isActive && (
                  <div className={`w-4 h-4 relative flex-col justify-start items-start flex overflow-hidden ${direction === DIRECTION.DESTINATION ? 'bg-[' + colors.secondary["aqua-1"] + ']' : 'bg-[' + colors.secondary["pink-light-1"] + ']'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M13.3346 3.92871L6.0013 11.262L2.66797 7.92871" stroke="#141619" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                )}
                {!isActive && (
                  <div className="w-4 h-4 relative rounded border border-[#a8a9ab]"></div>
                )}

              </div>
              <div className="flex-col justify-center items-start gap-0.5 inline-flex">
                <div className="justify-start items-center gap-2 inline-flex">
                  <div className="text-[#f8f9fa] text-xs font-medium font-['Inter']">{relatedNode.name}</div>
                </div>
                {relatedNode.required && (
                  <div className="text-[#ffc67b] text-[10px] font-light font-['Inter']">Required</div>
                )}

              </div>
            </div>
            <div className="grow shrink basis-0 flex-col justify-center items-start gap-1 inline-flex">

              <div className="self-stretch justify-start items-center gap-1.5 inline-flex">
                <div className="grow shrink basis-0 text-[#a8a9ab] text-[10px] font-light font-['Inter']">{relatedNode.description}</div>
              </div>
            </div>
          </div>



        </>
      );
    });


    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col p-[12px] bg-grey-13/20">
          <span className="text-lg font-bold capitalize">{name}</span>
          <span>{description}</span>
        </div>
        <div className={`h-9 cursor-pointer bg-[#1E2125] px-0.5 py-1 flex-col justify-center items-start inline-flex overflow-hidden`}>
          <div className="self-stretch  justify-start items-center gap-1 inline-flex">
            <div className={`grow shrink basis-0 h-8 p-2.5 ${nodeOrParameters == 'PARAMETERS' ? 'bg-[#343a40] rounded-sm shadow-[0px_4px_4px_0px_rgba(20,22,25,0.08)]' : 'bg-[#1e2125] rounded shadow-[0px_4px_20px_3px_rgba(20,22,25,0.08)]'} justify-center items-center gap-2.5 flex`} onClick={() => setNodeOrParameters("PARAMETERS")}>
              <div className={`${nodeOrParameters == 'PARAMETERS' ? 'text-[#f8f9fa]' : 'text-[#6c757d]'} text-[10px] font-normal font-['Inter'] leading-3`}>Parameters</div>
            </div>

            <div className={`grow shrink basis-0 h-8 p-2.5 ${nodeOrParameters == 'NODES' ? 'bg-[#343a40] rounded-sm shadow-[0px_4px_4px_0px_rgba(20,22,25,0.08)]' : 'bg-[#1e2125] rounded shadow-[0px_4px_20px_3px_rgba(20,22,25,0.08)]'}   justify-center items-center gap-2.5 flex`} onClick={() => setNodeOrParameters("NODES")}>
              <div className={`${nodeOrParameters == 'NODES' ? 'text-[#f8f9fa]' : 'text-[#6c757d]'} text-[10px] font-medium font-['Inter'] leading-3`}>Related nodes</div>
            </div>
          </div>
        </div>
        <div className="p-[12px] bg-grey-13/20">


          <SAccordion
            open={true}
            title={<>
              <div className="flex  flex-grow p-[10px]">
                <div className="flex items-center gap-[10px]">
                  <span className="font-bold text-ellipsis overflow-hidden">
                    {nodeOrParameters === "PARAMETERS" ? "Parameters" : "Related Nodes"}
                  </span>
                </div>
              </div>

            </>
            }
            content={
              <>
                <div className="h-8 rounded-[10px] border border-[#454c54] justify-center items-start gap-2.5 flex mb-4">
                  <div className="justify-start items-center gap-[5px] flex flex-grow">
                    <div className="p-2.5 justify-center items-center flex">
                      <div className="w-3 h-3 relative  overflow-hidden"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
                        <g clip-path="url(#clip0_14204_3514)">
                          <path d="M9.75 5.625C9.75 6.70078 9.40078 7.69453 8.8125 8.50078L11.7797 11.4703C12.0727 11.7633 12.0727 12.2391 11.7797 12.532C11.4867 12.825 11.0109 12.825 10.718 12.532L7.75078 9.5625C6.94453 10.1531 5.95078 10.5 4.875 10.5C2.18203 10.5 0 8.31797 0 5.625C0 2.93203 2.18203 0.75 4.875 0.75C7.56797 0.75 9.75 2.93203 9.75 5.625ZM4.875 9C5.31821 9 5.75708 8.9127 6.16656 8.74309C6.57603 8.57348 6.94809 8.32488 7.26149 8.01149C7.57488 7.69809 7.82348 7.32603 7.99309 6.91656C8.1627 6.50708 8.25 6.06821 8.25 5.625C8.25 5.18179 8.1627 4.74292 7.99309 4.33344C7.82348 3.92397 7.57488 3.55191 7.26149 3.23851C6.94809 2.92512 6.57603 2.67652 6.16656 2.50691C5.75708 2.3373 5.31821 2.25 4.875 2.25C4.43179 2.25 3.99292 2.3373 3.58344 2.50691C3.17397 2.67652 2.80191 2.92512 2.48851 3.23851C2.17512 3.55191 1.92652 3.92397 1.75691 4.33344C1.5873 4.74292 1.5 5.18179 1.5 5.625C1.5 6.06821 1.5873 6.50708 1.75691 6.91656C1.92652 7.32603 2.17512 7.69809 2.48851 8.01149C2.80191 8.32488 3.17397 8.57348 3.58344 8.74309C3.99292 8.9127 4.43179 9 4.875 9Z" fill="#CACDD1" />
                        </g>
                        <defs>
                          <clipPath id="clip0_14204_3514">
                            <rect width="12" height="12" fill="white" transform="translate(0 0.75)" />
                          </clipPath>
                        </defs>
                      </svg></div>
                    </div>
                    <div className="flex-grow flex">
                      <input type="text" className="text-[#c9cdd1] text-xs font-normal font-['Inter'] leading-[14px] flex-grow h-8 rounded-r-[10px] bg-transparent" placeholder="Search" onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>

                  </div>
                </div>
                <div className="flex flex-col">
                  {nodeOrParameters === "PARAMETERS" && renderFields}
                  {nodeOrParameters === "NODES" && renderRelatedNodes}
                </div>
              </>
            }
          />



        </div>
      </div>
    );
  }, [selectedNode, node, memoizedActiveNodes, memoizedActiveFields, isMatching, direction, addActiveField, deleteActiveField, addActiveNode, deactivateNode, nodeOrParameters, searchTerm]);

  return (
    <div className={`h-full overflow-y-scroll ${endpointsExpanded ? 'basis-[46%]' : 'basis-[58%]'}`}>
      {selectedNode ? (
        <>{renderSelectedNode}</>
      ) : (
        <div className="flex flex-col p-[12px] bg-grey-13/20">
          <span>{apiName}</span>
          <MarkdownViewer>{apiDescription}</MarkdownViewer>
        </div>
      )}
    </div>
  );
};

export default APiContent;
