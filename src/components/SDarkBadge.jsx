import React from "react";

function SDarkBadge({ label, className, ...props }) {
  return (
    <span {...props} className={className ? `s-badge ${className}` : "s-badge"}>
      {label}
    </span>
  );
}

export default SDarkBadge;
