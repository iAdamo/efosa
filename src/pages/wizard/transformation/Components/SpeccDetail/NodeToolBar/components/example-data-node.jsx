import SFormSelect from "@components/SFormSelect";
import { useState } from "react";

export default function ExampleDataNode() {
  const [selected, setSelected] = useState("Item1");
  const itemList = [
    "Item1",
    "Item2",
    "Item3",
    "Item4",
    "Item5",
    "Item6",
    "Item7",
    "Item8",
    "Item9",
    "Item10",
    "Item11",
    "Item12",
    "Item13",
    "Item14",
    "Item15",
    "Item16",
    "Item17",
    "Item18",
    "Item19",
    "Item20",
  ];

  const getSelectedValue = (val) => {
    setSelected(val);
  };

  return (
    <div className="pb-[20px]">
      <div className="flex justify-between items-center">
        <div class="text-zinc-400 text-xs font-normal font-['Inter'] leading-3">
          Data selected
        </div>
        <SFormSelect
          options={itemList}
          getValue={getSelectedValue}
          className="w-[150px] select-list"
          buttonClassName="sortBtn flex !gap-[30px] w-[100%]"
        />
      </div>
      <div className="flex flex-col bg-[#2B2B2B] p-[15px] rounded-[5px] gap-[10px] mt-[10px]">
        <div class="text-white text-xs font-normal font-['Inter'] leading-3">
          Item 21
        </div>
        <div className="flex flex-col pl-[15px] gap-[10px]">
          <div class="text-rose-400 text-xs font-normal font-['Inter'] leading-3">
            Parameter 1 Exampledata
          </div>
          <div class="text-blue-500 text-xs font-normal font-['Inter'] leading-3">
            Parameter 2 Exampledata
          </div>
          <div class="text-purple-500 text-xs font-normal font-['Inter'] leading-3">
            Parameter 3 Exampledata
          </div>
          <div class="text-teal-500 text-xs font-normal font-['Inter'] leading-3">
            Parameter 4 Exampledata
          </div>
        </div>
      </div>
    </div>
  );
}
