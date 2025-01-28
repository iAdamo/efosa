import { runMatch, runTransfer } from "@/axios/matchAPICalls";
import NestedGrid from "@/components/NestedGrid/NestedGrid";
import { CACHE_GROUP } from "@/store/cacheSlice";
import useGlobalStore from "@/store/globalStore";
import { useEffect, useState } from "react";

function Results() {
  const { matchData, setCacheValue } = useGlobalStore((s) => ({
    setCacheValue: s.cache.setCacheValue,
    matchData: s.cache.MATCH.RESULTS,
  }));
  const { speccID } = useGlobalStore((s) => ({
    speccID: s.speccId,
  }));
  const [allSourceData, setAllSourceData] = useState([]);
  const [allDestinationData, setAllDestinationData] = useState([]);

  const runMatchHandler = async () => {
    const data = await runMatch({ speccID });
    setCacheValue(CACHE_GROUP.MATCH.RESULTS, data.matchingResults);
    setCacheValue(CACHE_GROUP.MATCH.TRANSFER, data.nonMatchingResults);
  };

  const handleTransfer = async () => {
    const data = await runTransfer({ speccID });
  };

  useEffect(() => {
    if (!matchData) runMatchHandler();
  }, []);

  useEffect(() => {
    const allSourceDataList = [];
    const allDestinationDataList = [];
    if (matchData) {
      for (const data of matchData) {
        allSourceDataList.push(data.sourceData);
        allDestinationDataList.push(data.destinationData);
      }
    }
    setAllSourceData(allSourceDataList);
    setAllDestinationData(allDestinationDataList);
  }, [matchData]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        <span className="text-16 font-semibold">Data matched</span>
        {allSourceData.length > 0 &&
          allSourceData.map((_, index) => (
            <div className="grid grid-cols-2 gap-[12px]" key={index}>
              <NestedGrid showLabel={index === 0} gridData={allSourceData[index]} />
              <NestedGrid showLabel={index === 0} gridData={allDestinationData[index]} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default Results;
