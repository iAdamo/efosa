const CheckMarkIcon = ({ color }) => {
    return (
        <svg
            width="9"
            height="8"
            viewBox="0 0 9 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M7.93826 0.000463015C8.87677 -0.0262926 9.35842 1.11287 8.68645 1.76736L3.32809 7.12568L0.336626 4.1342C-0.673912 3.16483 0.821253 1.66857 1.79166 2.67911L3.32809 4.21549L7.23129 0.312262C7.4175 0.120443 7.67105 0.00862308 7.93826 0.000463015Z"
                fill={color || "#EBDCF9"}
            />
        </svg>
    );
};

export default CheckMarkIcon;
