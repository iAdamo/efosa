const SetUnique = (props) => {
    const { autolist, listOfUnique, setListOfUnique, setUniqueClick } = props;

    return (
        <>
            <div
                onClick={() => {
                    setListOfUnique(null);
                }}
            >
                Back
            </div>

            <div className="overflow-auto">
                <div className="text-center mt-6">
                    <div className="">
                        <div className="h-[100%]">
                            Set unique
                            {listOfUnique.map((unique) => {
                                return (
                                    <div
                                        className="display-block h-max-content border p-2 border-[#000000] text-[18px] hover:bg-[#aaaaaa] text-left hover:cursor-pointer"
                                        onClick={() => {
                                            setUniqueClick(unique);
                                        }}
                                    >
                                        {unique}
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

export default SetUnique;
