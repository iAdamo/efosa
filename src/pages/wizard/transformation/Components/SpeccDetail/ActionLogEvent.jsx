import React from "react";

const types = ["All", "Transform", "Conditional", "Reference"];

const ActionLogEvent = (props) => {
	const { event } = props;
	return (
		<>
			<table className="min-h-[50px] w-[100%]">
				<tr>
					<td className="align-top w-[40px] text-center">
						{event?.type == "completed" && <span>completed</span>}
						{event?.type == "message" && <span>message</span>}
						{event?.type == "alert" && <span>alert</span>}
						{event?.type == "success" && <span>success</span>}
						{event?.type == "fail" && <span>fail</span>}
					</td>
					<td className="text-[12px] font-worksans align-top pt-1 pr-2">
						{event.message}
					</td>
				</tr>
				<tr>
					<td>&nbsp;</td>
					<td className="text-[9px] text-[#B5B7C0] flex pr-2">
						<div className="flex-grow">{event.date}</div>
						<div className="flex-grow text-right">{event.time}</div>
					</td>
				</tr>
			</table>
		</>
	);
};

export default ActionLogEvent;
