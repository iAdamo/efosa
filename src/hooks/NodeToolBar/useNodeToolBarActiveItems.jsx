import { WizardContext } from "@contexts/WizardContext";
import { useContext, useEffect, useState } from "react";

const useNodeToolBarActiveItems = (schemas) => {
    const { activeSchemas } = useContext(WizardContext);
    const [activeParameters, setActiveParameters] = useState(0);
    useEffect(() => {
        let i = 0;
        schemas.map((param) => {
            if (activeSchemas.includes(param.id)) {
                i += 1;
            }
        });
        setActiveParameters(i);
    }, [schemas, activeSchemas]);

    return { activeParameters };
};

export default useNodeToolBarActiveItems;
