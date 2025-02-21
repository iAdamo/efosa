import { postGenericCRUDWithID } from "@/axios/apiCalls";
import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import CustomLoader from "@/components/CustomLoader";
import ToggleButtonGroupCustom from "@/components/CustomToggleButtonGroup";
import useOutsideClickHandler from "@/hooks/useOutsideHandler";
import {
  Add,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Remove,
} from "@mui/icons-material";
import { Checkbox } from "@mui/material";
import { useRef, useState } from "react";
import { ValidationErrorBox } from "../ValidationStatus";
import AddAnotherField from "./AddAnotherField";

function OAuthForm({
  handleAuthClick,
  authData,
  setAuthData,
  handleBasicAuthCheck,
  isLoading,
  validationIssues,
  authSuccess,
}) {
  const [alignment, setAlignment] = useState({
    url: "post",
    clientId: "",
    clientSecret: "",
  });
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditingUserName, setIsEditingUsername] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [selectedValue, setSelectedValue] = useState({ label: "", value: "" });
  const [isEditSave, setIsEditSave] = useState(false);
  const [auths, setAuths] = useState([
    { name: "Stripe OAuth", type: "Stripe OAuth" },
    { name: "Shopify OAuth", type: "Shopify OAuth" },
    { name: "Square", type: "Square" },
    { name: "PayPal", type: "PayPal" },
  ]);
  const [newClientIDFieldName, setNewClientIDFieldName] = useState(
    authData?.oauth?.clientIDFieldName
  );
  const [inputClientIDFieldValue, setInputClientIDFieldValue] = useState(
    authData?.oauth?.clientID || ""
  );
  const [inputClientSecretFieldValue, setInputClientSecretFieldValue] =
    useState("");
  const [newClientSecretFieldName, setNewClientSecretFieldName] = useState(
    authData?.oauth?.clientSecretFieldName
  );

  const blockRef = useRef(null);
  useOutsideClickHandler(blockRef, () => {
    setShowSearch((prev) => (prev ? false : prev));
  });

  const handleChange = async (event, newAlignment, name, fieldId, index) => {
    const updatedAlignment = newAlignment ?? alignment?.[name];

    if (name === "url") {
      setAlignment((prev) => ({ ...prev, [name]: updatedAlignment }));
      try {
        await postGenericCRUDWithID(
          "Authentication_OAuth",
          authData?.oauth?.id,
          {
            postOrGet: updatedAlignment?.toUpperCase(),
          }
        );

        setAuthData((prev) => ({
          ...prev,
          oauth: {
            ...prev.oauth,
            postOrGet: updatedAlignment?.toUpperCase(),
          },
        }));
      } catch (error) {
        console.error(error);
      }
    }

    if (name === "clientId") {
      setAlignment((prev) => ({ ...prev, [name]: updatedAlignment }));
      try {
        await postGenericCRUDWithID(
          "Authentication_OAuth",
          authData?.oauth?.id,
          {
            clientIDPlacement: updatedAlignment?.toUpperCase(),
          }
        );

        setAuthData((prev) => ({
          ...prev,
          oauth: {
            ...prev.oauth,
            clientIDPlacement: updatedAlignment?.toUpperCase(),
          },
        }));
      } catch (error) {
        console.error(error);
      }
    }

    if (name === "clientSecret") {
      setAlignment((prev) => ({ ...prev, [name]: updatedAlignment }));
      await postGenericCRUDWithID("Authentication_OAuth", authData?.oauth?.id, {
        secretPlacement: updatedAlignment?.toUpperCase(),
      });

      setAuthData((prev) => ({
        ...prev,
        oauth: {
          ...prev.oauth,
          secretPlacement: updatedAlignment?.toUpperCase(),
        },
      }));
    }

    if (name === `customField-${fieldId}`) {
      setAlignment((prev) => ({ ...prev, [name]: updatedAlignment }));
      await postGenericCRUDWithID(
        "Authentication_OAuth_Custom",
        authData?.oauth?.customRows?.[index].id,
        {
          bodyOrHeader: updatedAlignment?.toUpperCase(),
        }
      );

      setAuthData((prev) => {
        const updatedCustomRows = [...prev.oauth.customRows]; // Create a shallow copy of the customRows array
        updatedCustomRows[index] = {
          ...updatedCustomRows[index],
          bodyOrHeader: updatedAlignment?.toUpperCase(),
        }; // Modify the specific custom row

        return {
          ...prev,
          oauth: {
            ...prev.oauth,
            customRows: updatedCustomRows, // Replace the customRows with the updated one
          },
        };
      });
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAuths = auths.filter((auth) =>
    auth.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleSetValueofSelect(auth) {
    setSelectedValue({ label: auth.name, value: auth.value });
    setShowSearch(false);
  }

  const customButtonStyles = {
    color: "#DEE2E6",
    height: "32px",
    "&.Mui-selected": {
      border: "1px solid #424A524D !important",
      background:
        "linear-gradient(24.77deg, #343A40 26.75%, rgba(52, 58, 64, 0) 126.94%)",
      backdropFilter: "blur(8px)",
    },
  };

  const handleAuthContinue = () => {
    setIsEditSave(true);
  };

  const saveAuth = async () => {
    try {
      await postGenericCRUDWithID("Authentication_OAuth", authData?.oauth?.id, {
        clientID: inputClientIDFieldValue,
        clientSecret: inputClientSecretFieldValue,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {isEditSave ? (
        <div className="flex flex-col gap-14">
          <div className="flex flex-col gap-4">
            <span className="text-specc-neutral3 text-[14px] font-['Inter']">
              SAVE AUTHENTICATION
            </span>
            <span className="text-[22px]">
              What do you want to name your Auth
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <CustomInput
              variant={"primary"}
              placeholder={"Type your Auth name"}
            />
            <Button
              onClick={saveAuth}
              className="px-8 py-3 w-1/3 bg-specc-neutral2 text-specc-neutral3 hover:bg-white hover:text-specc-neutral1 rounded-full font-bold"
            >
              Continue
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-8">
            <span className="text-specc-neutral3 text-[14px] font-['Inter']">
              AUTHENTICATION
            </span>
            <span className="text-[22px] ">Add your API Oauth</span>
          </div>
          <div className="w-96">
            <div className="relative" ref={blockRef}>
              {/* TODO: UI design implemented as per new figma */}
              <CustomInput
                variant={"primary"}
                placeholder={"Choose from saved OAuth"}
                inputClassName={`${selectedValue?.label === "" ? "" : "!bg-grey-13 border-transparent"} text-[16px] font-normal leading-11 cursor-pointer caret-transparent`}
                suffix={
                  selectedValue?.label === "" ? (
                    <span>
                      {!showSearch ? (
                        <KeyboardArrowUp className="text-grey-13" />
                      ) : (
                        <KeyboardArrowDown className="text-grey-13" />
                      )}
                    </span>
                  ) : (
                    <Remove
                      className="cursor-pointer"
                      onClick={() => setSelectedValue({ label: "", value: "" })}
                    />
                  )
                }
                value={selectedValue.label}
                onClick={(e) => {
                  setShowSearch((prev) => !prev);
                }}
                readonly
              />

              {showSearch && (
                <div className="z-50 rounded-lg border border-grey-12 absolute w-full mt-2 flex flex-col gap-2.5 p-4 bg-inner-select-gradient shadow-inner-select backdrop-blur-3xl">
                  <ToggleButtonGroupCustom
                    alignment={alignment}
                    handleChange={handleChange}
                    options={[
                      { value: "my-auths", label: "MyAuths" },
                      { value: "client-auths", label: "Client Auths" },
                    ]}
                    buttonStyles={customButtonStyles}
                  />

                  <CustomInput
                    variant="searchBox"
                    className="w-full"
                    inputClassName="w-full"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearch}
                  />

                  <div className="flex flex-col gap-1">
                    {filteredAuths.map((auth, index) => (
                      <span
                        key={index}
                        className="flex justify-between items-center h-9 text-[16px] font-normal leading-11 px-2 py-3 text-grey-20 rounded-md hover:bg-hover-grey-1 hover:text-custom-ghostWhite cursor-pointer group"
                        onClick={() => handleSetValueofSelect(auth)}
                      >
                        {auth.name}
                        <Add className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-6 mb-6">
              <div className="flex gap-2 items-center text-lg font-medium leading-26">
                <Checkbox
                  inputProps={{ "aria-label": "controlled" }}
                  defaultChecked
                  sx={{
                    color: "#E9C2F0",
                    borderRadius: "4px",
                    "&.Mui-checked": {
                      color: "#E9C2F0",
                    },
                  }}
                />
                Baseencode
              </div>
              <CustomInput
                label={"URL"}
                variant={"primary"}
                placeholder={"Add url"}
                endLabelClassName="underline"
                defaultValue={authData?.oauth?.tokenURL}
                suffix={
                  <ToggleButtonGroupCustom
                    name="url"
                    alignment={
                      authData?.oauth?.postOrGet?.toLowerCase() ||
                      alignment?.["url"]
                    }
                    handleChange={handleChange}
                    options={[
                      { value: "get", label: "GET" },
                      { value: "post", label: "POST" },
                    ]}
                    buttonStyles={{ height: "32px" }}
                  />
                }
                onBlur={async (e) => {
                  await postGenericCRUDWithID(
                    "Authentication_OAuth",
                    authData?.oauth?.id,
                    {
                      tokenURL: e.target.value,
                    }
                  );
                }}
              />

              {/* Client ID */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-grey-17 font-medium text-base">
                    {isEditingUserName
                      ? "EDIT LABEL"
                      : authData.oauth.clientIDFieldName || "Client ID"}
                  </span>
                  {isEditingUserName ? (
                    <div className="flex gap-[7px]">
                      <Button
                        onClick={async (e) => {
                          const newUsernameFieldName = postGenericCRUDWithID(
                            "Authentication_OAuth",
                            authData.oauth.id,
                            {
                              clientIDFieldName: newClientIDFieldName,
                            }
                          );
                          setAuthData((prev) => ({
                            ...prev,
                            oauth: {
                              ...prev.oauth,
                              clientIDFieldName: newClientIDFieldName,
                            },
                          }));

                          setIsEditingUsername(false);
                          setNewClientIDFieldName("");
                        }}
                        className="p-0"
                      >
                        <span className="text-grey-17 hover:text-custom-ghostWhite underline underline-offset-4 leading-[14px]">
                          Save
                        </span>
                      </Button>
                      <Button
                        className="p-0 text-grey-17 hover:text-custom-ghostWhite"
                        onClick={() => setIsEditingUsername(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        setIsEditingUsername(true);
                        setNewClientIDFieldName(
                          authData.oauth.clientIDFieldName
                        );
                      }}
                      className="p-0 text-grey-17 hover:text-custom-ghostWhite underline underline-offset-4 leading-[14px]"
                    >
                      Edit label
                    </Button>
                  )}
                </div>
                {isEditingUserName ? (
                  <CustomInput
                    variant={"primary"}
                    placeholder={"Client Label"}
                    endLabelClassName="underline"
                    defaultValue={authData.oauth.clientIDFieldName}
                    value={newClientIDFieldName}
                    onChange={(e) => {
                      setNewClientIDFieldName(e.target.value);
                    }}
                    suffix={
                      <ToggleButtonGroupCustom
                        name={"clientId"}
                        alignment={
                          authData?.oauth?.clientIDPlacement?.toLowerCase() ||
                          alignment?.["clientId"]
                        }
                        options={[
                          { value: "body", label: "Body" },
                          { value: "header", label: "Header" },
                        ]}
                        buttonStyles={{ height: "32px" }}
                      />
                    }
                  />
                ) : (
                  <CustomInput
                    variant={"primary"}
                    placeholder={"Client ID"}
                    value={inputClientIDFieldValue}
                    onChange={(e) => setInputClientIDFieldValue(e.target.value)}
                    endLabelClassName="underline"
                    defaultValue={authData?.oauth?.clientID}
                    suffix={
                      <ToggleButtonGroupCustom
                        name={"clientId"}
                        alignment={
                          authData?.oauth?.clientIDPlacement?.toLowerCase() ||
                          alignment?.["clientId"]
                        }
                        handleChange={handleChange}
                        options={[
                          { value: "body", label: "Body" },
                          { value: "header", label: "Header" },
                        ]}
                        buttonStyles={{ height: "32px" }}
                      />
                    }
                    onBlur={async (e) => {
                      await postGenericCRUDWithID(
                        "Authentication_OAuth",
                        authData?.oauth?.id,
                        {
                          clientID: e.target.value,
                        }
                      );
                    }}
                  />
                )}
              </div>

              {/* Client Secret */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-grey-17 font-medium text-base">
                    {isEditingPassword
                      ? "EDIT LABEL"
                      : authData.oauth.clientSecretFieldName || "Client Secret"}
                  </span>
                  {isEditingPassword ? (
                    <div className="flex gap-[7px]">
                      <Button
                        onClick={async (e) => {
                          const newUsernameFieldName = postGenericCRUDWithID(
                            "Authentication_OAuth",
                            authData.oauth.id,
                            {
                              clientSecretFieldName: newClientSecretFieldName,
                            }
                          );
                          setAuthData((prev) => ({
                            ...prev,
                            oauth: {
                              ...prev.oauth,
                              clientSecretFieldName: newClientSecretFieldName,
                            },
                          }));

                          setIsEditingPassword(false);
                          setNewClientSecretFieldName("");
                        }}
                        className="p-0"
                      >
                        <span className="text-grey-17 hover:text-custom-ghostWhite underline underline-offset-4 leading-[14px]">
                          Save
                        </span>
                      </Button>
                      <Button
                        className="p-0 text-grey-17 hover:text-custom-ghostWhite"
                        onClick={() => setIsEditingPassword(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        setIsEditingPassword(true);
                        setNewClientSecretFieldName(
                          authData?.oauth.clientSecretFieldName
                        );
                      }}
                      className="p-0 text-grey-17 hover:text-custom-ghostWhite underline underline-offset-4 leading-[14px]"
                    >
                      Edit label
                    </Button>
                  )}
                </div>
                {isEditingPassword ? (
                  <CustomInput
                    variant={"primary"}
                    placeholder={"Client Label"}
                    endLabelClassName="underline"
                    defaultValue={authData.oauth.clientSecretFieldName}
                    onChange={(e) => {
                      setNewClientSecretFieldName(e.target.value);
                    }}
                    value={newClientSecretFieldName}
                    suffix={
                      <ToggleButtonGroupCustom
                        name={"clientSecret"}
                        alignment={
                          authData?.oauth?.clientIDPlacement?.toLowerCase() ||
                          alignment?.["clientSecret"]
                        }
                        options={[
                          { value: "body", label: "Body" },
                          { value: "header", label: "Header" },
                        ]}
                        buttonStyles={{ height: "32px" }}
                      />
                    }
                  />
                ) : (
                  <CustomInput
                    variant={"primary"}
                    placeholder={"Client Secret"}
                    endLabelClassName="underline"
                    value={inputClientSecretFieldValue}
                    onChange={(e) =>
                      setInputClientSecretFieldValue(e.target.value)
                    }
                    suffix={
                      <ToggleButtonGroupCustom
                        name={"clientSecret"}
                        alignment={
                          authData?.oauth?.secretPlacement?.toLowerCase() ||
                          alignment?.["clientSecret"]
                        }
                        handleChange={handleChange}
                        options={[
                          { id: 1, value: "body", label: "Body" },
                          { id: 2, value: "header", label: "Header" },
                        ]}
                        buttonStyles={{ height: "32px" }}
                      />
                    }
                    onBlur={async (e) => {
                      await postGenericCRUDWithID(
                        "Authentication_OAuth",
                        authData?.oauth?.id,
                        {
                          clientSecret: e.target.value,
                        }
                      );
                    }}
                  />
                )}
              </div>

              {/* Custom row */}
              <AddAnotherField
                authData={authData}
                setAuthData={setAuthData}
                handleToggleChange={handleChange}
                handleBasicAuthCheck={handleBasicAuthCheck}
              />
            </div>
            {validationIssues &&
              Object.keys(validationIssues?.errors).length > 0 && (
                <div>
                  <ValidationErrorBox errors={validationIssues?.errors} />
                  <Button
                    onClick={handleAuthClick}
                    variant={"addAuth"}
                    className="w-[104px] mt-4 rounded-full items-center justify-center hover:bg-white hover:text-specc-neutral1"
                  >
                    Retry
                  </Button>
                </div>
              )}
            {!validationIssues && (
              <div className="flex gap-3">
                {isLoading ? (
                  <CustomLoader
                    iconClassName=""
                    labelClassName=""
                    label="Authenticating..."
                  />
                ) : (
                  <div className="flex flex-row w-72 h-10 gap-3 justify-between">
                    <Button
                      onClick={handleAuthClick}
                      className="w-1/2 h-full bg-specc-neutral2 text-specc-neutral3 hover:bg-white hover:text-specc-neutral1 py-3 px-6 rounded-full font-bold"
                    >
                      {authSuccess ? "Continue" : "Authenticate"}
                    </Button>

                    <Button
                      isDisabled={authSuccess ? false : true}
                      onClick={handleAuthContinue}
                      className="w-1/2 h-full bg-[#0C0C0D] border border-[#1D1E1F] py-3 px-6 rounded-full font-bold"
                    >
                      Save this Auth
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default OAuthForm;
