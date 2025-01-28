const SetList = (props) => {
    const { autolist, lists, setLists, setListClick } = props;

    return (
        <>
            <div
                onClick={() => {
                    setLists(null);
                }}
            >
                Back
            </div>

            <div className="overflow-auto">
                <div className="text-center mt-6">
                    <div className="">
                        <div className="h-[100%]">
                            Set list
                            {lists.map((list) => {
                                return (
                                    <div
                                        className="display-block h-max-content border p-2 border-[#000000] text-[18px] hover:bg-[#aaaaaa] text-left hover:cursor-pointer"
                                        onClick={() => {
                                            setListClick(list);
                                        }}
                                    >
                                        {list}
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

export default SetList;
