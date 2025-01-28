import { postGenericCRUDWithID } from "@/axios/apiCalls";
import Button from "@/components/Button";
import CustomInput from '@/components/CustomInput';
import { CustomSelect } from '@/components/CustomSelect';

function APIKeyForm({ authData, value, setValue, options, MuiInputBaseStyles, handleAuthClick }) {

  return (
    <>
      {/* TODO: UI design implemented as per new figma */}
      {/* <CustomSelect
        options={options}
        value={value}
        onChange={setValue}
        addable
        withAutoComplete={false}
        placeholder="Choose from saved API key"
        inputStyles={{ background: "transparent" }}
        labelStyles={'text-base font-medium leading-11 text-grey-17 mb-2'}
        muiInputBaseStyles={MuiInputBaseStyles}
      /> */}

      <div className='flex flex-col gap-6'>
        <CustomInput
          label={"API KEY NAME"}
          variant={"primary"}
          placeholder={"Enter API key name"}
          onBlur={async (e) => {
            await postGenericCRUDWithID(
              "Authentication_API_Key",
              authData?.apikey?.id,
              {
                keyName: e.target.value,
              },
            );
          }}
          defaultValue={authData?.apikey?.keyName}
        />
        <CustomInput
          label={"API KEY VALUE"}
          variant={"primary"}
          placeholder={"Enter API key name"}
          onBlur={async (e) => {
            await postGenericCRUDWithID(
              "Authentication_API_Key",
              authData?.apikey?.id,
              {
                keyValue: e.target.value,
              },
            );
          }}
        />
      </div>

      <div className='flex gap-3'>
        <Button
          onClick={handleAuthClick}
          variant={'addAuth'}
        >
          Add Authentication
        </Button >

        <Button
          className='h-8 border border-grey-13 py-[9px] px-6 rounded-containers font-bold'
        >
          Save this Auth
        </Button >
      </div>
    </>
  )
}

export default APIKeyForm
