import { DIRECTION } from "@/constants";
import CircularLoader from "@components/loaders/CircularLoader.jsx";
import { NodeToolBarContext } from "@contexts/NodeToolBarContext.jsx";
import NodeBlock from "@pages/wizard/transformation/Components/NodeBlock.jsx";
import { useContext } from "react";

const PreviewHierarchy = ({ directionInfo, isLoading, endpointsExpanded }) => {
  const { activatedParentNode, speccID, direction, isON, ON } = directionInfo;
  const { toolbarNode } = useContext(NodeToolBarContext);

  const showNodeBlock = () => {
    return (
      <div
        className="flex flex-col gap-4"
        style={{
          alignItems: direction === DIRECTION.SOURCE || isON ? "flex-start" : "flex-end",
        }}>
        <NodeBlock
          key={activatedParentNode.id}
          node={activatedParentNode}
          speccId={speccID}
          addNodeClickHandler={() => { }}
          parentNodeId={activatedParentNode.parentNode}
          direction={direction}
          isShowModal
          isON={isON}
          ON={ON}
          skipMargin={true}
        />
      </div>
    );
  };

  return (
    <div className={`h-full ${endpointsExpanded ? 'basis-1/3' : 'basis-[42%]'} overflow-scroll`}>
      <div className="text-[#f8f9fa] text-sm font-medium font-['Inter'] leading-none mb-[24px]">Preview structure</div>
      <div className="w-max flex items-start justify-between">
        {isLoading ? (
          <CircularLoader imgClassName="w-5 h-5 flex justify-center mx-auto my-5" />
        ) : activatedParentNode ? (
          <div className="bg-grey-13/20 p-[12px] w-max pt-10 overflow-scroll"> {showNodeBlock()} </div>
        ) : (
          <div className="bg-grey-13/20 p-[12px]">No nodes added</div>
        )}
      </div>
    </div>
  );
};

export default PreviewHierarchy;
