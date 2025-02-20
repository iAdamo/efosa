import AvatarCard from "@pages/clients/partial/AvatarCard";

const SearchResults = ({ results, onSelect, recentSearches, searchText }) => {
  const highlightText = (text, highlight) => {
    if (!highlight) return text;

    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} className="text-specc-neutral5 font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const renderResult = (item, index) => (
    <div
      key={index}
      className="flex flex-row gap-2 items-center bg-specc-TW4 border border-specc-neutral2 px-4 py-2 mx-4 hover:bg-specc-TW4 hover:border-specc-neutral4 cursor-pointer text-specc-neutral4 rounded-md"
      onClick={() => onSelect(item)}
    >
      {item.logo ? (
        <img src={item.logo} alt="logo" className="h-8 w-8 inline-block mr-2" />
      ) : (
        <AvatarCard
          name={item.name}
          customName={item.customName}
          image={item.logo}
          classN="!rounded h-8 min-h-8 min-w-8 w-8"
        />
      )}
      <div className="text-specc-neutral3">
        {highlightText(item.customName || item.name, searchText)}
      </div>
    </div>
  );

  if (searchText) {
    return results.length > 0 ? (
      results.map(renderResult)
    ) : (
      <div className="text-specc-neutral4 text-center p-6">
        No results found
      </div>
    );
  }

  return recentSearches.length > 0 ? (
    <>
      <div className="text-specc-neutral4 font-medium text-center">
        Recent Searches
      </div>
      {recentSearches.map(renderResult)}
    </>
  ) : (
    <div className="text-specc-neutral4 text-center">No recent searches</div>
  );
};

export default SearchResults;
