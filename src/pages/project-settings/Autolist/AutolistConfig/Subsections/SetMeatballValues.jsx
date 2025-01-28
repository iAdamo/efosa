
const SetMeatballValues = (props) => {
    const { setFetchedMeatballs, setFetchedData, setViewData, fetchedData, selectedEndpoint, fetchedMeatballs, fetchDataClick } = props;

    return (
        <>
           <div
                                onClick={() => {
                                    setFetchedMeatballs(null);
                                    
                                    setFetchedData(null);
                                }}
                            >
                                Back
                            </div>
                           
                            <div className="text-center">
                                URL: {selectedEndpoint}
                            </div>

                            <div className="overflow-auto">
                                {fetchedMeatballs.map((meatball, index) => {
                                    return (
                                        <>
                                            <div className="border border-[#000000] p-2 my-1">
                                                <div>
                                                    <div>
                                                        Name:{" "}
                                                        <b>{meatball.name}</b>{" "}
                                                        {meatball?.required &&
                                                            meatball.required ===
                                                                true && (
                                                                <>
                                                                    <span className="text-[#ff0000]">
                                                                        *
                                                                    </span>
                                                                </>
                                                            )}
                                                    </div>
                                                    {meatball?.description && (
                                                        <>
                                                            <div>
                                                                Description:{" "}
                                                                {
                                                                    meatball.description
                                                                }
                                                            </div>
                                                        </>
                                                    )}

                                                    {meatball?.type && (
                                                        <>
                                                            <div>
                                                                Type:{" "}
                                                                {meatball.type}
                                                            </div>
                                                        </>
                                                    )}
                                                    {meatball?.in && (
                                                        <>
                                                            <div>
                                                                In:{" "}
                                                                {meatball.in}
                                                            </div>
                                                        </>
                                                    )}
                                                    {meatball.type ==
                                                        "boolean" && (
                                                        <>
                                                            <select
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    updateMeatballValue(
                                                                        index,
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                            >
                                                                <option value="-1">
                                                                    Not set
                                                                </option>
                                                                <option value="1">
                                                                    true
                                                                </option>
                                                                <option value="0">
                                                                    false
                                                                </option>
                                                            </select>
                                                        </>
                                                    )}
                                                    {meatball.type !=
                                                        "boolean" && (
                                                        <>
                                                            <input
                                                                type="text"
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    updateMeatballValue(
                                                                        index,
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    );
                                })}
                            </div>
                            <div className="text-center">
                                <button
                                    className="border mt-3 p-4 bg-[#ffffff] border-[#000000]"
                                    onClick={() => {
                                        fetchDataClick();
                                    }}
                                >
                                    Get data
                                </button>
                            </div>
        </>
    );
};

export default SetMeatballValues;
