import { useContext } from "react";
import Badge from "./Badge";
import { AddNodeModalContext } from "@contexts/AddNodeModalContext";
const SelectedElements = () => {
    const { selectedAPIs, addSelectedAPIs } = useContext(AddNodeModalContext);

    if (!selectedAPIs.length) {
        return null;
    }

    return (
        <div className="modal-selected element flex flex-col gap-4">
            <p>Added</p>
            {selectedAPIs.map((elem) => {
                const shownContent = elem.url.split('/').reverse()[0];
                return (
                    <Badge
                        content={shownContent}
                        key={elem.url}
                        type={elem.type}
                        isClose
                        onClick={() => {
                            addSelectedAPIs((prev) => prev.filter((item) => item !== elem))
                        }}
                    />
                );
            })}
        </div>
    );
};

export default SelectedElements;
