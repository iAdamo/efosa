import React, { useEffect, useState, useContext, useRef } from "react";
import { getModuleInput, runModule } from "@axios/apiCalls";
import { WizardContext } from "@contexts/WizardContext";
import SButton from "@components/SButton";
import SSearch from "@components/SSearch";
import SAccordion from "@components/SAccordion";
import { SCheckbox, SCheckboxGroup } from "@components/SCheckbox";
import { Controller, useForm } from "react-hook-form";
import accordionOpenIcon from "@assets/icons/acrd-open.svg";
import accordionCloseIcon from "@assets/icons/acrd-close.svg";
import TextLoaders from "@components/loaders/TextLoaders";
import { RowDataShowObj } from "@components/table/ObjTable";

export default function TransferContent(props) {
	const { speccID, activeModules } = useContext(WizardContext);
	const { control, setValue, handleSubmit } = useForm();
	const [moduleInputResponse, setModuleInputResponse] = useState(null);
	const [responseData, setResponseData] = useState(null);
	const [loading, setLoading] = useState(false);

	let module = null;

	for (let i = 0; i < activeModules.length; i++) {
		if (activeModules[i].config.name == "TRANSFER") {
			module = activeModules[i];
			break;
		}
	}

	if (!module) {
		return <>No module!</>;
	}

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const moduleResponseInputAnswer = await getModuleInput(
					speccID,
					module.id,
				);
				if (!("found" in moduleResponseInputAnswer)) {
					setModuleInputResponse(moduleResponseInputAnswer);
				}
				setLoading(false);
			} catch (err) {
				console.error(err);
				setLoading(false);
			}
		})();
	}, []);

	const runTransferClick = async (data) => {
		try {
			setLoading(true);
			const moduleResponseAnswer = await runModule(
				speccID,
				module.id,
				data.action,
			);
			if (moduleResponseAnswer?.listOfDataObjects?.[data.action[0]]) {
				setResponseData(
					moduleResponseAnswer?.listOfDataObjects?.[data.action[0]],
				);
			}
			setLoading(false);
		} catch (err) {
			console.error(err);
			setLoading(false);
		}
	};
	const loaderDiv = () => (
		<div className="flex flex-col gap-3 px-3">
			<TextLoaders count={5} containerClassName={"flex gap-2 h-[30px]"} />
			<TextLoaders count={5} containerClassName={"flex gap-2"} />
			<TextLoaders count={5} containerClassName={"flex gap-2"} />
			<TextLoaders count={5} containerClassName={"flex gap-2"} />
			<TextLoaders count={5} containerClassName={"flex gap-2"} />
		</div>
	);

	const renderTable = (data) => {
		return (
			<form
				className="transfer-modal"
				onSubmit={handleSubmit(runTransferClick)}
			>
				<span className="label label-large header-text">Test Connection</span>
				<div class={"flex justify-between items-center px-3"}>
					<span className="label label-large"></span>
					{/* test with nested data */}
					{/* <div className="flex gap-1">
                        <button>
                            <span className="label">b1</span>
                        </button>
                        <button>
                            <span className="label">b2</span>
                        </button>
                        <button>
                            <span className="label">b3</span>
                        </button>
                    </div> */}
					<SSearch />
				</div>
				{loading ? (
					loaderDiv()
				) : (
					<>
						<div className="table-container">
							{moduleInputResponse &&
							moduleInputResponse.listOfDataObjects.length > 0 ? (
								<Controller
									name="action"
									control={control}
									render={({
										field: { name, value, onChange, onBlur, ref },
									}) => (
										<SCheckboxGroup
											name={name}
											value={value}
											onChange={(e) => {
												onChange([e[e.length - 1]]);
											}}
											onBlur={onBlur}
											ref={ref}
										>
											{moduleInputResponse.listOfDataObjects.map((row, idx) => (
												<SCheckbox
													value={idx}
													aria-label={`transfer-data-${idx}`}
												>
													{RowDataShowObj(row.datarow, true)}
												</SCheckbox>
											))}
										</SCheckboxGroup>
									)}
								/>
							) : (
								<span className="label">No data</span>
							)}
						</div>
						<SButton sType={"build"} type="submit" className={"footer-button"}>
							<span>Run Test</span>
						</SButton>
					</>
				)}
			</form>
		);
	};

	const responseDataShow = () => {
		const msg = () => {
			if (responseData.correspondingUID)
				return (
					<>
						<span className="label label-large header-text">Success</span>
						<span className="label px-3">
							Data was successfully transferred
						</span>
					</>
				);
			else
				return (
					<>
						<span className="label label-large header-text label-error">
							Error
						</span>
						<span className="label label-error px-3">
							Couldn't transfer data
						</span>
					</>
				);
		};
		return (
			<div className="transfer-modal">
				{msg()}
				<div className="table-container">
					<SAccordion
						title={<span className="label label-large">More information</span>}
						content={
							<pre className="label w-full p-4">
								<code className="code-view">
									{JSON.stringify(responseData.response.body, undefined, 4)}
								</code>
							</pre>
						}
						reverseIcon
						titleClassname="justify-end flex items-center gap-2"
						openIcon={accordionOpenIcon}
						closeIcon={accordionCloseIcon}
					/>
				</div>
				<SButton
					sType={"build"}
					onClick={() => {
						setResponseData(null);
						setValue("action", []);
					}}
					className={"footer-button m-3"}
				>
					<span>Ok</span>
				</SButton>
			</div>
		);
	};

	return <>{responseData ? responseDataShow() : renderTable()}</>;
}
