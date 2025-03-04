import { postGenericCRUDWithID } from "@/axios/apiCalls";
import Button from "@/components/Button";
import CustomInput from '@/components/CustomInput';
import { CustomSelect } from '@/components/CustomSelect';

function JWTForm({ value, setValue, options, MuiInputBaseStyles, handleAuthClick, authData }) {
  return (
    <div className="flex flex-col gap-4 w-96 bg-transparent">
      <div className="flex flex-col gap-2">
        <span className="text-sp-neutral-3 text-sm font-normal font-['Inter'] leading-[18px]">
          AUTHENTICATION
        </span>
        <span className="text-[#f6f6f6] text-sp-l font-medium font-['Inter'] leading-snug  ">
          Add your JWT token
        </span>
      </div>
      <div className="flex flex-col gap-4 w-96 h-9 bg-transparent">
        {/* TODO: UI design implemented as per new figma */}
        <CustomSelect
          options={options}
          value={value}
          onChange={setValue}
          addable
          withAutoComplete={false}
          placeholder="Choose from saved JWT token"
          inputStyles={{
            background: "transparent",
            border: "1px solid #161616",
            borderRadius: "10px",
          }}
          labelStyles={"text-sp-s font-normal font-inter leading-tight"}
          muiInputBaseStyles={MuiInputBaseStyles}
        />

        <div className="flex flex-col gap-6">
          <CustomInput
            label={"JWT token"}
            variant={"primary"}
            placeholder={"Add JWT token"}
            labelClassName="text-[#d9d9d9] text-xs font-normal font-['Inter'] capitalize leading-[11px]"
            inputClassName="border border-sp-neutral-2 rounded-lg h-9"
            onBlur={async (e) => {
              await postGenericCRUDWithID(
                "Authentication_JWT",
                authData?.jwt?.id,
                {
                  secret: e.target.value,
                }
              );
            }}
          />
        </div>

        <div className="flex flex-row w-72 h-10 gap-3 justify-between">
          <Button
            variant="addAuth"
            onClick={handleAuthClick}
            className="w-1/2 h-8 px-4 py-3 bg-sp-neutral-2 rounded-full justify-center items-center gap-1 inline-flex"
          >
            <span className="text-center text-[#848484] text-sm font-semibold font-['Inter'] leading-[18px]">
              Add Auth
            </span>
          </Button>

          <Button className="w-1/2 h-8 px-4 py-3 rounded-full border border-sp-neutral-3 justify-center items-center gap-1 inline-flex">
            <span className="text-center text-[#d9d9d9] text-sm font-semibold font-['Inter'] leading-[18px]">
              Save this Auth
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}


export default JWTForm