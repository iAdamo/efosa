const Ellipse = ({ color }) => (
    <svg
        width="18"
        height="17"
        viewBox="0 0 18 17"
        fill={color ? color : "none"}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M17.5 8.5C17.5 12.8917 13.7217 16.5 9 16.5C4.27827 16.5 0.5 12.8917 0.5 8.5C0.5 4.10826 4.27827 0.5 9 0.5C13.7217 0.5 17.5 4.10826 17.5 8.5Z"
            fill={color ? color : "white"}
            stroke={color ? color : "#D9D9D9"}
        />
    </svg>
);

export default Ellipse;
