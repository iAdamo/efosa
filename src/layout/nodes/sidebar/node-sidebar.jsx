import { Group } from "react-aria-components";
import Node from "@assets/icons/node.svg?react";
import React, {useContext, useEffect, useMemo, useState} from "react";
import SAccordion from "@components/SAccordion";
import SSidebar from "@/components/SSidebar/SSidebar";
import minimizeIcon from "@assets/icons/minimize-icon.svg";
import maximizeIcon from "@assets/icons/maximize-icon.svg";
import SidebarLinks from "@components/SidebarLinks.jsx";
import SInput from "@components/SInput.jsx";
import SearchIcon from "@assets/icons/search.svg?react";
import { AddNodeModalContext } from "@contexts/AddNodeModalContext.jsx";
import { v4 as uuidv4 } from "uuid";
import Fuse from "fuse.js";
import useGlobalStore from "@/store/globalStore";
import {WizardContext} from "@contexts/WizardContext.jsx";
import {NodeToolBarContext} from "@contexts/NodeToolBarContext.jsx";
import CircularLoader from "@components/loaders/CircularLoader.jsx";
import CircularProgress from "@components/loaders/CircularLoader.jsx";
import Check from "@assets/icons/tick.svg?react";
import Warning from "@assets/icons/warning.svg?react";
import RightArrowIcon from "@assets/icons/down-right-arrow.svg?react";

const fuseOptions = {
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 1,
    threshold: 0.5,
    keys: ["title", "url"]
}

const selector = (state) => ({
    deactivateNode: state.deactivateNode,
    activateNode: state.activateNode,
    activeNodes: state.activeNodes.allIds.map((id) => state.activeNodes.byId[id]),
    shadowActiveNodes: state.shadow.activeNodes.allIds.map(
        (id) => state.shadow.activeNodes.byId[id],
    )
});

