import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { profileMenuItems } from "./profile-components/profile-menu-items";

export default function Profile(props) {
  const [selectedMenuItem, setSelectedMenuItem] = useState(profileMenuItems[0]);
  return (
    <div className="flex ml-40 mt-20 gap-5 h-max max-h-full">
      {/**<div className="p-5 flex gap-5 h-max max-h-full">
        <div className="p-5 rounded-[5px] bg-[#080808] h-fit left-menu-container flex flex-col gap-[8px]">
          <div className="mb-[2px]">
            <span class="text-white text-xs font-bolder font-['Inter'] leading-[11px] tracking-tight ">
              Account
            </span>
          </div>

          {profileMenuItems.map((item, index) => (
            <div
              key={uuidv4()}
              onClick={() => setSelectedMenuItem(item)}
              onKeyDown={() => setSelectedMenuItem(item)}
              className={`p-[10px] flex items-center gap-[10px] rounded-[5px] hover:bg-grey-1 group cursor-pointer ${
                selectedMenuItem.name === item.name ? "bg-grey-1" : ""
              }`}
            >
              {item.icon}
              <div
                class={`text-grey-5 text-xs font-normal font-['Inter'] leading-[14px] group-hover:text-white
              ${
                selectedMenuItem.name === item.name
                  ? "text-white"
                  : "text-grey-5"
              }
                `}
              >
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>*/}
      {selectedMenuItem.content}
    </div>
  );
}
