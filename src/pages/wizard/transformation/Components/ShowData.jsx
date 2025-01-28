import { useState, useEffect } from "react";
import { toast } from "sonner";

const ShowData = (props) => {
	const {
		fetchedData,
		viewData,
		searchResults,
		setSearchResults,
		selectedIndexForSearch,
		setSelectedIndexForSearch,
		searchString,
		setSearchString,
		isUseableRows,
	} = props;

	if (!fetchedData) {
		return <></>;
	}

	if (!viewData) {
		return <></>;
	}

	const [useText, setUseText] = useState(
		!isUseableRows
			? JSON.stringify(fetchedData.listOfDataObjects, null, 2).split(/\r?\n/)
			: fetchedData.listOfDataObjects,
	);

	useEffect(() => {
		const handleKeyDown = (event) => {
			const code = event.which || event.keyCode;
			const charCode = String.fromCharCode(code).toLowerCase();
			if ((event.ctrlKey || event.metaKey) && charCode === "s") {
				//alert("CTRL+S Pressed");
			} else if ((event.ctrlKey || event.metaKey) && charCode === "c") {
				if (searchResults.length > 0) {
					const scrollView = document.getElementById("scrollView");
					const child =
						scrollView.children[searchResults[selectedIndexForSearch]];

					doCopy(child.innerHTML);
				}
			} else if ((event.ctrlKey || event.metaKey) && charCode === "v") {
				//alert("CTRL+V Pressed");
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [selectedIndexForSearch, JSON.stringify(searchResults)]);

	const performSearch = (value) => {
		setSearchString(value);
	};

	const increaseIndexChoice = () => {
		const newIndex = selectedIndexForSearch + 1;
		if (selectedIndexForSearch + 1 <= searchResults.length - 1) {
			setSelectedIndexForSearch(newIndex);
		}
		scrollTo(newIndex);
	};

	const decreaseIndexChoice = () => {
		const newIndex = selectedIndexForSearch - 1;
		if (selectedIndexForSearch - 1 >= 0) {
			setSelectedIndexForSearch(newIndex);
		}
		scrollTo(newIndex);
	};

	const doCopy = (value) => {
		value = value.trim();
		const split = value.split(":");
		if (split.length == 2) {
			value = split[1];
			value = value.trim();
			value = value.replace('",', "");
			value = value.replaceAll('"', "");

			if (value[value.length - 1] == ",") {
				value = value.substring(0, value.length - 1);
			}

			navigator.clipboard.writeText(value);

			toast.success(`Value copied: ${value}`);
		}
	};

	const canBeCopied = (value) => {
		value = value.trim();
		const split = value.split(":");
		if (split.length == 2) {
			return true;
		}
		return false;
	};

	const scrollTo = (index, immatiate = false) => {
		const scrollView = document.getElementById("scrollView");
		for (let i = 0; i < scrollView.children.length; i++) {
			if (i == searchResults[index]) {
				const theDiv = scrollView.children[i];

				const startValue = scrollView.getBoundingClientRect().top;

				var elementPosition = theDiv.getBoundingClientRect().top;

				const offset = 100;

				const target =
					scrollView.scrollTop + elementPosition - offset - startValue;
				if (immatiate) {
					scrollView.scrollTo({
						top: target,
					});
				} else {
					scrollView.scrollTo({
						top: target,
						behavior: "smooth",
					});
				}
			}
		}
	};

	useEffect(() => {
		if (searchString.length > 0) {
			const all = [];
			for (let i = 0; i < useText.length; i++) {
				if (useText[i].toLowerCase().includes(searchString.toLowerCase())) {
					all.push(i);
				}
			}

			setSearchResults(all);
		} else {
			setSearchResults([]);
			setSelectedIndexForSearch(0);
		}

		scrollTo(0);
	}, [searchString]);

	useEffect(() => {
		if (searchString.length > 0) {
			scrollTo(selectedIndexForSearch, true);
		}
	}, []);

	return (
		<div className="w-full">
			<div className="overflow-auto">
				<pre
					className="overflow-auto h-[600px]"
					onClick={(e) => {
						doCopy(e.target.innerHTML);
					}}
					id={"scrollView"}
				>
					{!isUseableRows && <>{useText}</>}
					{isUseableRows && (
						<div className="flex flex-col gap-2">
							{useText.map((line, index) => {
								line = line.datarow;
								let highlight = false;
								for (let i = 0; i < searchResults.length; i++) {
									if (searchResults[i] == index) {
										highlight = true;
									}
								}
								let isChosen = false;
								if (searchResults[selectedIndexForSearch] == index) {
									isChosen = true;
								}

								let backgroundColor = null;
								if (isChosen) {
									backgroundColor = "bg-[#8cff32]";
								} else {
									if (highlight) {
										backgroundColor = "bg-[#e9ff32]";
									}
								}

								let allLines = line;
								allLines = JSON.stringify(allLines, null, 2).split(/\r?\n/);

								return (
									<div className="bg-grey-3 p-3 rounded-base">
										{allLines.map((line, index) => {
											if (index == 0 || index == allLines.length - 1) {
												return <></>;
											}
											return (
												<div
													className={`${
														backgroundColor ? backgroundColor : ""
													} ${
														canBeCopied(line)
															? "cursor-pointer hover:bg-[#cccccc]"
															: ""
													}`}
												>
													{line}
												</div>
											);
										})}
									</div>
								);
							})}
						</div>
					)}
				</pre>
			</div>
		</div>
	);
};

export default ShowData;
