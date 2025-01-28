import { ProgressBar } from "react-aria-components";

export default function SProgressBar({ ...props }) {
  return (
    <ProgressBar isIndeterminate>
      {({ percentage, valueText }) => (
        <>
          <div className="bar">
            <div className="fill" style={{ width: `${percentage}%` }} />
          </div>
        </>
      )}
    </ProgressBar>
  );
}
