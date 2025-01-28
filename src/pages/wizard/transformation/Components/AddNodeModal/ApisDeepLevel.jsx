import SAccordion from "@/components/SAccordion";
import Expandable from "@/pages/wizard/get-data/Expandable";
import useGlobalStore from "@/store/globalStore";
import { VALUES } from "@/store/uiSlice";
import groupUrls from "@/utils/groupUrls";
import Node from "@assets/icons/node.svg?react";
import KeyboardDoubleArrowRightRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowRightRounded";
import { useCallback, useEffect, useMemo, useState } from "react";


const selector = (state) => ({
  deactivateNode: state.deactivateNode,
  deactivateONNode: state.deactivateONNode,
  activateNode: state.activateNode,
  activateONNode: state.activateONNode,
  setValue: state.UI.setValue,
});

const ApisDeepLevel = ({ directionInfo, endpointsExpanded, setEndpointsExpanded }) => {
  const { apiEndpoints, direction, isMatching, activatedParentNode, isON, ON } = directionInfo;

  const groupedUrls = useMemo(() => groupUrls(apiEndpoints) || [], [apiEndpoints]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUrls, setFilteredUrls] = useState(groupedUrls);

  const { activateNode, deactivateNode, setValue, deactivateONNode, activateONNode } = useGlobalStore(selector);

  const handleUrlClick = useCallback(
    async (url) => {
      if (!activatedParentNode) {
        const res = isON ? await activateONNode({ ONID: ON.id, direction, url }) : await activateNode({ direction, url, isMatching });
        res.id && setValue(VALUES.SELECTED_NODE, res.id);
        return;
      }
      isON ? deactivateONNode(activatedParentNode) : deactivateNode(activatedParentNode);
      if (activatedParentNode?.endpoint !== url) {
        const res = isON ? await activateONNode({ ONID: ON.id, direction, url }) : await activateNode({ direction, url, isMatching });
        res.id && setValue(VALUES.SELECTED_NODE, res.id);
      }
    },
    [activatedParentNode, isON, ON?.id, direction, isMatching, activateONNode, activateNode, setValue, deactivateONNode, deactivateNode]
  );

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUrls(groupedUrls);
    } else {
      const searchNested = (nodes, term) => {
        return nodes.reduce((acc, node) => {
          if (node.fullUrl.toLowerCase().includes(term.toLowerCase())) {
            acc.push(node);
          } else if (node.children) {
            const filteredChildren = searchNested(node.children, term);
            if (filteredChildren.length > 0) {
              acc.push({ ...node, children: filteredChildren });
            }
          }
          return acc;
        }, []);
      };

      const result = searchNested(groupedUrls.children, searchTerm);
      setFilteredUrls({ ...groupedUrls, children: result });
    }
  }, [searchTerm, groupedUrls]);

  const highlightText = useCallback((text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} className="bg-yellow-300/20">
          {part}
        </span>
      ) : (
        part
      )
    );
  }, []);

  const renderGroup = useCallback(
    (group, index) => {
      const isActive = activatedParentNode?.endpoint === group.fullUrl;

      if (group.children && group.children.length > 0) {
        return (
          <div key={`${group.fullUrl}-accordion-${index}`} className="w-full">
            <SAccordion
              open
              title={
                <div className={`flex items-center justify-between border-b border-[#3C3C3C] p-[10px]`}>
                  <div className="flex items-center gap-[10px]">
                    <span className="font-bold text-ellipsis overflow-hidden" title={group.fullUrl}>
                      {highlightText(group.fullUrl, searchTerm)}
                    </span>
                  </div>
                </div>
              }
              content={
                <div className="pl-[20px]">
                  {group.children.map((child, childIndex) => (
                    <div key={`${child.fullUrl}-${childIndex}`} className="w-full">
                      {renderGroup(child, childIndex)}
                    </div>
                  ))}
                </div>
              }
            />
          </div>
        );
      } else if (group.final) {
        return (
          <div
            key={`${group.fullUrl}-${index}`}
            className={`flex items-center justify-between border-b border-[#3C3C3C] p-[10px] w-full rounded-[4px] ${isActive ? "bg-grey-13" : ""}`}
            onClick={() => handleUrlClick(group.fullUrl)}>
            <div className="text-ellipsis overflow-hidden">
              <span>{highlightText(group.fullUrl, searchTerm)}</span>
            </div>
          </div>
        );
      } else {
        return <></>;
      }
    },
    [highlightText, searchTerm, handleUrlClick, activatedParentNode]
  );

  return (
    <div className={`h-full overflow-scroll ${endpointsExpanded ? 'basis-[20%] min-w-[300px]' : ''}`}>
      <Expandable expanded={endpointsExpanded}
        setExpansion={setEndpointsExpanded}
        isTest={false}
        hovered={false}
        imgCollapesClassName={null}
        collapseSrc={null}
        expandedMaxWidth=""
        collapseStyle="max-h-full"
        TooltipText={"Expand endpoints"}
        includeCollapsedIcon={false}
        customIcon={

          <div
            className="absolute top-0 right-0 translate-x-[-50%] cursor-pointer  h-5 w-5 flex items-center justify-center transition-all duration-250 ease-in"
            onClick={() => setEndpointsExpanded(!endpointsExpanded)}
          >
            <KeyboardDoubleArrowRightRoundedIcon
              style={{
                color: "#454C54",
                fontSize: "14px",
                transform: endpointsExpanded ? "rotate(180deg)" : "rotate(0deg)",
              }}

            />
          </div>

        }>
        <div className="flex">
          <div className="px-2"><Node alt="node" className="icon-grey-2" /></div>
          <span>Available nodes</span>
        </div>
        <div className="mt-4">
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
        </div>

        <div className="w-full h-full flex flex-col items-start justify-start py-[10px]">{filteredUrls.children.map((group) => renderGroup(group))}</div>
      </Expandable>
    </div>
  );
};

export default ApisDeepLevel;
