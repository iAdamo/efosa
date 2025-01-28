const DeleteIcon = ({ color }) => {
    return (
        <svg
            width="11"
            height="12"
            viewBox="0 0 11 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M1 2.97143H10.4945M2.05494 2.97143V9.87143C2.05494 10.4158 2.52726 10.8571 3.10989 10.8571H8.38461C8.96726 10.8571 9.43956 10.4158 9.43956 9.87143V2.97143M3.63736 2.97143V1.98571C3.63736 1.44132 4.10968 1 4.69231 1H6.8022C7.38484 1 7.85714 1.44132 7.85714 1.98571V2.97143"
                stroke={color || "#EB5757"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M6.80176 5.43571V8.39286"
                stroke={color || "#EB5757"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M4.69238 5.43571V8.39286"
                stroke={color || "#EB5757"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default DeleteIcon;
