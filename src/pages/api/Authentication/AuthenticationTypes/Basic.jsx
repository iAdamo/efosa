import { postGenericCRUDWithID } from "@axios/apiCalls";
import SInput from "../../../../components/SInput";

export default function Basic(props) {
  const { APIID, auth } = props;

  return (
    <>
      <div className="w-[360px] flex-col justify-start items-start gap-[30px] inline-flex">
        <div className="self-stretch h-[83px] flex-col justify-start items-end flex">
          <div className="self-stretch h-[83px] flex-col justify-start items-start gap-[5px] flex">
            <div className="w-[345px] px-3 justify-start items-center gap-[5px] inline-flex">
              <div className="grow shrink basis-0 h-3.5 rounded-[5px] justify-start items-center gap-2.5 flex">
                <div className="justify-start items-center gap-[5px] flex">
                  <div className="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px]">
                    Username*
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch h-16 flex-col justify-start items-start gap-1 flex">
              <div className="self-stretch h-11 flex-col justify-start items-start gap-[5px] flex">
                <div className="self-stretch h-11 justify-start items-center gap-2.5 inline-flex">
                  <div className="grow shrink basis-0 self-stretch bg-neutral-700 rounded-[5px] justify-start items-center gap-2.5 flex">
                    <div className="grow shrink basis-0 flex-col justify-center items-start gap-[5px] inline-flex">
                      <div className="self-stretch justify-start items-center gap-[5px] inline-flex">
                        <div className="grow shrink basis-0 h-[11px] justify-start items-center gap-[5px] flex">
                          <SInput
                            type="text"
                            className="h-11 border-0 text-zinc-400 text-xs font-normal font-['Inter'] leading-[11px] bg-neutral-700 rounded-[5px] w-[100%]"
                            onBlur={async (e) => {
                              await postGenericCRUDWithID(
                                "Authentication_Basic",
                                auth.basic.id,
                                {
                                  username: e.target.value,
                                }
                              );
                            }}
                            defaultValue={auth.basic.username}
                            placeholder="Enter username"
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch pl-3 justify-start items-center gap-[5px] inline-flex">
                <div className="grow shrink basis-0 opacity-0 text-zinc-400 text-xs font-medium font-['Inter'] leading-none">
                  Placeholder
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch flex-col justify-start items-end flex">
          <div className="self-stretch flex-col justify-start items-start gap-[5px] flex">
            <div className="w-[345px] px-3 justify-start items-center gap-[5px] inline-flex">
              <div className="grow shrink basis-0 h-3.5 rounded-[5px] justify-start items-center gap-2.5 flex">
                <div className="justify-start items-center gap-[5px] flex">
                  <div className="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px]">
                    Password*
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch h-16 flex-col justify-start items-start gap-1 flex">
              <div className="self-stretch h-11 flex-col justify-start items-start gap-[5px] flex">
                <div className="self-stretch h-11 justify-start items-center gap-2.5 inline-flex">
                  <div className="grow shrink basis-0 self-stretch bg-neutral-700 rounded-[5px] justify-start items-center gap-2.5 flex">
                    <div className="grow shrink basis-0 flex-col justify-center items-start gap-[5px] inline-flex">
                      <div className="self-stretch justify-start items-center gap-[5px] inline-flex">
                        <div className="grow shrink basis-0 h-[11px] justify-start items-center gap-[5px] flex">
                          <SInput
                            type="password"
                            className="h-11 text-zinc-400 border-0 text-xs font-normal font-['Inter'] leading-[11px] bg-neutral-700 rounded-[5px] w-[100%]"
                            onBlur={async (e) => {
                              await postGenericCRUDWithID(
                                "Authentication_Basic",
                                auth.basic.id,
                                {
                                  password: e.target.value,
                                }
                              );
                            }}
                            placeholder="Enter password"
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch pl-3 justify-start items-center gap-[5px] inline-flex">
                <div className="grow shrink basis-0 opacity-0 text-zinc-400 text-xs font-medium font-['Inter'] leading-none">
                  Placeholder
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
