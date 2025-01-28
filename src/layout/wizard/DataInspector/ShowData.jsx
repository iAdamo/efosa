import { WizardContext } from "@contexts/WizardContext";

import {useState, useContext, useEffect } from "react";
import { toast } from "sonner";

const ShowData = (props) => {
    const { speccID } = useContext(WizardContext);
    const {
        fetchedData,
        setViewData,
        viewData,
        searchResults,
        setSearchResults,
        selectedIndexForSearch,
        setSelectedIndexForSearch,
        searchString,
        setSearchString,
    } = props;

    if (!fetchedData) {
        return <></>;
    }

    if (!viewData) {
        return <></>;
    }

    let isJSON = false;
    if (typeof fetchedData === "object") {
        isJSON = true;
    }

    const [useText, setUseText] = useState(
        isJSON
            ? JSON.stringify(fetchedData.body, null, 2).split(/\r?\n/)
            : fetchedData.body
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
                        scrollView.children[
                            searchResults[selectedIndexForSearch]
                        ];

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

    const scrollToTop = () => {
        const scrollView = document.getElementById("scrollView");
        scrollView.scrollTo({
            top: 0,
        });
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
                    scrollView.scrollTop +
                    elementPosition -
                    offset -
                    startValue;

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
                if (
                    useText[i]
                        .toLowerCase()
                        .includes(searchString.toLowerCase())
                ) {
                    all.push(i);
                }
            }

            setSearchResults(all);
            scrollTo(0);
        } else {
            setSearchResults([]);
            setSelectedIndexForSearch(0);
        }

        scrollTo(0);
    }, [searchString]);

    useEffect(() => {
        if (searchResults.length > 0) {
            scrollTo(0);
        } else {
            scrollToTop();
        }
    }, [JSON.stringify(searchResults)]);

    useEffect(() => {
        if (searchString.length > 0) {
            scrollTo(selectedIndexForSearch, true);
        }
    }, []);

    return (
        <>
            <div className="min-h-0 flex flex-col" style={{ flex: 1 }}>
                <p
                    className="mb-2"
                    onClick={() => {
                        setViewData(false);
                    }}
                >
                    Back
                </p>
                <hr className="mb-4" />
                <div
                    className=" flex-grow flex flex-col min-h-0"
                    style={{ flex: 1 }}
                >
                    <div className="font-bold text-[24px]">Header</div>
                    <div className="h-[200px] min-h-[200px] overflow-auto mb-4">
                        <pre>{fetchedData.header}</pre>
                    </div>
                    <div className="font-bold text-[24px]">Body</div>
                    <div className="font-bold text-[24px] text-center">
                        Search
                    </div>
                    <div className="font-bold text-[24px] text-center">
                        <input
                            type="text"
                            onChange={(e) => {
                                performSearch(e.target.value);
                            }}
                            defaultValue={searchString}
                        />
                    </div>
                    <div className="font-bold text-[24px] text-center">
                        <div>Search results: {searchResults.length}</div>
                        <div>
                            <button
                                className="border border-[#000000] bg-white p-2 m-2 text-[18px]"
                                onClick={() => {
                                    decreaseIndexChoice();
                                }}
                            >
                                Go to previous
                            </button>
                            <button
                                className="border border-[#000000] bg-white p-2 m-2 text-[18px]"
                                onClick={() => {
                                    increaseIndexChoice();
                                }}
                            >
                                Go to next
                            </button>
                        </div>
                    </div>
                    <div className="overflow-auto min-h-0 flex-col">
                        <pre
                            className="overflow-auto h-[100%]"
                            onClick={(e) => {
                                doCopy(e.target.innerHTML);
                            }}
                            id={"scrollView"}
                        >
                            {!isJSON && <>{useText}</>}
                            {isJSON && (
                                <>
                                    {useText.map((line, index) => {
                                        let highlight = false;
                                        for (
                                            let i = 0;
                                            i < searchResults.length;
                                            i++
                                        ) {
                                            if (searchResults[i] == index) {
                                                highlight = true;
                                            }
                                        }
                                        let isChosen = false;
                                        if (
                                            searchResults[
                                                selectedIndexForSearch
                                            ] == index
                                        ) {
                                            isChosen = true;
                                        }

                                        let backgroundColor = null;
                                        if (isChosen) {
                                            backgroundColor = "bg-[#8cff32]";
                                        } else {
                                            if (highlight) {
                                                backgroundColor =
                                                    "bg-[#e9ff32]";
                                            }
                                        }

                                        return (
                                            <>
                                                <div
                                                    className={`${
                                                        backgroundColor
                                                            ? backgroundColor
                                                            : ""
                                                    } ${
                                                        canBeCopied(line)
                                                            ? "cursor-pointer hover:bg-[#cccccc]"
                                                            : ""
                                                    }`}
                                                >
                                                    {line}
                                                </div>
                                            </>
                                        );
                                    })}
                                </>
                            )}
                        </pre>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShowData;
