import { destinationTextColor, sourceTextColor } from "./color-variables";
import tick from "@assets/icons/tick.svg";
import search from "@assets/icons/search.svg";
import cross from "@assets/icons/cross.svg";

export default function UniqueIdentifierList({ ...props }) {
  return (
    <div className="select-parameter-container">
      <div className="flex justify-between items-center mb-[20px]">
        <div class="text-zinc-400 text-[14px] font-medium font-['Inter'] leading-3 ">
          Parameters
        </div>
        <img
          onKeyDown={() => {
            props.closePanel(false);
          }}
          src={cross}
          alt="tick"
          width="14px"
          height="14px"
          className="icon-grey-5"
        />
      </div>
      {/* <input className="mb-[20px]"></input> */}
      {/* input */}
      <div class="w-[219.12px] h-8 flex-col justify-start items-start inline-flex mb-[15px]">
        <div class="max-h-[35px] self-stretch grow shrink basis-0 p-2.5 bg-zinc-800 rounded-[50px] justify-start items-center gap-[5px] inline-flex">
          <div class="p-2.5 justify-center items-center gap-2.5 flex">
            <div class="w-3 h-3 relative">
              <img
                src={search}
                alt="tick"
                width="22px"
                height="22px"
                className="icon-grey-5"
              />
            </div>
          </div>
          <div class="grow shrink basis-0 h-[11px] justify-start items-center gap-[5px] flex">
            <div class="text-stone-300 text-xs font-normal font-['Inter'] leading-[11px]">
              Search{" "}
            </div>
          </div>
        </div>
      </div>
      <span className="mb-[20px]" />
      <div className="flex flex-col gap-[10px] pr-[10px] add-identifier-parameters-container">
        {props.list.map((item, index) => {
          return (
            <div
              key={item.name}
              onKeyDown={() => props.setParams(index)}
              class="flex justify-between items-start py-[10px] px-[10px] group hover:bg-[#555555] hover:rounded-[5px] cursor-pointer hover-div"
            >
              <div className="flex gap-[10px] items-center">
                {item.isSelected ? (
                  <img
                    src={tick}
                    alt="tick"
                    width="22px"
                    height="22px"
                    className={`${
                      props.isSource ? "icon-pink" : "icon-mint-green"
                    }`}
                  />
                ) : (
                  <div className="w-[22px] h-[22px]" />
                )}
                <div className="flex flex-col items-start gap-[4px]">
                  <div className="flex items-center gap-[4px]">
                    <div class="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px] tracking-tight">
                      {item.name}
                      {item.id}
                    </div>
                  </div>
                  <div
                    class={`${
                      props.isSource ? sourceTextColor : destinationTextColor
                    } text-xs font-medium font-['Inter'] leading-3`}
                  >
                    {item.description}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
