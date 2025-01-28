import SFormSelect from "@components/SFormSelect";
import externalLink from "@/icons/external-link.svg";
import SAccordionGroup from "@components/SAccordionGroup";
import caretOpen from "@assets/icons/caret-open.svg";
import caretClose from "@assets/icons/caret-close.svg";
import { useState } from "react";

export default function ExampleDataParameter() {
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

  const accordionItems = [
    {
      title: (
        <span className="flex gap-x-1 items-center">
          <div
            class="
                             text-white
                         text-xs font-bold font-['Inter'] leading-[11px] tracking-tight"
          >
            Parameter 1
          </div>
        </span>
      ),
      content: (
        <div className="flex flex-col gap-[10px] ml-[23px] mt-[10px]">
          <div class="text-rose-400 text-xs font-normal font-['Inter'] leading-3">
            Parameter 1 Exampledata
          </div>
          <div class="text-rose-400 text-xs font-normal font-['Inter'] leading-3">
            Parameter 1 Exampledata
          </div>
          <div class="text-rose-400 text-xs font-normal font-['Inter'] leading-3">
            Parameter 1 Exampledata
          </div>
          <div class="text-rose-400 text-xs font-normal font-['Inter'] leading-3">
            Parameter 1 Exampledata
          </div>
          <div class="text-rose-400 text-xs font-normal font-['Inter'] leading-3">
            Parameter 1 Exampledata
          </div>
        </div>
      ),
    },
    {
      title: (
        <span className="flex gap-x-1 items-center">
          <div
            class="
                             text-white
                         text-xs font-bold font-['Inter'] leading-[11px] tracking-tight"
          >
            Parameter 1
          </div>
        </span>
      ),
      content: (
        <div className="flex flex-col gap-[10px] ml-[23px] mt-[10px]">
          <div class="text-rose-400 text-xs font-normal font-['Inter'] leading-3">
            Parameter 1 Exampledata
          </div>
          <div class="text-rose-400 text-xs font-normal font-['Inter'] leading-3">
            Parameter 1 Exampledata
          </div>
          <div class="text-rose-400 text-xs font-normal font-['Inter'] leading-3">
            Parameter 1 Exampledata
          </div>
          <div class="text-rose-400 text-xs font-normal font-['Inter'] leading-3">
            Parameter 1 Exampledata
          </div>
          <div class="text-rose-400 text-xs font-normal font-['Inter'] leading-3">
            Parameter 1 Exampledata
          </div>
        </div>
      ),
    },
    {
      title: (
        <span className="flex gap-x-1 items-center">
          <div
            class="
                             text-white
                         text-xs font-bold font-['Inter'] leading-[11px] tracking-tight"
          >
            Parameter 1
          </div>
        </span>
      ),
      content: (
        <div className="flex flex-col gap-[10px] ml-[23px] mt-[10px]">
          <div class="text-rose-400 text-xs font-normal font-['Inter'] leading-3">
            Parameter 1 Exampledata
          </div>
          <div class="text-rose-400 text-xs font-normal font-['Inter'] leading-3">
            Parameter 1 Exampledata
          </div>
          <div class="text-rose-400 text-xs font-normal font-['Inter'] leading-3">
            Parameter 1 Exampledata
          </div>
          <div class="text-rose-400 text-xs font-normal font-['Inter'] leading-3">
            Parameter 1 Exampledata
          </div>
          <div class="text-rose-400 text-xs font-normal font-['Inter'] leading-3">
            Parameter 1 Exampledata
          </div>
        </div>
      ),
    },
    {
      title: (
        <span className="flex gap-x-1 items-center">
          <div
            class="
                             text-white
                         text-xs font-bold font-['Inter'] leading-[11px] tracking-tight"
          >
            Parameter 1
          </div>
        </span>
      ),
      content: (
        <div className="flex flex-col gap-[10px] ml-[23px] mt-[10px]">
          <div class="text-rose-400 text-xs font-normal font-['Inter'] leading-3">
            Parameter 1 Exampledata
          </div>
          <div class="text-rose-400 text-xs font-normal font-['Inter'] leading-3">
            Parameter 1 Exampledata
          </div>
          <div class="text-rose-400 text-xs font-normal font-['Inter'] leading-3">
            Parameter 1 Exampledata
          </div>
          <div class="text-rose-400 text-xs font-normal font-['Inter'] leading-3">
            Parameter 1 Exampledata
          </div>
          <div class="text-rose-400 text-xs font-normal font-['Inter'] leading-3">
            Parameter 1 Exampledata
          </div>
        </div>
      ),
    },
  ];

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
      <div className="flex flex-col bg-[#2B2B2B] p-[15px] rounded-[5px] gap-[10px] mt-[10px] mb-[10px]">
        <div className="flex justify-end">
          <img src={externalLink} alt="link" className="icon-grey-5" />
        </div>
        <div class="text-white text-xs font-normal font-['Inter'] leading-3">
          Item 21
        </div>

        <div className="flex flex-col pl-[15px] gap-[10px] parameter-accordion">
          <SAccordionGroup
            items={accordionItems}
            openIcon={caretOpen}
            closeIcon={caretClose}
            reverseIcon={true}
          />
        </div>
      </div>
    </div>
  );
}
