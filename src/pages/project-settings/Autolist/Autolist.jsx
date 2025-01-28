import { ProjectContext } from "@/contexts/ProjectContext";
import { generateRows } from "@/axios/apiCalls";
import { useContext } from "react";

function NotConfigured() {
	return <>Not configured yet!</>;
}

export default function Autolist() {
	const { autolist, setAutolist } = useContext(ProjectContext);

	if (!autolist) {
		return <NotConfigured />;
	}
	if (
		autolist.endpoint == null ||
		autolist.wayToList == null ||
		autolist.unique == null
	) {
		return <NotConfigured />;
	}

	let generateRowsClick = async () => {
		let newAutolist = await generateRows(autolist.id);
		setAutolist(newAutolist);
	};

	return (
		<>
			<div className="bg-[#111111] flex grow flex-col text-white">
				<div className="">
					<div>AutolistID: {autolist.id}</div>
					<div>Endpoint: {autolist.endpoint}</div>
					<div>Way to list: {autolist.wayToList}</div>
					<div>Unique field: {autolist.unique}</div>
				</div>
				<div className="m-4">
					<button
						className="s-button s-button-normal s-button-build text-[#ffffff]"
						onClick={() => {
							generateRowsClick();
						}}
					>
						Generate rows
					</button>
				</div>

				<div>
					<table>
						<tr>
							<td className="border p-2">#</td>
							{autolist.headers.map((header) => {
								let isUnique = header.name == autolist.unique;
								return (
									<>
										<td
											className={`border p-2 ${
												isUnique ? "text-[#FFD700]" : ""
											}`}
										>
											{header.name}
										</td>
									</>
								);
							})}
						</tr>
						{autolist.rows.map((row, index) => {
							let cells = row.cells;
							return (
								<>
									<tr>
										<td>{index + 1}</td>
										{autolist.headers.map((header) => {
											let cell = null;
											for (
												let i = 0;
												i < cells.length;
												i++
											) {
												if (
													cells[i].headerID ==
													header.id
												) {
													cell = cells[i];
												}
											}
											return (
												<>
													<td>
														{cell == null
															? "No value"
															: cell.value}
													</td>
												</>
											);
										})}
									</tr>
								</>
							);
						})}
					</table>
				</div>
			</div>
		</>
	);
}
