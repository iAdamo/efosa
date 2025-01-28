import { fetchSourceData } from '@/axios/matchAPICalls';
import SButton from '@/components/SButton';
import useGlobalStore from '@/store/globalStore';
import React from 'react'
import { useState } from 'react';
import GetData from '../../get-data/GetData';
import { useEffect } from 'react';
import NestedGrid from '@/components/NestedGrid/NestedGrid';

function GetSourceData() {
    const { speccID, activeNodes, sourceAPIData, meatballs } = useGlobalStore((s) => ({
        speccID: s.speccId,
        activeNodes: s.activeNodes,
        sourceAPIData: s.sourceAPIData,
        meatballs: s.meatballs,
    }));
    const [data, setData] = useState([]);
    const [sourceNode, setSourceNode] = useState(null);

    const clickHandler = async () => {
        const data = await fetchSourceData({ speccID });
        setData(data.body);
    }

    useEffect(() => {
        const sourceNode = activeNodes.allIds.map(id => activeNodes.byId[id]).find(node => node.APIID === sourceAPIData.id);
        setSourceNode(sourceNode);
    }, [activeNodes, sourceAPIData]);

    return (
        <div className='flex gap-3 p-3'>
            <GetData node={sourceNode} meatballs={meatballs} expanded />
            <div>
                <SButton onClick={clickHandler}>GetData</SButton>
                {data && <NestedGrid gridData={data} />}
            </div>
        </div>
    )
}

export default GetSourceData