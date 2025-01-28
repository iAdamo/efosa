export default function BuilderParametersIcon({ width, height, color }) {
    return (
        <svg
            width={width || "20"}
            height={height || "14"}
            viewBox="0 0 20 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M20 10V12H19V14H17V12H16V14H14V12H9V4H3L1 6H0V0H1L3 2H11V10H14V8H16V10H17V8H19V10H20Z"
                fill={color || "#D7B9F3"}
            />
        </svg>
    );
}
