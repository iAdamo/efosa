import React from 'react';
import useGlobalStore from "@/store/globalStore";
import SButton from '@/components/SButton';
import { addActiveNode, deleteActiveNodeApi } from '@/axios/apiCalls';
import { WIZARD_COMPONENT_TYPE } from '@/constants';
import { useEffect } from 'react';

function SelectEndpoint() {
    const { destinationEndpoints, speccID, destinationAPIData, setMatchingParentNode, selectedNode, activeNodes } = useGlobalStore((s) => ({
        destinationEndpoints: s.endpoints.matching.destination,
        destinationAPIData: s.destinationAPIData,
        speccID: s.speccId,
        setMatchingParentNode: s.setMatchingParentNode,
        selectedNode: s.selectedParentNode.matching.destination,
        activeNodes: s.activeNodes,
    }));

    useEffect(() => {
        const matchingNode = activeNodes.allIds.map(id => activeNodes.byId[id]).find(node => node.APIID === destinationAPIData.id && node.isMatching);
        setMatchingParentNode(matchingNode);
    }, [activeNodes, destinationAPIData]);

    const handleSelect = async (endpoint) => {
        try {
            if (selectedNode) {
                await deleteActiveNodeApi(selectedNode.id);
                setMatchingParentNode(null);
            }
            const endpointData = {
                APIID: destinationAPIData.id,
                endpoint: endpoint,
                isMatching: true,
                name: endpoint,
                pairingID: null,
                parentNode: null,
                speccID: speccID,
                type: WIZARD_COMPONENT_TYPE.MATCH
            };
            const { data } = await addActiveNode(endpointData);
            setMatchingParentNode(data[0]);
        } catch (error) {
            console.error('Error adding active node:', error);
        }
    };
    return (
        <div className='flex flex-col gap-2'>
            {destinationEndpoints.map(endpoint => (
                <SButton
                    onClick={() => handleSelect(endpoint)}
                    type='button'
                    key={`endpoint-button-${endpoint}`}
                    className={selectedNode?.endpoint === endpoint ? '!bg-blue-500' : ''}
                >
                    {endpoint}
                </SButton>
            ))}
        </div>
    )
}

export default SelectEndpoint