
import { useParams } from "react-router-dom";
import Topbar from "./Topbar";
import Breadcrumb from "./Breadcrumb";
import ProgressBox from "./ProgressBox";

export default function Topline(props) {
    const { speccID, projectID, speccName } = props;
    return (
        <>
            <div className="flex mt-[40px]">
                <div className="flex-grow ml-[24px]">
                    <Breadcrumb {...props} />
                </div>
                <div className="flex-grow">
                    <Topbar {...props} />
                </div>

                <div className="flex-grow">
                    <div className="absolute z-[999999]">
                        <ProgressBox />
                    </div>
                </div>
            </div>
        </>
    );
}


