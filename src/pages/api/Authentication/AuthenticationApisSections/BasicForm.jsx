import { postGenericCRUDWithID } from "@/axios/apiCalls";
import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import { CustomSelect } from "@/components/CustomSelect";

function BasicForm({
  value,
  setValue,
  options,
  MuiInputBaseStyles,
  handleAuthClick,
  authData,
}) {
  return (
    <div className="flex flex-col gap-6 w-72 h-full bg-transparent">
      <div className="gap-4">
        <h3 className="text-zinc-400 pb-4 text-lg font-normal font-['Inter'] leading-[14px]">
          AUTHENTICATION
        </h3>
        <h1 className="text-[22px] py-2 mb-0">Add your Basic Auth</h1>
      </div>
      {/* TODO: UI design implemented as per new figma */}
      <CustomSelect
        options={options}
        value={value}
        onChange={setValue}
        addable
        withAutoComplete={false}
        placeholder="Choose from saved Basic"
        inputStyles={{
          background: "transparent",
          border: "1px solid #161616",
          borderRadius: "16px",
        }}
        labelStyles={"text-base font-medium leading-11 text-grey-17 mb-2"}
        muiInputBaseStyles={MuiInputBaseStyles}
      />

      <div className="flex flex-col gap-6">
        <CustomInput
          label={"USERNAME"}
          variant={"primary"}
          placeholder={"Enter username"}
          defaultValue={authData?.basic?.username}
          inputClassName="bg-transparent border border-specc-neutral2 rounded-xl h-10"
          onBlur={async (e) => {
            await postGenericCRUDWithID(
              "Authentication_Basic",
              authData?.basic?.id,
              {
                username: e.target.value,
              }
            );
          }}
        />

        <CustomInput
          label={"PASSWORD"}
          variant={"primary"}
          placeholder={"Enter password"}
          type={"password"}
          inputClassName="bg-transparent border border-specc-neutral2 rounded-xl h-10"
          onBlur={async (e) => {
            await postGenericCRUDWithID(
              "Authentication_Basic",
              authData?.basic?.id,
              {
                password: e.target.value,
              }
            );
          }}
        />
      </div>

      <div className="flex flex-row h-10 gap-3 justify-between">
        <Button
          onClick={handleAuthClick}
          className="w-1/2 h-full bg-specc-neutral2 text-specc-neutral3 py-3 px-6 rounded-full font-bold"
        >
          Add Auth
        </Button>

        <Button className="w-1/2 h-full bg-[#0C0C0D] border border-[#1D1E1F] py-3 px-6 rounded-full font-bold">
          Save this Auth
        </Button>
      </div>
    </div>
  );
}

export default BasicForm;
