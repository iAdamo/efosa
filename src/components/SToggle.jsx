import React, { useState } from "react";

const SToggle = ({ name, value, label, tooltip }) => {
    const [checked, setChecked] = useState(false);
    const handleChange = () => setChecked(!checked);

    return (
        <label
            className="s-toggle-label"
            title={tooltip}
        >
            <span className="s-toggle-label-text">
                {label}
            </span>
            <input
                type="checkbox"
                value={value}
                checked={checked}
                onChange={handleChange}
                className="s-toggle-input"
                id={name}
            />
            <div
                className={`s-toggle-switch ${checked ? "checked" : "unchecked"}`}
            >
                <div
                    className={`s-toggle-circle ${checked ? "checked" : "unchecked"}`}
                ></div>
            </div>
        </label>
    );
};

export default SToggle