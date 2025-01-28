import { createContext, useEffect, useState } from "react";

export const MatchContext = createContext(null);

const MatchContextWrapper = ({ children }) => {
    const [isMatchMode, setIsMatchMode] = useState(false);
    const [sourceMatchEndpoint, setSourceMatchEndpoint] = useState(null);
    const [destinationMatchEndpoint, setDestinationMatchEndpoint] =
        useState(null);

    return (
        <MatchContext.Provider
            value={{
                sourceMatchEndpoint,
                setSourceMatchEndpoint,
                destinationMatchEndpoint,
                setDestinationMatchEndpoint,
                isMatchMode,
                setIsMatchMode,
            }}
        >
            {children}
        </MatchContext.Provider>
    );
};
export default MatchContextWrapper;