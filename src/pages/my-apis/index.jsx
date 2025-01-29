import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
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
      return (
        API.name?.toLowerCase().includes(searchLower) ||
        API.customName?.toLowerCase().includes(searchLower)
      );
    });
  };

  const filteredMyAPIs = useMemo(() => {
    return searchText === "" ? myAPIs : filterAPIs(myAPIs, searchText);
  }, [searchText, myAPIs]);

  const filteredPublicAPIs = useMemo(() => {
    return searchText === "" ? PublicApis : filterAPIs(PublicApis, searchText);
  }, [searchText, PublicApis]);

  return (
    <div className="w-full h-screen flex flex-col p-10 bg-specc-bg">
      {/* <SBreadcrumbs /> */}
      <div className="w-full flex items-center mt-10">
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
            tabChild: "justify-between items-center",
            tabListStyle:
              "flex w-[200px] bg-grey-15 px-2 py-0 h-11 text-grey-17 rounded-3xl items-center",
            activeTab: "!bg-grey-15 border !rounded-3xl",
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
      <div className="flex justify-center items-center mt-auto">
        <div className="bg-grey-15 w-64 border border-grey-3 flex flex-row items-center px-1 rounded-3xl">
          <CustomInput
            variant="searchBox"
            className="w-1/2"
            inputClassName="w-full !bg-grey-15 !rounded-3xl border-0"
            placeholder="Search"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            className="gap-2 !bg-grey-15"
            variant="addAuth"
            onClick={() => navigate(`/my-apis/add-api`)}
          >
            <PlusIcon />
            <span className="text-md">New API</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
