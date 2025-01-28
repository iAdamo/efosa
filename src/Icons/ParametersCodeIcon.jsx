export default function ParameterCodeIcon({ isActive }) {
    return (
        <svg
            width="36"
            height="28"
            viewBox="0 0 36 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                width="35.097"
                height="28"
                rx="6"
                fill={isActive ? "#E9D6FB" : "#D9D9D9"}
            />
            <path
                d="M12.0101 10.7693L6.74902 14.0001L12.0101 17.2309M14.8483 20.4617L20.2479 7.53857M23.0861 10.7693L28.3472 14.0001L23.0861 17.2309"
                stroke={isActive ? "rgba(145, 85, 217, 1)" : "#979696"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
