const WrapperFormProperty = ({ children, isActive, onClick }) => (
    <div className={`relative ${!isActive ? "hideCheckboxProperty" : ""} `}>
        {children}
        <div
            onClick={onClick}
            className={`checkboxProperty absolute cursor-pointer right-8 top-11 w-[17px] h-4  rounded-md ${
                isActive ? "bg-[#8AC5BD]" : "border-2 border-[#dadada]"
            }  `}
        />
    </div>
);

export default WrapperFormProperty;
