const UploadBlockIcon = ({ fill = "#77C7BD", size = "26" }) => (
    <svg
        className="mr-2"
        width={size}
        height={size}
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="26" height="26" rx="6" fill={fill} />
        <path
            d="M9 18C15.5 18 10.6667 9 19 9"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
        <circle cx="7" cy="18" r="2" fill="black" />
        <circle cx="19" cy="9" r="2" fill="black" />
    </svg>
);

export default UploadBlockIcon;
