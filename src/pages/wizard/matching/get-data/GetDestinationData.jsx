import { fetchDestinationData } from '@/axios/matchAPICalls';
import SButton from '@/components/SButton';
import { WIZARD_COMPONENT_TYPE } from '@/constants';
import useGlobalStore from '@/store/globalStore';
import React from 'react'
import { useState } from 'react';
import GetData from '../../get-data/GetData';
import { useEffect } from 'react';
import NestedGrid from '@/components/NestedGrid/NestedGrid';

function GetDestinationData() {
    const { speccID, activeNodes, destinationAPIData, meatballs } = useGlobalStore((s) => ({
        speccID: s.speccId,
        activeNodes: s.activeNodes,
        destinationAPIData: s.destinationAPIData,
        meatballs: s.meatballs,
    }));
    const [data, setData] = useState([]);
    const [destinationNodeMatch, setDestinationNodeMatch] = useState(null);

    const clickHandler = async () => {
        const data = await fetchDestinationData({ speccID });
        setData(data.body);
    }

    useEffect(() => {
        const destinationNodeMatch = activeNodes.allIds.map(id => activeNodes.byId[id]).find(node => node.APIID === destinationAPIData.id && node.type === WIZARD_COMPONENT_TYPE.MATCH);
        setDestinationNodeMatch(destinationNodeMatch);
    }, [activeNodes, destinationAPIData]);

    return (
        <div className='flex gap-3 p-3'>
            <GetData node={destinationNodeMatch} meatballs={meatballs} expanded />
            <div>
                <SButton onClick={clickHandler}>GetData</SButton>
                {data && <NestedGrid gridData={data} />}
            </div>
        </div>
    )
}

export default GetDestinationData