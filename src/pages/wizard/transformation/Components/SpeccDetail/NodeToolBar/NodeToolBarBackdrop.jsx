import { createPortal } from "react-dom";

const NodeToolBarBackdrop = ({ style }) => {
    return createPortal(
        <div style={style} id="backdrop"></div>,
        document.getElementById("root")
    );
};

export default NodeToolBarBackdrop;
