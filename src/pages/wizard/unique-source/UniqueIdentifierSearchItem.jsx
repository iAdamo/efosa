import { useState } from "react";

const UniqueIdentifierSearchItems = ({
	node,
	isRelatedNode = 0,
	uniqueIdentifierSetter,
}) => {
	const [showChild, setShowChild] = useState(true);
	return (
		<>
			<div
				className="hover:bg-[#DADADA] font-medium text-sm flex items-center justify-between cursor-pointer"
				style={{
					marginLeft: isRelatedNode * 20,
					color: isRelatedNode ? "#808080" : "#55689B",
				}}
				onClick={() => uniqueIdentifierSetter(node.title)}
			>
				{node.title}
				<button onClick={() => setShowChild(!showChild)}>
					{showChild ? "^" : "v"}
				</button>
			</div>
			{showChild &&
				node.children?.map((item) => (
					<UniqueIdentifierSearchItems
						key={item.id}
						node={item}
						isRelatedNode={isRelatedNode + 1}
						uniqueIdentifierSetter={uniqueIdentifierSetter}
					/>
				))}
		</>
	);
};

export default UniqueIdentifierSearchItems;
