const SelectEndpoint = (props) => {
    const { endpoints, selectEndpointClick } = props;

    return (
        <>
            <div className="overflow-auto">
                <div className="text-center mt-6">
                    <div className="">
                        <div className="h-[100%]">
                            {endpoints.map((endpoint) => {
                                return (
                                    <div
                                        className="display-block h-max-content border p-2 border-[#000000] text-[18px] hover:bg-[#aaaaaa] text-left hover:cursor-pointer"
                                        onClick={() => {
                                            selectEndpointClick(endpoint);
                                        }}
                                    >
                                        {endpoint}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SelectEndpoint;
