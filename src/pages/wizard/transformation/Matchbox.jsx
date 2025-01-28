import { addMatchBoxData } from "@/axios/matchAPICalls";
import useGlobalStore from "@/store/globalStore";
import { ELEMENTS } from "@/store/uiSlice";
import { Position } from "@xyflow/react";
import React, { useEffect } from "react";
import HandlerPoints from "./Components/UI/HandlerPoints";

function Matchbox() {
  const { edges, speccID, setEdges, matchbox, activeFields, setModal } = useGlobalStore((s) => ({
    edges: s.edges,
    speccID: s.speccId,
    setEdges: s.setEdges,
    matchbox: s.matchbox,
    activeFields: s.activeFields,
    setModal: s.UI.setModal,
  }));
  const [isMounted, setIsMounted] = React.useState(false);
  const [sourceField, setSourceField] = React.useState(null);
  const [edgesLinked, setEdgesLinked] = React.useState(false);
  const [destinationField, setDestinationField] = React.useState(null);

  useEffect(() => {
    (async () => {
      if (matchbox !== null && matchbox.sourceFieldID && matchbox.destinationFieldID) {
        const links = [
          {
            id: `${matchbox?.sourceFieldID}-matchbox-input-1`,
            source: "API1",
            target: "matchbox",
            sourceHandle: String(matchbox?.sourceFieldID),
            targetHandle: "matchbox-input-1",
          },
          {
            id: `matchbox-input-2-${matchbox?.destinationFieldID}`,
            source: "matchbox",
            target: "API2",
            sourceHandle: "matchbox-input-2",
            targetHandle: String(matchbox?.destinationFieldID),
          },
        ];
        setEdgesLinked(true);
        setEdges(links);
      }
    })();
  }, [matchbox, setEdges]);

  useEffect(() => {
    (async () => {
      let sourceFieldID;
      let destinationFieldID;
      const matchboxEdges = edges.allIds.map((id) => edges.byId[id]).filter((edge) => edge.source === "matchbox" || edge.target === "matchbox");
      for (const edge of matchboxEdges) {
        if (edge.source === "matchbox" && activeFields.byId[edge.targetHandle]) {
          destinationFieldID = edge.targetHandle;
          setDestinationField(activeFields.byId[edge.targetHandle]);
        } else if (edge.target === "matchbox" && activeFields.byId[edge.sourceHandle]) {
          sourceFieldID = edge.sourceHandle;
          setSourceField(activeFields.byId[edge.sourceHandle]);
        }
        if (sourceFieldID && destinationFieldID) {
          break;
        }
      }
      if (sourceFieldID && destinationFieldID) {
        isMounted && (await addMatchBoxData({ speccID, sourceFieldID, destinationFieldID }));
      }
      setIsMounted(true);
    })();
  }, [edges, speccID, activeFields]);
  return (
    <div className="bg-grey-15 rounded-base p-[12px] gap-[12px] w-[217px] flex flex-col">
      <span className="font-semibold text-custom-ghostWhite">Match box</span>
      <i className="text-sm">Connect both parameters to create match</i>
      <div className="flex">
        <HandlerPoints key={"matchbox-input-1"} label={sourceField?.name || "Empty"} id={"matchbox-input-1"} position={Position.Left} type="target" />
        <HandlerPoints key={"matchbox-input-2"} label={destinationField?.name || "Empty"} id={"matchbox-input-2"} position={Position.Right} type="source" />
      </div>
      {edgesLinked && (
        <button
          onClick={() => {
            setModal(ELEMENTS.MODAL.MATCH.RESULTS);
          }}>
          Run Match
        </button>
      )}
    </div>
  );
}

export default Matchbox;
