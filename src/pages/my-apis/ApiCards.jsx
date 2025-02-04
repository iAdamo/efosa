import ZapIcon from "@assets/icons/dashboard/sidebar/zap.svg?react";
import EmptyData from "@components/EmptyData.jsx";
import ApiCard from "./ApiCard";

const ApiCards = ({ filteredAPIs, isPublic = false }) => {
  return (
    <div className="w-full">
      {filteredAPIs.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {filteredAPIs.map((card, idx) => (
            <ApiCard isPublic={isPublic} key={idx} card={card} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <EmptyData
            icon={<ZapIcon className="w-10 h-10" />}
            info="Your list of APIs is empty, start by adding a new API"
          />
        </div>
      )}
    </div>
  );
};

export default ApiCards;
