import { postGenericCRUDWithID } from "@/axios/apiCalls";
import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import { CustomSelect } from "@/components/CustomSelect";

function APIKeyForm({
  authData,
  value,
  setValue,
  options,
  MuiInputBaseStyles,
  handleAuthClick,
}) {
  return (
    <div className="flex flex-col gap-6 w-96 bg-transparent">
      {/* TODO: UI design implemented as per new figma */}
      <CustomSelect
        options={options}
        value={value}
        onChange={setValue}
        addable
        withAutoComplete={false}
        placeholder="Choose from saved API key"
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
          label={"API KEY NAME"}
          variant={"primary"}
          placeholder={"Enter API key name"}
          inputClassName="bg-transparent border border-specc-neutral2 rounded-xl h-10"
          onBlur={async (e) => {
            await postGenericCRUDWithID(
              "Authentication_API_Key",
              authData?.apikey?.id,
              {
                keyName: e.target.value,
              }
            );
          }}
          defaultValue={authData?.apikey?.keyName}
        />
        <CustomInput
          label={"API KEY VALUE"}
          variant={"primary"}
          placeholder={"Enter API key name"}
          inputClassName="bg-transparent border border-specc-neutral2 rounded-xl h-10"
          onBlur={async (e) => {
            await postGenericCRUDWithID(
              "Authentication_API_Key",
              authData?.apikey?.id,
              {
                keyValue: e.target.value,
              }
            );
          }}
        />
      </div>

      <div className="flex flex-row w-72 h-10 gap-3 justify-between">
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

export default APIKeyForm;
