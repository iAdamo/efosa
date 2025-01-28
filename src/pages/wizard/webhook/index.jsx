import Copy from "@/assets/icons/copy.svg?react";
import Variable from "@/assets/icons/variable.svg?react";
import {
	checkForIncomingWebhook,
	deleteGenericCRUDWithID,
	postGenericCRUD,
	postGenericCRUDWithID,
	runModule,
} from "@/axios/apiCalls";
import Loading from "@/components/loaders/Loading";
import SButton from "@/components/SButton";
import SFormSelect from "@/components/SFormSelect";
import SInput from "@/components/SInput";
import { errorToast } from "@/components/toasts/error-toast";
import { colors } from "@/constants";
import { ProjectContext } from "@/contexts/ProjectContext";
import { WizardContext } from "@/contexts/WizardContext";
import NodeIcon from "@/Icons/NodeIcon";
import useGlobalStore from "@/store/globalStore";
import Add from "@assets/icons/add.svg?react";
import Delete from "@assets/icons/delete.svg?react";
import ArrowDown from "@assets/icons/down-arrow.svg?react";
import { useContext, useEffect, useState } from "react";
import { Cell, Column, Row, Table, TableBody, TableHeader } from "react-aria-components";
import { v4 as uuidv4 } from "uuid";
import { useShallow } from "zustand/react/shallow";

const selector = (state) => ({
	webhook: state.webhook,
	setWebhookSNCSubscribeID: state.setWebhookSNCSubscribeID,
	webhookVariables: state.webhookVariables,
	updateWebhookVariables: state.updateWebhookVariables,
	speccID: state.speccId,
	activeModules: state.activeModules,
	initialDataFetched: state.dataFetched.initialSpeccValues,
});

