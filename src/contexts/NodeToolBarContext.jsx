import React, { createContext, useState } from "react";
import NodeToolBarBackdrop from "../pages/wizard/transformation/Components/SpeccDetail/NodeToolBar/NodeToolBarBackdrop";
export const NodeToolBarContext = createContext(null);

const NodeToolBarWrapper = (props) => {
	const [toolbarNode, setToolBarNode] = useState(null);
	const [handleAddRelatedNodes, setHandlerAddRelatedNodes] = useState(
		() => () => {},
	);
	const [isOpenMenu, setIsOpenMenu] = useState();
	const [widthToolBar, setWidthToolBar] = useState(322);

	const closeToolbar = (e) => {
		setToolBarNode(null);
		setIsOpenMenu(false);
		e?.stopPropagation();
	};

	return (
		<NodeToolBarContext.Provider
			value={{
				toolbarNode,
				setToolBarNode,
				closeToolbar,
				handleAddRelatedNodes,
				setHandlerAddRelatedNodes,
				isOpenMenu,
				setIsOpenMenu,
				widthToolBar,
				setWidthToolBar,
			}}
		>
			{toolbarNode && (
				<NodeToolBarBackdrop
					style={{
						width: `calc(100vw - ${widthToolBar}px)`,
						height: "100vh",
						zIndex: "25",
						position: "absolute",
						top: 0,
					}}
				/>
			)}
			{props.children}
		</NodeToolBarContext.Provider>
	);
};
export default NodeToolBarWrapper;
