import cross from "@assets/icons/cross.svg";
import SButton from "@components/SButton";
import SForm from "@components/SForm";
import { useForm } from "react-hook-form";
import { deleteGenericCRUDWithID } from "@axios/apiCalls";
import { useEffect } from "react";

export default function DeleteModal({
  headingText,
  contentText,
  deleteAction = () => {},
  closeSpeccModal,
  ...props
}) {
  const { handleSubmit } = useForm({
    mode: "onClick",
  });
  return (
    <SForm onSubmit={handleSubmit(() => deleteAction())}>
      <div className="new-specc-modal-container">
        <div className="new-specc-modal-header-container">
          <div class="text-white text-sm font-medium font-['Inter'] leading-none tracking-tight">
            {headingText}
          </div>
          <img
            onClick={() => closeSpeccModal()}
            onKeyDown={() => closeSpeccModal()}
            src={cross}
            alt="cancel"
            className="icon-grey-5"
          />
        </div>
        <div className="new-specc-modal-content-container">
          <div class="text-white text-base leading-4 font-normal font-['Inter']  tracking-tight pb-[20px] whitespace-pre-line">
            {contentText}
          </div>

          <div className="new-specc-modal-button-container">
            <SButton
              sType="button"
              onClick={() => {
                //deleteAction();
              }}
              className="w-[110px] h-[30px] px-[15px] py-2 bg-gradient-to-tr from-rose-400 to-fuchsia-600 rounded-[50px] shadow justify-center items-center gap-0.5 inline-flex"
            >
              <span className="grow shrink basis-0 text-center text-white text-xs font-semibold font-['Inter'] leading-[14px] tracking-tight">
                Delete
              </span>
            </SButton>
            <SButton
              sType="button"
              onClick={() => {
                props.closeSpeccModal();
              }}
              className={`w-[110px] h-[30px] px-[15px] py-2 bg-neutral-700 rounded-[50px] shadow justify-center items-center gap-0.5 inline-flex ${
                props.loading === true ? "cursor-not-allowed" : "cursor-pointer"
              }`}
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
