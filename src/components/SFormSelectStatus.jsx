import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";

import caretOpen from "@assets/icons/caret-open.svg";
import SSpeccStatus from "./SSpeccStatus";
import { useForm } from "react-hook-form";
import tick from "@assets/icons/tick.svg";
import caretClose from "@assets/icons/caret-close.svg";

export default function SFormSelectStatus({ ...props }) {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const list = [];
    props.options.map((option) => {
      list.push(option);
    });
    setSelected(list);
  }, [props.options]);

  useEffect(() => {
    props.getValue(selected);
  }, [selected, props.getValue]);

  const { handleSubmit } = useForm();

  return (
    <div className={`top-16 listbox-container ${props.className}`}>
      <Listbox
        key={props.options[0].name}
        value={selected}
        onChange={(val) => {
          setSelected(val);
        }}
        multiple
      >
        {({ open }) => (
          <div className="relative mt-1 listbox ">
            <Listbox.Button
              className={`p-[5px] relative cursor-default rounded-lg bg-white py-2 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm ${
                props.buttonClassName
              }  ${open ? props.activeStyles : props.inActiveStyles}`}
            >
              <span className="block ">Status</span>
              <span className="pointer-events-none  inset-y-0 right-0 flex items-center">
                <img
                  src={open ? caretClose : caretOpen}
                  className="icon-grey-5 h-3 w-3"
                  alt="caret"
                  height="12px"
                  width="12px"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 pt-[15px] max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50">
                <>
                  {" "}
                  {props.options.map((person, personIdx) => (
                    <Listbox.Option
                      key={person}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 ${
                          active
                            ? "bg-amber-100 text-amber-900"
                            : "text-gray-900"
                        }`
                      }
                      value={person}
                    >
                      {({ selected }) => (
                        <div className="gap-[10px] flex">
                          <div
                            className={`w-[16px] h-[16px] border border-[#EA35FA] ${
                              selected ? "bg-fuchsia-500" : "bg-none"
                            }  rounded-sm `}
                          >
                            <img
                              src={tick}
                              className={`h-[14px] w-[14px] ${
                                selected ? "block" : "hidden"
                              }  `}
                              alt="tick"
                            />
                          </div>

                          <SSpeccStatus text={person} />
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                  <div class="mt-[16px] w-[100%] h-[0px] border border-neutral-600" />
                  <div
                    onClick={() => setSelected([])}
                    onKeyDown={() => setSelected([])}
                    class="mt-[16px] pb-[16px] text-fuchsia-500 text-xs font-medium font-['Inter'] leading-3"
                  >
                    Clear Filters
                  </div>
                  {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
                  <div class="mt-[16px] w-[100%] h-[0px]"></div>
                </>
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
    </div>
  );
}
