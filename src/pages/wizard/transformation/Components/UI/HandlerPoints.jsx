import { colors } from "@/constants";
import useGlobalStore from "@/store/globalStore";
import { getTypeColor } from "@/utils/typeColour";
import { Handle, useHandleConnections, useNodeId, useStore } from "@xyflow/react";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import DefaultFieldValue from "./DefaultFieldValue";

const selector = (state) => ({
  addHandle: state.addHandle,
  removeHandle: state.removeHandle,
  exampleDataHandles: state.exampleData.handles,
  destinationAPIID: state.destinationAPIData.id,
});

const zoomSelector = (s) => s.transform[2];

function HandlerPoints({
  id,
  dataType = "default",
  style,
  isPassthrough = false,
  isNodeAsON = false,
  index = 0,
  type = "none",
  label,
  isCollapsed,
  isActiveField,
  isShowModal,
  ...props
}) {
  const zoom = useStore(zoomSelector);
  const [isConnectable, setIsConnectable] = useState(true);
  const [isConnectableTargetLimit, setIsConnectableTargetLimit] = useState(true);
  const { addHandle, removeHandle, exampleDataHandles, destinationAPIID } = useGlobalStore(useShallow(selector));
  const nodeId = useNodeId();
  const [Handlerstyle, setStyle] = useState({
    ...style,
    Background: "none",
    transition: "background-color .5s ease",
  });

  const connections = useHandleConnections({
    type: type,
    id: id,
  });

  useEffect(() => {
    if (connections.length >= 1) {
      setStyle((style) => ({
        ...style,
        background: getTypeColor(dataType),
      }));
    } else {
      setStyle((style) => ({
        ...style,
        background: colors.grey["15"],
      }));
    }
  }, [connections, dataType]);

  useEffect(() => {
    if (isCollapsed) {
      setStyle((style) => ({
        ...style,
        opacity: 0,
      }));
    } else {
      setStyle((style) => ({
        ...style,
        opacity: 1,
      }));
    }
  }, [isCollapsed]);

  useEffect(() => {
    if (!isShowModal) {
      const disableHandle = () => {
        setStyle((style) => ({
          ...style,
          opacity: 0.5,
        }));
        setIsConnectable(false);
      };

      const enableHandle = () => {
        setStyle((style) => ({
          ...style,
          opacity: 1,
        }));
        setIsConnectable(true);
      };

      setStyle((style) => ({
        ...style,
        borderColor: getTypeColor(dataType),
      }));

      const handleData = {
        id: id,
        enableHandle,
        disableHandle,
        data: {
          nodeId: nodeId,
          type: dataType,
          direction: type,
          isPassthrough: isPassthrough,
          isNodeAsON: isNodeAsON,
          index: index,
          isCollapsed: isCollapsed,
        },
      };
      addHandle(handleData);
    }

    return () => {
      !isShowModal && removeHandle(id);
    };
  }, [addHandle, removeHandle, nodeId, id, dataType, isCollapsed, isShowModal]);

  useEffect(() => {
    const maxHeight = 12;
    const minHeight = 8;
    let appliedHeight = 10 / zoom;
    if (appliedHeight < minHeight) appliedHeight = minHeight;
    else if (appliedHeight > maxHeight) appliedHeight = maxHeight;
    setStyle((style) => ({
      ...style,
      height: appliedHeight,
      width: appliedHeight,
    }));
  }, [zoom]);

  const handle = (style = {}, position) => {
    if (destinationAPIID === null) {
      return <></>;
    }
    return (
      <Handle
        isConnectable={isConnectable && isConnectableTargetLimit && !isCollapsed}
        {...{ id, style, ...props, ...(position && { position }) }}
        type={type}
        style={{ ...Handlerstyle, ...style }}
      />
    );
  };

  const exampleDataTextColour = () => {
    if (nodeId === "API1") {
      return colors.main.pink["1"];
    }
    if (nodeId === "API2") {
      return colors.secondary["mint-green"];
    }
    return colors.secondary.yellow;
  };

  return label && !isCollapsed ? (
    <div
      className={`group relative p-[10px] flex flex-col justify-center gap-[8px] w-full border border-grey-13 last:rounded-b-api-component first:rounded-t-api-component hover:border-${dataType ? `[${getTypeColor(dataType)}]` : "custom-pink"} hover:bg-${dataType ? `[${getTypeColor(dataType)}1a]` : "custom-pink"} ${type === "source" ? "flex-row-reverse" : ""}`}>
      {!isShowModal &&
        (isActiveField ? (
          <div className="relative">
            {handle({
              [type === "source" ? "right" : "left"]: "-10px",
              top: "10px",
            })}
          </div>
        ) : (
          <>{handle()}</>
        ))}
      <div className="capitalize">{label}</div>
      {isActiveField && type === "target" && <DefaultFieldValue fieldID={id} />}
      {exampleDataHandles[id] && (
        <div
          className={"break-words"}
          style={{
            color: exampleDataTextColour(),
          }}>
          {dataType === "boolean" && exampleDataHandles[id] !== undefined && <>{exampleDataHandles[id] ? "true" : "false"}</>}
          {dataType !== "boolean" && <>{exampleDataHandles[id]}</>}
        </div>
      )}
    </div>
  ) : (
    <div className="relative">{handle()}</div>
  );
}

export default HandlerPoints;
