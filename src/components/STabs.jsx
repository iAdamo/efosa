import { useEffect, useState } from "react";
import {
	Collection,
	Tab,
	TabList,
	TabPanel,
	Tabs,
} from "react-aria-components";

export default function STabs({ ...props }) {
	const [selectedTab, setSelectedTab] = useState(props.tabs[0].name);

	useEffect(() => {
		if (props.getSelectedTab) {
			props.getSelectedTab(selectedTab);
		}
	}, [selectedTab]);

	const renderChildAndSibling = () => {

		const TabListBody = () => <TabList
			aria-label="Dynamic tabs"
			items={props.tabs}
			className={props.tabStyles?.tabListStyle ? `${props.tabStyles.tabListStyle}` : undefined}
		// style={{ flex: 1 }}
		>
			{(item) => (
				<Tab
					id={item.name}
					className={({ isSelected }) =>
						isSelected
							? `${props.tabStyles?.activeTab ? props.tabStyles?.activeTab :
								item.selectionColor ??
								props.selectionColor ??
								"bg-[#555555]"
							} w-6/12 tab ${item.textColor} ${item.tabElementClassName}`
							: `transparent w-6/12 tab ${item.textColor} ${item.tabElementClassName}`
					}
				>
					{item.icon && item.icon}
					{item.name}
				</Tab>
			)}
		</TabList>
		if (props.childWithSibling) return <div className={props.childWithSibling}>
			<TabListBody />
			{props.tabListSibling && props.tabListSibling}
		</div>

		return <>
			<TabListBody />
			{props.tabListSibling && props.tabListSibling}
		</>
	}

	return (
		<Tabs
			className={` ${props.tabClassName} ${props.tabStyles?.tabContent || ''}`}
			onSelectionChange={(tab) => {
				setSelectedTab(tab);
				if (props.onClick) {
					props.onClick();
				}
			}}
		>
			<div className={`flex flex-row-reverse gap-3 flex-none w-full ${props.tabStyles?.tabChild || ''}`}>
				<TabList
					aria-label="Dynamic tabs"
					items={props.tabs}
					className={props.tabStyles?.tabListStyle ? `${props.tabStyles.tabListStyle}` : undefined}
					// style={{ flex: 1 }}
				>
					{(item) => (
						<Tab
							id={item.name}
							className={({ isSelected }) =>
								isSelected
									? `${
											props.tabStyles?.activeTab ? props.tabStyles?.activeTab :
											item.selectionColor ??
											props.selectionColor ??
											"bg-[#555555]"
										} w-6/12 tab ${item.textColor} ${item.tabElementClassName}`
									: `transparent w-6/12 tab ${item.textColor} `
							}
						>
							{item.icon && item.icon}
							{item.name}
						</Tab>
					)}
				</TabList>
				{props.tabListSibling && props.tabListSibling}
			</div>
			{props.midChildren && props.midChildren}
			{!props.hidePanel && (
				<Collection items={props.tabs}>
					{(item) => (
						<TabPanel id={item.name} className={item.className} ref={props.ref}>
							{item.children}
						</TabPanel>
					)}
				</Collection>
			)}
		</Tabs>
	);
}