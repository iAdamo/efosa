import React, { useState } from "react";

export const AddNodeModalContext = React.createContext({
    selectedAPIs: [],
    addSelectedAPIs: () => {},
    apiLevels: [],
    setApiLevels: () => {},
    customNode: [],
    setCustomNode: () => {},
});

export const AddNodeModalContextWrapper = ({ children }) => {
    const [selectedAPIs, addSelectedAPIs] = useState([]);
    const [apiLevels, setApiLevels] = useState([]);
    const [customNode, setCustomNode] = useState(false);
    return (
        <AddNodeModalContext.Provider
            value={{
                selectedAPIs,
                addSelectedAPIs,
                apiLevels,
                setApiLevels,
                customNode,
                setCustomNode,
            }}
        >
            {children}
        </AddNodeModalContext.Provider>
    );
};
