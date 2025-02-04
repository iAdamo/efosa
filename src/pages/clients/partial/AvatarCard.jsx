import { useEffect, useState } from "react";
import { alphabets } from "./alphabets.js";

const AvatarCard = ({ name = [], customName = [], image, classN = "" }) => {
  const [alphabetId, setAlphabetId] = useState(null);

  useEffect(() => {
    if (name && name[0]) {
      const found = alphabets.find((item) => item.name === name[0]);
      setAlphabetId(found ? found.id : null);
    } else {
      setAlphabetId(null);
    }
  }, [name, alphabets]);

  return (
    <div
      className={`h-10 min-h-10 min-w-10 w-10 rounded-full flex justify-center items-center ${classN} bg-blue-700`}
    >
      {!image ? (
        <div className="text-white text-[18px] lg:text-[22px] font-semibold font-['Inter'] leading-[14px] tracking-tight">
          {name?.[0] || customName?.[0] || ""}
        </div>
      ) : (
        <img
          src={image}
          className="w-full h-full object-cover rounded-full"
          alt="user"
        />
      )}
    </div>
  );
};

export default AvatarCard;
