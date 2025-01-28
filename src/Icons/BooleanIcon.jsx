const BooleanIcon = ({ firstColor, secondColor, active }) => {
    return (
        <svg
            width="35"
            height="13"
            viewBox="0 0 31 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <line
                x1="2.5"
                y1="6.5"
                x2="24.5"
                y2="6.5"
                stroke={(active ? '#ADABFF' : '#DADADA')}
                strokeWidth="5"
                strokeLinecap="round"
            />
            <ellipse
                cx="5"
                cy="6.5"
                rx="6"
                ry="6.5"
                fill={(active ? '#6663FF' : '#808080')}
            />
        </svg>
    );
};

export default BooleanIcon;
