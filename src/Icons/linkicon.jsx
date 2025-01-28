const LinkIcon = ({ color, size }) => (
    <svg
        width={size || "26"}
        height="35"
        viewBox="0 0 26 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle
            cx="4.31293"
            cy="29.9838"
            r="4.31293"
            fill={color || "#D1D1D1"}
        />
        <circle
            cx="19.888"
            cy="22.7621"
            r="2.90952"
            fill={color || "#D1D1D1"}
        />
        <circle
            cx="9.20739"
            cy="12.4247"
            r="3.59411"
            fill={color || "#D1D1D1"}
        />
        <circle
            cx="22.7622"
            cy="2.97798"
            r="2.97798"
            fill={color || "#D1D1D1"}
        />
        <rect
            x="7.57227"
            y="27.6782"
            width="10.6561"
            height="1.54544"
            transform="rotate(-25.878 7.57227 27.6782)"
            fill={color || "#D1D1D1"}
        />
        <rect
            x="10.8018"
            y="12.9382"
            width="10.6561"
            height="1.54544"
            transform="rotate(44.3474 10.8018 12.9382)"
            fill={color || "#D1D1D1"}
        />
        <rect
            x="10.8213"
            y="10.6082"
            width="12.7784"
            height="1.54544"
            transform="rotate(-35.428 10.8213 10.6082)"
            fill={color || "#D1D1D1"}
        />
    </svg>
);

export default LinkIcon;