export default function NodesSidebar(props) {
    const [isCollapsed, setCollapsed] = useState(false);
    const [endpointsList, setEndpointsList] = useState([]);
    const [searchText, setSearchText] = useState("");

    const {isLoading, setIsLoading, items, node: fullNode} = props
    const [currentNode, setCurrentNode] = useState("");

    const { addSelectedAPIs, selectedAPIs } = useContext(AddNodeModalContext);
    const { activateNode, deactivateNode, activeNodes, shadowActiveNodes } = useGlobalStore(selector);
    const { setToolBarNode, toolbarNode } = useContext(NodeToolBarContext);

    const flattenUrls = (items) => {
        return (items || []).flatMap(group => {
            return group?.children?.map(url => ({
                title: group.fullUrl.toLowerCase(),
                url: url.fullUrl.toLowerCase()
            })) || [];
        });
    }

    useEffect(() => {
        if (searchText === "") {
            setEndpointsList(items?.children || []);
        } else {
            const flatData = flattenUrls(items?.children);
            const fuse = new Fuse(flatData, fuseOptions);
            const result = fuse.search(searchText.toLowerCase());

            if (result.length === 0) {
                setEndpointsList([]);
            } else {
                const filteredGroups = result.reduce((acc, { item }) => {
                    if (!acc[item.title]) {
                        acc[item.title] = { fullUrl: item.title, children: [] };
                    }
                    acc[item.title].children.push({ fullUrl: item.url });
                    return acc;
                }, {});

                setEndpointsList(Object.values(filteredGroups));
            }
        }
    }, [searchText, items]);

    const { getAndSetOKStatuses } = useContext(WizardContext);

    const handleEvent = (url) =>  {
        const { fullUrl, type, direction, id, final } = url;
        if (final) {
            handleSubmit(fullUrl, type, direction, id);
        }
    };

    const handleSubmit = async (newUrl, type, direction, id) => {
        setIsLoading(true);

        if (toolbarNode && toolbarNode?.fullUrl !== newUrl) {
            await deactivateNode(toolbarNode);
            setToolBarNode(null);
            // addSelectedAPIs([]);
            if (toolbarNode?.parentNode == null) {
                await getAndSetOKStatuses(false, ["ADD_NODES"]);
            }
        }

        try {
            const updatedAPIs = await new Promise((resolve) => {
                addSelectedAPIs((prev) => {
                    if (prev.some((item) => item.url === newUrl)) {
                        resolve(prev);
                        return prev;
                    }

                    const newAPIs = [{ url: `/${newUrl}`, type, direction, id }];
                    resolve(newAPIs);
                    return newAPIs;
                });
            });

            // setIsLoading(true);
            const result = await activateNode(updatedAPIs);
            setToolBarNode({ isInGroupModal: false, ...result, direction });
            await getAndSetOKStatuses(false, ["ADD_NODES"]);
        } catch (error) {
            console.error("Error processing API changes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getIcon = (SC, direction) => {
        let colorClass = "";

        const isSource = direction === "SOURCE";
        const isDestination = direction === "DESTINATION";

        if (isSource) {
            colorClass = "icon-pink text-custom-pink";
        } else if (isDestination) {
            colorClass = "icon-mint-green text-custom-destinationSelectionColor";
        }

        switch (SC) {
            case "LOADING":
                return <CircularProgress imgClassName={`w-5 h-5 ${colorClass}`} />;
            case "OK":
                return <Check alt="check" className={`${colorClass}`} />;
            case "ERROR":
                return <Warning alt="warning" className={`icon-error ${colorClass}`} />;
            default:
                return null;
        }
    };

    const renderUrlChildren = (item, depth = 0) => {
        return item.children?.map((url, index) => {
            const hasChildren = !!url.children?.length;
            const isActive = selectedAPIs.find(elem => elem.url === url.fullUrl);
            const isSelected = toolbarNode?.endpoint === `/${url.fullUrl}`
                // !!selectedAPIs.length && selectedAPIs.find((api) => api.id === url.id);
            const isSource = url.direction === "SOURCE";

            const baseClass = `
                ${props.isLoading || !url.final ? "cursor-not-allowed" : "cursor-pointer"}
                gap-[10px] flex flex-col rounded-[5px]
                ${url.final ? "hover:bg-grey-2" : ""}
                ${(isSelected && url.final)
                    ? isSource
                    ? "bg-[#2B2B2B]"
                    : "bg-custom-destinationSelectionColor" : ""
                }
            `.trim();

            const paddingStyle = { padding: `${depth * 0.5}px` };

            return (
                <div key={url.id || index}>
                    <div
                        className={baseClass}
                        style={paddingStyle}
                        onClick={() => {
                            setCurrentNode(index)
                            !isLoading && handleEvent(url)}
                        }
                        onKeyDown={() => {
                            setCurrentNode(index)
                            !isLoading && handleEvent(url)}
                        }
                    >
                        <div className="p-[10px] flex justify-between">
                        <span className="text-[#AEAEAE] text-[10px] font-medium font-['Inter'] break-all">
                            {url.fullUrl}
                        </span>
                            {getIcon(
                                !isLoading && isSelected && item.final
                                    ? "OK"
                                    : "",
                                item.direction
                            )}
                        </div>
                    </div>

                    {hasChildren && renderUrlChildren(url.children, depth + 1)}
                </div>
            );
        });
    };

    const endpointComponent = (item, fullUrl, isParent, level) => {
        return (
            <Group key={uuidv4()} data-id={fullUrl}>
                {!!item.children?.length && (
                    <SAccordion
                        title={
                            <span
                                className={`text-white text-[12px] font-medium capitalize ${
                                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            >
                                {fullUrl}
                            </span>
                        }
                        content={
                            <Group className="flex flex-col gap-1">
                                {item.children && renderUrlChildren(item)}
                            </Group>
                        }
                        open={true}
                        titleClassname="flex justify-between items-center"
                        accordionClassname="pb-[10px]"
                    />
                )}
            </Group>
        )
    }

    const memoizedEndpointsList = useMemo(() => {
        if (endpointsList.length > 0) {
            return endpointsList.map((item) => endpointComponent(item, item.fullUrl, item.final));
        }
        return <div className="text-center my-auto">No endpoints found</div>;
    }, [endpointsList, isLoading])

    return (
        <div className="relative">
            <SSidebar
                sidebarClassName="overflow-y-hidden container-transition sidebar-popup-container"
                isCollapsed={isCollapsed}
            >
                <SidebarLinks
                    Image={<Node alt="node" className="icon-grey-5"/>}
                    label={"Available nodes"}
                    disabled={true}
                />

                <div className="my-[5px]">
                    <SInput
                        type="text"
                        className="modal-header-input !w-full"
                        placeholder="Search"
                        onChange={(e) => !isLoading && setSearchText(e.target.value)}
                        leftIcon={<SearchIcon className="icon-grey-5 mr-[5px]"/>}
                    />
                </div>

                <div
                    className={`absolute flex items-center justify-center cursor-pointer expand-btn-shadow ${"w-[25px] h-[25px] top-[-1px] right-[-7px]"} rounded-[50%] bg-[#080808] z-20`}
                    onClick={() => setCollapsed(!isCollapsed)}
                >
					<span>
						{
                            <img
                                src={isCollapsed ? maximizeIcon : minimizeIcon}
                                width={18}
                                height={18}
                                className="stroke-[#CDCDCD] min-w-[10px] min-h-[10px]"
                            />
                        }
					</span>
                </div>

                <div className="flex flex-col wizard-sidebar">
                    {memoizedEndpointsList}
                </div>
            </SSidebar>
        </div>
    );
}