export default function WebhookNew() {
	const {
		webhook,
		setWebhookSNCSubscribeID,
		webhookVariables,
		updateWebhookVariables,
		speccID,
		activeModules,
		initialDataFetched,
	} = useGlobalStore(useShallow(selector));
	const [time, setTime] = useState(60);
	const [isCheckingForWebhook, setIsCheckingForWebhook] = useState(false);
	const [webhookResult, setWebhookResult] = useState(null);
	const [moduleResult, setModuleResult] = useState(null);
	const [startTime, setStartTime] = useState(null);
	const [pathVariablesSequence, setPathVariablesSequence] = useState([]);
	const [webhookVariableValues, setWebhookVariableValues] = useState([]);
	const { variables, setVariables } = useContext(ProjectContext);
	const { usedVariables, setUsedVariables } =
		useContext(WizardContext);

	useEffect(() => {
		if (initialDataFetched) {
			fillPathVariablesSequence();
		}
	}, [initialDataFetched]);

	const fillPathVariablesSequence = () => {
		const temp = [];
		let highestOrder = getHighestOrder() + 1;
		webhookVariables.map((item, index) => {
			if (item.type === "PATH") {
				if (item.order === null) {
					temp.push({
						index: index,
						order: highestOrder,
						name: item.name,
						id: item.id,
					});
					highestOrder += 1;
					changeVariableColumn(index, "order", highestOrder);
				}
			}
		});
		setPathVariablesSequence(temp);
	};

	const getHighestOrder = () => {
		let value = -1;
		webhookVariables.map((item) => {
			if (item.type === "PATH" && item.order != null && item.order > value) {
				value = item.order;
			}
		});

		return value;
	};

	const getHighestOrderFromSequence = () => {
		let value = 0;
		pathVariablesSequence.map((item) => {
			if (item.order > value) {
				value = item.order;
			}
		});
		return value;
	};

	const checkForWebhooks = async () => {
		const twoHoursLater = new Date();
		twoHoursLater.setHours(twoHoursLater.getHours() + 2);
		try {
			const response = await checkForIncomingWebhook(
				webhook.GUID,
				startTime,
				"GET",
			);
			return response;
		} catch (e) {
			errorToast("Error checking for incoming webhook");
		}
	};

	useEffect(() => {
		(async () => {
			if (time % 2 === 0 && isCheckingForWebhook) {
				setTimeout(async () => {
					await checkForWebhooks().then((res) => {
						if (!res.tryAgain) {
							stopTimer();
							setWebhookResult(res.data.incomingWebhook);
							setModuleResult(res.data.moduleResult);
						}
					});
				}, 1000);
			}
		})();
	}, [isCheckingForWebhook, time]);

	const stopTimer = () => {
		setIsCheckingForWebhook(false);
		setTime(60);
	};

	useEffect(() => {
		let timer;
		if (isCheckingForWebhook) {
			timer = setInterval(() => {
				setTime((time) => {
					if (time === 0 || !isCheckingForWebhook) {
						setIsCheckingForWebhook(false);

						clearInterval(timer);
						return 0;
					}
					return time - 1;
				});
			}, 1000);
		}
		return () => {
			if (timer) {
				clearInterval(timer);
			}
		};
	}, [isCheckingForWebhook]);

	const handleTimer = () => {
		setWebhookResult(null);
		setIsCheckingForWebhook(true);
		const twoHoursLater = new Date();
		twoHoursLater.setHours(twoHoursLater.getHours() + 1);
		setStartTime(twoHoursLater.toISOString());
	};

	const addNewWebhookVariable = async () => {
		try {
			const obj = { webhookID: webhook.id, custom: 1 };
			const { data } = await postGenericCRUD("Webhook_Variables", obj);

			updateWebhookVariables([...webhookVariables, data[0]]);

			const newModuleResult = await runModule(
				speccID,
				getWebhookId()[0].id,
				webhookResult.id,
			);
		} catch (error) {
			console.error(error);
		}
	};

	const getWebhookId = () => {
		return activeModules.filter((item) => {
			if (item.config.name === "WEBHOOK") {
				return true;
			}
			return false;
		});
	};

	const deleteVariable = async (id, index) => {
		await deleteGenericCRUDWithID("Webhook_Variables", id);
		updateWebhookVariables(webhookVariables.filter((item) => item.id !== id));
		setPathVariablesSequence(
			pathVariablesSequence.filter((item) => item.index !== index),
		);
		executeWebhookModule();
	};

	const executeWebhookModule = async () => {
		try {
			const webhookCallResult = await runModule(
				speccID,
				getWebhookId()[0].id,
				webhookResult.id,
			);
			setModuleResult(webhookCallResult);
		} catch (e) {
			console.error(e);
		}
	};

	const checkIfVariableIsPresent = (dotNotation) => {
		webhookVariables.map((item) => {
			if (item.dotNotation === dotNotation) {
				return true;
			}
		});
		return false;
	};

	const addWebhookVariableFromWebhookResult = async (item, index, type) => {

		let found = false;
		webhookVariables.map((i) => {
			if (i.dotNotationWay === item.dotNotation) {
				found = true;
			}
		});
		if (found) {
			return;
		}

		try {
			const obj = {
				name: item.name,
				type: type,
				order: index,
				webhookID: webhook.id,
				dotNotationWay: item.dotNotation,
			};
			const { data } = await postGenericCRUD("Webhook_Variables", obj);

			updateWebhookVariables([...webhookVariables, data[0]]);

			executeWebhookModule();
		} catch (error) {
			console.error(error);
		}
	};

	const handleInputChange = async (index, column, value) => {
		const newVariables = [...webhookVariables];
		newVariables[index] = { ...newVariables[index], [column]: value };
		updateWebhookVariables(newVariables);
	};

	const addNewVariableToPathSequence = (index) => {
		const temp = [...pathVariablesSequence];
		temp.push({
			index: index,
			order:
				pathVariablesSequence.length > 0
					? getHighestOrderFromSequence() + 1
					: getHighestOrder() + 1,
			name: webhookVariables[index].name,
		});
		setPathVariablesSequence([...temp]);
	};

	const changeVariableColumn = async (index, column, value) => {
		try {
			let obj;

			if (column === "type" && value === "PATH") {
				const temp = [...pathVariablesSequence];
				addNewVariableToPathSequence(index);
				obj = {
					[column]: value,
					order:
						pathVariablesSequence.length > 0
							? getHighestOrderFromSequence() + 1
							: getHighestOrder() + 1,
				};
			} else {
				obj = { [column]: value };
			}

			const { data } = await postGenericCRUDWithID(
				"Webhook_Variables",
				webhookVariables[index].id,
				obj,
			);

			const newVariables = [...webhookVariables];
			newVariables[index] = data;
			updateWebhookVariables([...newVariables]);

			executeWebhookModule();
		} catch (error) {
			console.error(error);
		}
	};

	const checkIfSelected = (type, dotNotation) => {
		let selected = false;
		webhookVariables.map((item) => {
			if (item.type === type && item.dotNotationWay === dotNotation) {
				selected = true;
			}
		});
		return selected;
	};

	const getSelectedVariable = (type, dotNotation) => {
		let selected = null;
		webhookVariables.map((item) => {
			if (item.type === type && item.dotNotationWay === dotNotation) {
				selected = item;
			}
		});
		return selected;
	};

	const getValueFromWebhookResult = (item) => {
		const type = item.type;
		const name = item.name;

		if (!webhookResult) {
			return;
		}

		if (!moduleResult?.frontend) {
			return;
		}
		let value = "";

		moduleResult?.frontend.generatedWebhookVariables.map((result) => {
			if (result.variableID === item.id) {
				value = result.value;
			}
		});

		return value;

	};

	const checkIfOrderIsNotPresent = (index) => {
		let value = false;
		if (pathVariablesSequence.length === 0) return false;
		pathVariablesSequence.filter((pathVar) => {
			if (pathVar.index === index) {
				value = true;
			}
		});
		return value;
	};

	const handleSequence = (idx, val) => {
		const temp = [...pathVariablesSequence];
		temp.map((item, index) => {
			if (item.order !== null && item.order.toString() === val) {
				changeVariableColumn(item.index, "order", null);
				temp[index] = { ...temp[index], order: null };
			}
		});
		setPathVariablesSequence(temp);
		changeVariableColumn(idx, "order", val);
	};

	const getPositionOptions = (index) => {
		if (!checkIfOrderIsNotPresent(index)) {
			if (webhookVariables[index].order != null) {
				return [
					webhookVariables[index].order < 10
						? `0${webhookVariables[index].order.toString()}`
						: webhookVariables[index].order.toString(),
				];
			}
			return ["None"];
		}
		const temp = [];
		pathVariablesSequence.map((i) => {
			temp.push(
				i.order !== null
					? i.order < 10
						? `0${i.order.toString()}`
						: i.order.toString()
					: "None",
			);
		});
		return temp;
	};

	const IteratedPayload = (props) => {
		const pixelgap = 20;
		//const indexProp = props.index;
		//const item = props.item;
		const object = props.object;
		const name = props.name;

		const primitives = [];
		const nonPrimitives = [];

		object.map((item) => {
			if (item.isPrimitive) {
				primitives.push(item);
			} else {
				nonPrimitives.push(item);
			}
		});



		return (
			<>
				<div className=" 
          				border-2 border-transparent
						false
				text-white p-[12px] bg-grey-15 rounded-api-component flex flex-col  w-[300px] relative">
					{name && name.length > 0 && (
						<>
							<div className="flex mb-4 mt-2">
								<div className="pr-2">
									<NodeIcon firstColor={colors.secondary["pink-light-1"]} width="10" height="10" />
								</div>
								<div className="text-base pr-2.5 font-bold capitalize text-secondary-pink-light-1">{name}</div>
							</div>
						</>
					)}
					{!name && (
						<>
							<div className="flex mb-4 mt-2">
								<div className="pr-2">
									<NodeIcon firstColor={colors.secondary["pink-light-1"]} width="10" height="10" />
								</div>
								<div className="text-base pr-2.5 font-bold capitalize text-secondary-pink-light-1">Body of webhook</div>
							</div>
						</>
					)}
					{primitives.map((item, index) => {
						let isFound = checkIfSelected("BODY", item.dotNotation);
						let webhookVariable = null;
						if (isFound) {
							webhookVariable = getSelectedVariable("BODY", item.dotNotation);
						}


						return (
							<>
								<div className={`group relative p-[10px] flex flex-col justify-center gap-[8px] w-full border ${checkIfSelected("BODY", item.dotNotation) ? 'border-[#ee6b7e] bg-[#ee6b7e1a]' : 'border-grey-13 hover:border-[#ee6b7e] hover:bg-[#ee6b7e1a]'}  last:rounded-b-api-component first:rounded-t-api-component flex-row-reverse`}
									onClick={() => {
										if (webhookVariable) {
											deleteVariable(webhookVariable.id, index);
										} else {
											addWebhookVariableFromWebhookResult(item, index, "body");
										}
									}}
									onKeyDown={() => {
										if (webhookVariable) {
											deleteVariable(webhookVariable.id, index);
										} else {
											addWebhookVariableFromWebhookResult(item, index, "body");
										}
									}}
									key={uuidv4()}
								>
									<div
										className={`cursor-pointer  flex items-center border border-transparent break-words min-w-0`}
									>

										<div className="flex flex-col break-words min-w-0">
											<div class="text-white text-xs font-semibold font-['Inter'] leading-3 tracking-normal capitalize flex break-words">
												<span className="min-w-0">{item.name}</span>
											</div>
											<div className="text-[#ea35fa] py-1 overflow-hidden flex break-words min-w-0">
												<span className="min-w-0">{item.value}</span>
											</div>
										</div>
									</div>
								</div>
							</>
						)
					})}
				</div>

				{nonPrimitives.map((item, index) => (
					<>
						<div
							key={uuidv4()}
							className={`flex-grow pb-1 pt-1 rounded-[3px] cursor-pointer  flex flex-col border border-transparent
						}`}
						>
							<div class="text-white text-xs font-semibold font-['Inter'] leading-3 tracking-normal">
								<div className={`pl-[20px] flex flex-col`}>

									<IteratedPayload object={item.value} name={item.name} key={uuidv4()} />

								</div>
							</div>
						</div>
					</>
				))}



			</>
		);


	};

	const updateSubscription = async (SNCID) => {
		console.log('SNCID', SNCID);
		let valueToSend = SNCID;
		if (SNCID == -1) {
			valueToSend = null;
		}
		let response = await postGenericCRUDWithID("Webhooks", webhook.id, { SNCSubscribeID: valueToSend });
		setWebhookSNCSubscribeID(SNCID);

	};


	const handleInsertVariable = async (webhookVariableId) => {
		try {
			const payload = {
				variableID: webhookVariableId,
				speccID: speccID,
				variableType: "WEBHOOK",
			};

			const insertedVariable = await postGenericCRUD("Used_Variables", payload);

			const allUsedVariables = [];
			for (let i = 0; i < usedVariables.length; i++) {
				allUsedVariables.push(usedVariables[i]);
			}
			allUsedVariables.push(insertedVariable.data[0]);

			setUsedVariables(allUsedVariables);
		} catch (error) {
			console.error(error);
		}
	}

	const handleDeleteVariable = async (webhookVariableId) => {
		const getUsedVariableId = usedVariables?.find(
			(item) => item.variableID === webhookVariableId
		)?.id;
		try {
			const deleteVariable = await deleteGenericCRUDWithID(
				"Used_Variables",
				getUsedVariableId
			);
			setUsedVariables(
				usedVariables.filter((item) => item.id !== getUsedVariableId)
			);
		} catch (error) {
			console.error(error);
		}
	}

	const handleVariableChange = async (newName, editVariableId) => {
		if (!newName) return;
		if (!editVariableId) return;
		try {
			const response = await postGenericCRUDWithID(
				"Active_Variables",
				editVariableId,
				{ name: newName }
			);

			if (response && response.data) {
				const updatedVariables = variables?.map((variable) =>
					variable?.id === editVariableId ? response?.data : variable
				);
				setVariables(updatedVariables);
			} else {
				console.error("Failed to update the variable");
			}
		} catch (error) {
			console.error("Error updating the variable name");
		}
	}

	const handleVariableSelect = async (value, selectedVariableId) => {
		if (!value) return;
		if (!selectedVariableId) return;
		try {
			const response = await postGenericCRUDWithID(
				"Active_Variables",
				selectedVariableId,
				{ variableType: value }
			);

			if (response && response.data) {
				const updatedVariables = variables?.map((variable) =>
					variable?.id === selectedVariableId ? response?.data : variable
				);
				setVariables(updatedVariables);
			} else {
				console.error("Failed to update the variable");
			}
		} catch (error) {
			console.error("Error updating the variable name");
		}
	}

	const deleteActiveVariable = async (selectedID) => {
		try {
			const deleteVariable = await deleteGenericCRUDWithID(
				"Active_Variables",
				selectedID
			);
			setVariables(
				variables.filter((item) => item.id !== selectedID)
			);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<div className="flex flex-col w-full mx-[10px] mt-[10px]">
			<div className="border-b border-grey-2 w-full" />
			<div
				className={`p-5 .bg-custom-modal-gradient mt-[10px] rounded-[5px] w-[100%] gap-[10px] flex flex-col max-h-full ${isCheckingForWebhook || webhookResult ? "h-full" : "h-auto"
					}`}
			>

				<div className="flex flex-col h-full overflow-scroll">
					<div className="flex flex-col gap-[10px]  pb-0 pr-1 h-full">
						<div className="flex flex-col gap-[5px] items-start w-full mt-[10px] ">

							<div className="flex flex-col">
								<div className="mb-2">
									Subscribe to event
								</div>
								<div>
									<select className="text-[#F8F9FA] bg-[#343A40] p-4" onChange={(e) => {
										updateSubscription(e.target.value);
									}}><option value={-1} selected={(webhook.SNCSubscribeID == null) ? true : false}>Select SNC</option>
										{webhook?.availableSNC?.map((item) => {
											return <><option value={item.id} selected={(webhook.SNCSubscribeID == item.id) ? true : false}>SpeccID: {item.speccID} - {item.nameOfSpecc}</option></>
										})}
									</select>
								</div>
							</div>
							<div className="border-b mt-4 border-grey-2 w-full" />

							<div className="flex flex-col gap-[5px] items-start w-full mt-[10px] ">
								<div class="text-[#aeaeae] text-base font-normal font-['Inter'] leading-[14px] pl-3">
									Base URL
								</div>
								<div className="flex gap-[10px] w-full items-center">

									<div className="relative w-[70%] flex justify-start group">
										<SInput
											name="firstName"
											type="text"
											className="w-full"
											required
											placeholder="https://api.specc.no/webhook/LONG-HASH"
											onChange={(e) => { }}
											value={`${import.meta.env.VITE_API_URL}/webhook/${webhook.GUID}`}
										/>

										<div
											onClick={() => {
												navigator.clipboard.writeText(
													`${import.meta.env.VITE_API_URL}/webhook/${webhook.GUID}`,
												);
											}}
											onKeyDown={() => {
												navigator.clipboard.writeText(
													`${import.meta.env.VITE_API_URL}/webhook/${webhook.GUID}`,
												);
											}}
											className="copy-icon-container !hidden group-hover:!flex cursor-pointer"
										>
											<Copy className="icon-white" />
										</div>
									</div>
									<SButton
										sType="button"
										onClick={() => {
											if (!isCheckingForWebhook) {
												handleTimer();
											} else {
												stopTimer();
											}
											//deleteAction();
										}}
										className="listen-button"
									>
										<div class="text-white text-xs font-semibold font-['Inter'] leading-[14px] tracking-normal">
											{!isCheckingForWebhook ? "Listen" : "Stop"}
										</div>
									</SButton>
									{isCheckingForWebhook && (
										<div class="text-[#8c8c8c] text-[10px] font-medium font-['Inter'] leading-3">
											{`${Math.floor(time / 60)}`.padStart(2, 0)}:
											{`${time % 60}`.padStart(2, 0)} mins
										</div>
									)}
								</div>
							</div>
						</div>

						{isCheckingForWebhook ? (
							<Loading className="flex items-center justify-center h-full" />
						) : (
							webhookResult && (
								<>
									<div className="border-b border-grey-2 w-full mt-4" />
									<div className="flex flex-col gap-[10px]">
										<div class="text-white text-xs font-bold font-['Inter'] leading-[11px] tracking-normal">
											Results{" "}
										</div>
										{moduleResult.frontend.parsedWebhook.path_parameters.length >
											0 && (
												<>
													<div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px]">
														Path :
													</div>
													{webhookResult && (
														<div className="flex gap-[5px] flex-wrap">
															{moduleResult.frontend.parsedWebhook.path_parameters.map(
																(item, index) => (
																	<div
																		key={uuidv4()}
																		onClick={() => {
																			addWebhookVariableFromWebhookResult(
																				item,
																				index,
																				"path",
																			);
																		}}
																		onKeyDown={() => {
																			addWebhookVariableFromWebhookResult(
																				item,
																				index,
																				"path",
																			);
																		}}
																		className={`p-[5px] h-6 gap-[5px] bg-grey-1 rounded-[3px] flex items-center border border-transparent cursor-pointer ${checkIfSelected("PATH", item.dotNotation)
																			? "bg-secondary-yellow50"
																			: "hover:border-secondary-yellow-2"
																			}`}
																	>
																		{checkIfSelected("PATH", item.dotNotation) && (
																			<Variable />
																		)}
																		<div class="text-white text-xs font-semibold font-['Inter'] leading-3 tracking-normal">
																			{item.name}
																		</div>
																	</div>
																),
															)}
														</div>
													)}
												</>
											)}
										{moduleResult.frontend.parsedWebhook.primitive_payload
											.length > 0 && (
												<>
													<div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px]">
														Body :
													</div>
													{webhookResult && (
														<div className="flex flex-col flex-grow gap-[5px]">

															<IteratedPayload
																object={moduleResult.frontend.parsedWebhook.primitive_payload}
																//item={item}
																//index={index}
																key={uuidv4()}
															/>

														</div>
													)}
												</>
											)}
										{moduleResult.frontend.parsedWebhook.query_parameters.length >
											0 && (
												<>
													<div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px]">
														Query :
													</div>
													{webhookResult && (
														<div className="flex gap-[10px] flex-wrap">
															{moduleResult.frontend.parsedWebhook.query_parameters.map(
																(item, index) => (
																	<div
																		key={uuidv4()}
																		onClick={() => {
																			addWebhookVariableFromWebhookResult(
																				item,
																				index,
																				"query",
																			);
																		}}
																		onKeyDown={() => {
																			addWebhookVariableFromWebhookResult(
																				item,
																				index,
																				"query",
																			);
																		}}
																		className={`p-[5px] h-6 gap-[5px] bg-grey-1 w-max rounded-[3px] cursor-pointer  flex items-center border border-transparent  ${checkIfSelected("QUERY", item.dotNotation)
																			? "bg-secondary-yellow50"
																			: "hover:border-secondary-yellow-2"
																			}`}
																	>
																		{checkIfSelected("QUERY", item.dotNotation) && (
																			<Variable />
																		)}
																		<div class="text-white text-xs font-semibold font-['Inter'] leading-3 tracking-normal">
																			{item.name}: {item.value}
																		</div>
																	</div>
																),
															)}
														</div>
													)}
												</>
											)}
										<div className="border-b border-grey-2 w-full" />
										<div className="bg-grey-15 p-2 rounded-[8px]">
											<div class="justify-between items-start inline-flex">
												<div class="text-white text-xs font-bold font-['Inter'] leading-[11px] tracking-normal p-4">
													Selected Variables
												</div>
											</div>

											<Table className="webhook-table w-full flex  flex-col">
												<TableHeader>
													<Column isRowHeader={true}>#</Column>
													<Column isRowHeader={true}>Name</Column>
													<Column isRowHeader={true}>
														<div className="flex gap-[10px]">
															<div class="text-white text-xs font-bold font-['Inter'] leading-3 tracking-normal">
																Type
															</div>
															<ArrowDown />
														</div>
													</Column>
													<Column isRowHeader={true}>Value</Column>
													<Column isRowHeader={true} />
													<Column isRowHeader={true}>
														{/* <Delete className="icon-white h-4 w-4" /> */}
													</Column>
												</TableHeader>
												<TableBody>
													{webhookVariables.length > 0 ? (
														webhookVariables.map((item, index) => {
															return (
																<Row key={uuidv4()}>
																	<Cell>{index}</Cell>
																	<Cell>
																		<SInput
																			name="name"
																			type="text"
																			required
																			placeholder="Name"
																			defaultValue={item.name}
																			onBlur={(e) => {
																				handleInputChange(
																					index,
																					"name",
																					e.target.value,
																				);
																				changeVariableColumn(
																					index,
																					"name",
																					e.target.value,
																				);
																			}}
																		/>
																	</Cell>
																	<Cell className="type-dropdown">
																		<SFormSelect
																			key={uuidv4()}
																			options={["QUERY", "PATH", "BODY"]}
																			selectedValue={
																				item.type ? item.type : "No value"
																			}
																			getValue={(val) => {
																				changeVariableColumn(index, "type", val);
																			}}
																			buttonClassName="!gap-[30px] "
																		/>
																	</Cell>
																	<Cell>
																		<SInput
																			name="varValue"
																			type="text"
																			disabled={item.type !== "PATH"}
																			placeholder="Value"
																			onBlur={(e) => {
																				handleInputChange(
																					index,
																					"name",
																					e.target.value,
																				);

																				changeVariableColumn(
																					index,
																					"name",
																					e.target.value,
																				);
																			}}
																			value={getValueFromWebhookResult(item)}
																		/>
																	</Cell>
																	<Cell className="type-dropdown order-dropdown">
																		{item.type === "PATH" && (
																			// <span>Hey</span>
																			<SFormSelect
																				key={uuidv4()}
																				options={getPositionOptions(index)}
																				selectedValue={
																					item.order != null
																						? item.order < 10
																							? `0${item.order.toString()}`
																							: item.order.toString()
																						: pathVariablesSequence.length > 0 &&
																							pathVariablesSequence.filter(
																								(i) => index === i.index,
																							).length > 0 &&
																							pathVariablesSequence.filter(
																								(i) => index === i.index,
																							)[0].order !== null
																							? pathVariablesSequence
																								.filter(
																									(i) => index === i.index,
																								)[0]
																								.order.toString()
																							: ""
																				}
																				getValue={(val) => {
																					handleSequence(index, val);
																				}}
																				buttonClassName="!gap-[30px] "
																			/>
																		)}
																	</Cell>
																	<Cell>
																		<Delete
																			onClick={() => {
																				deleteVariable(item.id, index);
																			}}
																			className="icon-white h-[14px] w-4 cursor-pointer"
																		/>
																	</Cell>
																</Row>
															);
														})
													) : (
														<Row className="!flex w-full justify-center">
															<Cell>No selected variables found</Cell>
														</Row>
													)}
												</TableBody>
											</Table>

											<div
												className="flex items-center gap-[5px] cursor-pointer mb-[10px] mt-4"
												onClick={() => {
													addNewWebhookVariable();
												}}
												onKeyDown={() => {
													addNewWebhookVariable();
												}}
											>
												<Add className="icon-white h-3 w-3" />
												<div class="text-white text-xs font-semibold font-['Inter'] underline leading-[14px] tracking-normal">
													Add another row
												</div>
											</div>
										</div>
									</div>
								</>
							)
						)}
					</div>
				</div>
			</div>

		</div>
	);
}
