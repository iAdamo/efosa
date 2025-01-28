import { useContext, useMemo, useState } from "react";

import FilterIcon from "@/Icons/FilterIcon";
import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import SBreadcrumbs from "@/components/SBreadcrumbs";
import AuthKeyIcon from "@assets/icons/dashboard/sidebar/authKeyIcon.svg?react";
import PlusIcon from "@assets/icons/plusIcon.svg?react";
import EmptyData from "@components/EmptyData.jsx";
import SSortableHeaders from "@components/SSortableHeaders.jsx";
import { GeneralContext } from "@contexts/GeneralContext.jsx";
import AuthFilterModal from "@pages/my-auths/partial/AuthFilter.jsx";
import AuthCard from "./partial/AuthCard";
import CreateAuthModal from "./partial/CreateAuthModal.jsx";

export default function MyAuths() {
  const { auths = [] } = useContext(GeneralContext);
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [openFilterList, setOpenFilterList] = useState(false);

  const [headers, setHeaders] = useState([
    { label: "Date Created", field: "created_at", isAscending: true },
    { label: "Number of Speccs", field: "speccs", isAscending: true },
  ]);
  const [sortField, setSortField] = useState(headers[0].field);
  const [isAscending, setIsAscending] = useState(headers[0].isAscending);

  const [selected, setSelected] = useState({
    BASIC: false,
    JWT: false,
    APIKEY: false,
    OAUTH: false,
  });

  const toggleSelection = (type) => {
    setSelected((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const clearAll = () => {
    setSelected({
      BASIC: false,
      JWT: false,
      APIKEY: false,
      OAUTH: false,
    });
  };

  console.log(auths);

  const filteredAuths = useMemo(() => {
    const clonedAuths = structuredClone(auths) || [];
    let list = clonedAuths;

    if (searchText !== "") {
      list = list.filter((auth) =>
        auth.name?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (Object.values(selected).some((value) => value)) {
      list = list.filter((auth) => {
        const { api_authentication = {} } = auth;
        return selected[api_authentication.authType];
      });
    }

    list?.sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];

      if (fieldA < fieldB) return isAscending ? -1 : 1;
      if (fieldA > fieldB) return isAscending ? 1 : -1;
      return 0;
    });

    return list;
  }, [searchText, auths, sortField, selected, isAscending]);

  const handleSortToggle = (index) => {
    setHeaders((prevHeaders) =>
      prevHeaders.map((header, i) =>
        i === index ? { ...header, isAscending: !header.isAscending } : header
      )
    );

    const updatedHeader = headers[index];
    setSortField(updatedHeader.field);
    setIsAscending(!updatedHeader.isAscending);
  };

  const options = headers.map((header, index) => ({
    label: header.label,
    isAscending: header.isAscending,
    onSort: () => handleSortToggle(index),
  }));

  return (
    <div className="w-full h-screen flex flex-col gap-10 pl-8 p-10">
      <SBreadcrumbs />
      <div className="w-full flex">
        <div className="w-1/2 flex flex-col gap-2">
          <span className="text-[28px] font-medium leading-larger">Auths</span>
          <span className="w-full max-w-[680px] text-base font-normal text-grey-17 font-['Inter'] tracking-wide">
            You can effortlessly manage your saved Authentications here and
            store authentications to quickly add to APIs.
          </span>
        </div>

        <div className="w-1/2 flex justify-end items-center gap-4">
          <CustomInput
            variant="searchBox"
            className="max-w-[365px] w-full"
            inputClassName="w-full"
            placeholder="Search"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div>
            <Button
              className="gap-2 px-4"
              variant="primary"
              onClick={() => setOpen(true)}
            >
              <PlusIcon />
              <span className="text-lg font-bold">New Auth</span>
            </Button>
          </div>
        </div>
        <CreateAuthModal open={open} setOpen={setOpen} />
      </div>

      <div className="flex flex-col gap-[14px] h-full">
        <div className="relative flex gap-7 items-center">
          <div
            className="flex gap-2 items-center cursor-pointer"
            onClick={() => setOpenFilterList(true)}
          >
            <span className="text-xs font-medium text-custom-ghostWhite">
              Filter
            </span>
            <FilterIcon />
          </div>
          <SSortableHeaders options={options} />

          {openFilterList && (
            <AuthFilterModal
              open={openFilterList}
              setOpen={setOpenFilterList}
              selected={selected}
              clearAll={clearAll}
              toggleSelection={toggleSelection}
            />
          )}
        </div>

        <div className="flex flex-col gap-[14px] h-full overflow-auto">
          {filteredAuths.length > 0 ? (
            filteredAuths.map((auth) => <AuthCard key={auth?.id} auth={auth} />)
          ) : (
            <EmptyData
              icon={<AuthKeyIcon className="w-10 h-10" />}
              info="Your list of auths is empty, start by adding a new auth"
            />
          )}
        </div>
      </div>
    </div>
  );
}
