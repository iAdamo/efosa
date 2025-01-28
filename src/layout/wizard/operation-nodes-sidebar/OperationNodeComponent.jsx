import Button from "@/components/Button";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

export default function OperationNodeComponent({
	openAccordionIndex,
	el,
	addNodeHandler,
	nodeIndex,
	handleToggleAccordion
}) {
	const handleInsertClick = () => {
		addNodeHandler(el);
	}

	const accordionStyles = {
		backgroundColor: openAccordionIndex === nodeIndex ? '#454C5466' : '#454C5433',
		minHeight: 0,
		borderRadius: '4px',
		overflow: 'hidden',
		border: openAccordionIndex === nodeIndex ? '1px solid #F8F9FA' : '1px solid transparent',
		"& .MuiAccordionSummary-root": {
			minHeight: '0 !important',
			margin: '0 !important',
			padding: '8px',
		},
		"&.MuiAccordion-root:before": {
			backgroundColor: "transparent"
		},
		"& .Mui-expanded": {
			minHeight: '0 !important',
			margin: '0 !important',
		},
		"& .MuiAccordionDetails-root": {
			margin: '0 !important',
			padding: '0px 8px 8px !important',
		},
	};

	return (
		<>
			<Accordion
				elevation={0}
				disableGutters={true}
				sx={accordionStyles}
				key={nodeIndex}
				expanded={openAccordionIndex === nodeIndex}
				onChange={() => handleToggleAccordion(nodeIndex)}
			>
				<AccordionSummary
					aria-controls={`${nodeIndex}-content`}
					id={`${nodeIndex}-header`}
					sx={{
						"& .MuiAccordionSummary-content": {
							margin: 0,
						}
					}}
				>
					<span className="text-custom-ghostWhite flex justify-between flex-wrap font-medium">
						{el.name}
					</span>
				</AccordionSummary>
				<AccordionDetails>
					<div className="flex flex-col gap-2">
						<span className="w-full text-sm font-normal italic text-gradient-grey-10">{el?.description}</span>
						{/* <div className="w-full text-sm font-normal text-gradient-grey-10">
							<span className="font-medium text-custom-ghostWhite">Example</span> - <span className="italic">Text Example</span>
						</div> */}
						<Button
							onClick={handleInsertClick}
							className="text-custom-ghostWhite py-2 px-3 w-max rounded-containers bg-grey-13 font-semibold"
						>
							Insert
						</Button>
					</div>
				</AccordionDetails>
			</Accordion>
		</>
	)

	// old implementation of accordion
	return (
		<div
			{...dragProps}
			tabIndex={-1}
			data-is-dragging={isDragging}
			key={uuidv4()}
			onClick={() => {
				setSelectedNode(el);
			}}
			onKeyDown={() => {
				setSelectedNode(el);
			}}
			className={`pl-[5px] group cursor-grab flex justify-between items-center p-[0px] border-b-[1px] last:border-0 border-b-black 
      hover:border  hover:border-custom-yellow  hover:rounded-[5px] 
     hover:bg-secondary-yellow-5 
      ${selectedNode?.id === el.id
					? "border rounded-[5px] border-b-custom-yellow border-custom-yellow bg-secondary-yellow-5"
					: ""
				}
      `}
		>
			<div className=" w-[80%]">
				<div class="text-white text-xs font-medium font-['Inter'] leading-[11px]">
					{el.name}
				</div>
			</div>
			<SButton
				sType="button"
				onClick={() => {
					addNodeHandler();
				}}
				className={`!p-[5px] bg-secondary-yellow-50 !rounded-[3px] m-[5px] ${selectedNode?.id === el.id ? "visible" : "invisible"
					} `}
			>
				<div class="text-white text-xs font-semibold font-['Inter'] leading-3 tracking-tight">
					Insert
				</div>
			</SButton>
		</div>
	);
}
