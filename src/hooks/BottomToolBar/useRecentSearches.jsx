import { useEffect, useState } from "react";

const useRecentSearches = (key = "recentSearches", maxItems = 3) => {
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const storedSearches = JSON.parse(localStorage.getItem(key)) || [];
    setRecentSearches(storedSearches);
  }, [key]);

  const addRecentSearch = (search) => {
    const updatedSearches = [
      search,
      ...recentSearches.filter((item) => item !== search),
    ].slice(0, maxItems);
    setRecentSearches(updatedSearches);
    localStorage.setItem(key, JSON.stringify(updatedSearches));
  };

  return { recentSearches, addRecentSearch };
};

export default useRecentSearches;
