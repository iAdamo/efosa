import NodeComponent from "./NodeComponent";

const NodeBlock = (props) => {
  const { direction, speccid, deleteNode, node, parentNodeId, renderType, isShowModal = false, isON = false, ON } = props;

  return (
    <NodeComponent
      {...props}
      fullNode={node}
      {...node}
      direction={direction}
      speccid={speccid}
      deleteNode={deleteNode}
      parentNodeId={parentNodeId}
      isRelatedNode={0}
      renderType={renderType}
      isShowModal={isShowModal}
      isON={isON}
      ON={ON}
    />
  );
};

export default NodeBlock;
