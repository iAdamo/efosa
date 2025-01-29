import ApiCard from "./ApiCard";
import ZapIcon from "@assets/icons/dashboard/sidebar/zap.svg?react";
import EmptyData from "@components/EmptyData.jsx";

const ApiCards = ({
  filteredAPIs,
  isPublic = false
}) => {
  return (
    <div className="w-full flex flex-wrap justify-start -gap-1">
      {filteredAPIs.length > 0 ? (
          filteredAPIs?.map((card, idx) => <ApiCard isPublic={isPublic} key={idx} card={card} />)) : <EmptyData
            icon={<ZapIcon className="w-10 h-10" />}
            info='Your list of apis is empty, start by adding a new client'
        />
      }
    </div>
  );
};

export default ApiCards;