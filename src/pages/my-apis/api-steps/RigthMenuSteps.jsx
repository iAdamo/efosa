import TickIcon from "@assets/icons/tick.svg?react";
import 'react-toastify/dist/ReactToastify.css';

function RightMenuSteps({ completeStep, currentStep }) {
    const steps = [
        { value: 1, key: "Add API" },
        { value: 2, key: "Validation failed" },
        { value: 3, key: "Settings" },
    ];

    const getStepClassList = (stepId) => ({
        container: `rounded-[5px] p-4 flex justify-between items-center h-11 ${
            currentStep === stepId ? "bg-sidebar-option-gradient" : ""
        }`,
        text: `text-lg leading-[14px] ${
            currentStep === stepId || completeStep[`step${stepId}`] ? "" : "text-grey-13"
        }`,
        tag: `shadow-tag py-1 px-2.5 rounded-sm ${
            currentStep === stepId
                ? "bg-grey-13 text-custom-ghostWhite"
                : "bg-gradient-grey-1 text-grey-13"
        }`,
    });

    return (
        <div className="bg-grey-15 rounded-lg p-2 w-[349px] h-max flex flex-col gap-1">
            {steps.map(({ key, value }) => {
                const isComplete = completeStep[`step${value}`];
                const { container, text, tag } = getStepClassList(value);

                return (
                    <div key={value} className={container}>
                        <div className="flex gap-1">
                            {isComplete && <TickIcon className="icon-grey-7" />}
                            <span className={text}>{key}</span>
                        </div>
                        <span className={tag}>Step {value}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default RightMenuSteps;
