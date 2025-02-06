import BottomToolBar from "@/components/BottomToolBar";
import STabs from "@/components/STabs";
import PlusIcon from "@assets/icons/plusIcon.svg?react";
import { GeneralContext } from "@contexts/GeneralContext.jsx";
import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiCards from "./ApiCards";
import PublicApis from "./PUBLICApisDumyData.json";

export default function MyApis() {
  const { myAPIs } = useContext(GeneralContext);

  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [selectedTab, setSelectedTab] = useState("My APIs");
  const getSelectedtab = (value) => {
    setSelectedTab(value);
  };

   const filterAPIs = (apis, searchText) => {

    const searchLower = searchText.toLowerCase();

    return apis.filter((api) => {
      const { API = {} } = api;
      const name = API.name?.toLowerCase() || "";
      const customName = API.customName?.toLowerCase() || "";

      const nameWords = name.split(/\s+/);
      const customNameWords = customName.split(/\s+/);

      const startsWithSearch = (words) =>
        words.some((word) => word.startsWith(searchLower));

      if (name.startsWith(searchLower) || customName.startsWith(searchLower)) {
        return true;
      }

      if (startsWithSearch(nameWords) || startsWithSearch(customNameWords)) {
        return true;
      }
      return name.includes(searchLower) || customName.includes(searchLower);
    });
  };

  const filteredMyAPIs = useMemo(() => {
    return searchText === "" ? myAPIs : filterAPIs(myAPIs, searchText);
  }, [searchText, myAPIs]);

  const filteredPublicAPIs = useMemo(() => {
    return searchText === "" ? PublicApis : filterAPIs(PublicApis, searchText);
  }, [searchText, PublicApis]);

  const handleSearchChange = (value) => {
    setSearchText(value);
  };

  return (
    <div className="w-full min-h-screen flex flex-col p-10 bg-specc-neutral1">
      {/* <SBreadcrumbs /> */}
      <div className="w-full flex items-center justify-between mt-10">
        <STabs
          getSelectedTab={getSelectedtab}
          childWithSibling="flex"
          tabListSibling={
            <div className="flex flex-col gap-2">
              <span className="text-[28px] font-medium leading-larger">
                {selectedTab}
              </span>
              <span className="w-full text-base font-normal text-grey-17 font-['Inter'] tracking-wide">
                Here you can see all the APIs you've integrated into your
                projects. Feel free to upload any new API you'd like to use.
              </span>
            </div>
          }
          tabStyles={{
            tabContent: "!p-0 !w-full flex flex-col gap-6",
            tabChild: "justify-between items-center flex-row-reverse",
            tabListStyle:
              "flex w-[200px] !bg-specc-neutral2 px-2 py-0 h-11 text-specc-neutral3 rounded-3xl items-center",
            activeTab:
              "!bg-TW4 border border-specc-neutral3 text-specc-neutral4 !rounded-3xl",
          }}
          tabs={[
            {
              name: "MyAPIs",
              children: <ApiCards filteredAPIs={filteredMyAPIs} />,
            },
            {
              name: "Public library",
              children: <ApiCards isPublic filteredAPIs={filteredPublicAPIs} />,
            },
          ]}
        />
      </div>
      <BottomToolBar
        extended={true}
        placeholder="Search"
        onSearchChange={handleSearchChange}
        searchResults={[...filteredMyAPIs, ...filteredPublicAPIs].map(
          (api) => api.API.name
        )}
        className="w-64 items-center bg-specc-neutral2 border border-specc-TW4 rounded-full"
        inputClassName="w-full !bg-specc-neutral3 justify-center items-center border-0 !rounded-3xl "
        buttons={[
          {
            label: "New API",
            icon: PlusIcon,
            onClick: () => navigate("/my-apis/add-api"),
            btnClassName: "gap-2 border-0",
            textClassName: "text-md text-specc-neutral4",
            variant: "outline",
          },
        ]}
      />
    </div>
  );
}
