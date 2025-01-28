import cross from "@assets/icons/cross.svg";
import SButton from "@components/SButton";
import SForm from "@components/SForm";
import SInput from "@components/SInput";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";

export default function CopySpeccModal({ ...props }) {
  const [inputValue, setInputValue] = useState("");

  const { register, watch, handleSubmit } = useForm({
    mode: "onChange",
  });

  return (
    <SForm onSubmit={handleSubmit(() => props.copySpecc(inputValue))}>
      <div className="new-specc-modal-container">
        <div className="new-specc-modal-header-container">
          <div class="text-white text-sm font-medium font-['Inter'] leading-none tracking-tight">
            Copy Specc
          </div>
          <img
            onClick={() => props.closeSpeccModal()}
            onKeyDown={() => props.closeSpeccModal()}
            src={cross}
            alt="cancel"
            className="icon-grey-5"
          />
        </div>
        <div className="new-specc-modal-content-container">
          <div class="text-white text-xs font-normal font-['Inter'] leading-none tracking-tight pb-[20px]">
            Copy Voll IL Gutter 2009 Specc
          </div>
          <div class="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px]  ml-[12px]">
            Specc Name*
          </div>
          <div class="specc-input-container  py-[5px]">
            <SInput
              type="text"
              className="specc-input-container"
              placeholder="Search"
              {...register("projectName", {
                required: true,
                maxLength: 30,
                pattern: /^[a-zA-Z0-9 ]+$/i,
                onChange: (e) => {
                  setInputValue(e.target.value);
                },
              })}
              disabled={false}
              aria-invalid={"false"}
            />
          </div>
          <div class="w-[333px] text-zinc-400 text-xs font-medium font-['Inter'] leading-none ml-[12px] mt-[5px]">
            *Required
          </div>
          <div className="new-specc-modal-button-container">
            <SButton
              sType="button"
              onClick={() => {}}
              className="w-[110px] h-[30px] px-[15px] py-2 bg-gradient-to-tr from-rose-400 to-fuchsia-600 rounded-[50px] shadow justify-center items-center gap-0.5 inline-flex"
            >
              <span
                className={`grow shrink basis-0 text-center text-white text-xs font-semibold font-['Inter'] leading-[14px] tracking-tight ${
                  props.loading === true
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                Copy
              </span>
            </SButton>
            <SButton
              sType="button"
              onClick={() => {
                props.closeSpeccModal();
              }}
              className="w-[110px] h-[30px] px-[15px] py-2 bg-neutral-700 rounded-[50px] shadow justify-center items-center gap-0.5 inline-flex"
            >
              <span
                className={`grow shrink basis-0 text-center text-white text-xs font-semibold font-['Inter'] leading-[14px] tracking-tight ${
                  props.loading === true
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                Cancel
              </span>
            </SButton>
          </div>
        </div>
      </div>
    </SForm>
  );
}
