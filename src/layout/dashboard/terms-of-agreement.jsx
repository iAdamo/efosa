import Close from "@assets/icons/cross.svg?react";
import CheckClose from "@assets/icons/circle-success.svg?react";
import SButton from "@/components/SButton";
import { agreements } from "./agreements/agreement-data";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

export default function TermsOfAgreement({ closeCallback, ...props }) {
  const [currentAgreement, setCurrentAgreement] = useState(agreements[0]);
  return (
    <div className="flex flex-col">
      <div className="flex justify-between p-5">
        <div class="text-white text-lg font-medium font-sans leading-none tracking-tight ">
          Agreements
        </div>
        <div
          onClick={() => closeCallback?.()}
          onKeyDown={() => closeCallback?.()}
          className="p-[5px]"
        >
          <Close className="icon-grey-5 cursor-pointer " />
        </div>
      </div>
      <div className="border-b-[1px] border-grey-2 mb-[0px]" />
      <div className="flex">
        <div className="w-[15vw] p-5 ">
          {agreements.map((agreement) => (
            <div
              key={uuidv4()}
              onClick={() => setCurrentAgreement(agreement)}
              onKeyDown={() => setCurrentAgreement(agreement)}
              className={`p-[10px] flex gap-[5px] items-center cursor-pointer group rounded-[5px] hover:bg-grey-1 ${
                currentAgreement.name === agreement.name ? "bg-grey-1" : ""
              }`}
            >
              {agreement.isAgrees && <CheckClose />}
              <div
                class={` text-base font-normal ${
                  agreement.isAgrees
                    ? "text-status-success"
                    : "text-grey-5 group-hover:text-white"
                }  font-sans leading-none tracking-tight  `}
              >
                Terms of service
              </div>
            </div>
          ))}
        </div>
        <div className="border-l-[1px] border-grey-2 h-auto" />
        <div className="w-[50vw] p-5 ">
          <div class="text-neutral-200 text-base font-medium font-['Inter'] leading-none tracking-tight">
            {currentAgreement.name}
          </div>
          <div class="text-neutral-400 text-base leading-4 font-light font-['Inter'] tracking-tight my-[10px]">
            {currentAgreement.lastUpdated}
          </div>
          <div class="w-full pb-[50px] text-neutral-200 text-base font-light font-['Inter'] leading-4 tracking-tight max-h-[45vh] overflow-y-scroll">
            {currentAgreement.content}
          </div>
          <div className="my-10 relative">
            <SButton
              className="min-w-[110px]"
              type="submit"
              // loading={loading}
            >
              <span>I agree</span>
            </SButton>
            <div className="shadow-container" />
          </div>
        </div>
      </div>
    </div>
  );
}
