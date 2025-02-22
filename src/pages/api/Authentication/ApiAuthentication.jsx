import { postGenericCRUDWithID } from "@/axios/apiCalls";
import Button from "@/components/Button";
import Toast, { showToast } from "@/components/CustomToast";
import SBreadcrumbs from "@/components/SBreadcrumbs";
import { ProjectContext } from "@/contexts/ProjectContext";
import BackIcon from "@assets/icons/caret-right.svg?react";
import AuthKeyIcon from "@assets/icons/dashboard/sidebar/authKeyIcon.svg?react";
import EditIcon from "@assets/icons/Edit.svg?react";
import GlobalIcon from "@assets/icons/global.svg?react";
import GridIcon from "@assets/icons/grid-sphere.svg?react";
import LockIcon from "@assets/icons/lock.svg?react";
import RepeatIcon from "@assets/icons/repeatIcon.svg?react";
import JWTIcon from "@assets/icons/shield.svg?react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import APIKeyForm from "./AuthenticationApisSections/APIKeyForm";
import AuthAPISuccessRenderer from "./AuthenticationApisSections/AuthAPISuccessRenderer";
import BasicForm from "./AuthenticationApisSections/BasicForm";
import JWTForm from "./AuthenticationApisSections/JWTForm";
import OAuthForm from "./AuthenticationApisSections/OAuthForm";

function ApiAuthentication() {
  const {
    projectID,
    sourceAuthentication,
    destinationAuthentication,
    setSourceAuthentication,
    setDestinationAuthentication,
    sourceAPI,
    destinationAPI,
  } = useContext(ProjectContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [activeTabAPI1, setActiveTabAPI1] = useState("");
  const [activeTabAPI2, setActiveTabAPI2] = useState("");
  const [validationIssues, setValidationIssues] = useState({
    api1: null,
    api2: null,
  });
  const [authSuccess, setAuthSuccess] = useState(null);
  const [isEditMode, setIsEditMode] = useState({
    editApi1: true,
    editApi2: true,
  });
  const [authMethodKey, setAuthMethodKey] = useState({
    api1: false,
    api2: false,
  });
  const [isBasicChecked, setIsBasicChecked] = useState({
    api1: false,
    api2: false,
  });
  const { sourceAPICustomName, destinationAPICustomName } =
    useContext(ProjectContext);
  const [isLoading, setIsLoading] = useState({ api1: false, api2: false });
  const navigate = useNavigate();

  useEffect(() => {
    const sourceAuthType = sourceAuthentication?.authType;
    const destinationAuthType = destinationAuthentication?.authType;

    if (sourceAuthType) {
      setActiveTabAPI1(sourceAuthType);
      setAuthMethodKey((prev) => ({ ...prev, api1: true }));
    }

    if (destinationAuthType) {
      setActiveTabAPI2(destinationAuthType);
      setAuthMethodKey((prev) => ({ ...prev, api2: true }));
    }
  }, [sourceAuthentication, destinationAuthentication]);

  useEffect(() => {
    setIsBasicChecked((prev) => ({
      api1: !!sourceAuthentication?.oauth?.shouldBeSentAsBasic,
      api2: !!destinationAuthentication?.oauth?.shouldBeSentAsBasic,
    }));
  }, []);

  const apiTabs1 = [
    {
      name: "API Key",
      tabKey: "APIKEY",
      icon: (
        <AuthKeyIcon
          className={`${activeTabAPI1 === "APIKEY" ? "s-icon-pink" : ""}`}
        />
      ),
    },
    {
      name: "JWT",
      tabKey: "JWT",
      icon: (
        <JWTIcon
          className={`${activeTabAPI1 === "JWT" ? "s-icon-pink" : ""}`}
        />
      ),
    },
    {
      name: "OAuth",
      tabKey: "OAUTH",
      icon: (
        <GlobalIcon
          className={`${activeTabAPI1 === "OAUTH" ? "s-icon-pink" : ""}`}
        />
      ),
    },
    {
      name: "Basic",
      tabKey: "BASIC",
      icon: (
        <LockIcon
          className={`${activeTabAPI1 === "BASIC" ? "s-icon-pink" : ""}`}
        />
      ),
    },
  ];

  const apiTabs2 = [
    {
      name: "API Key",
      tabKey: "APIKEY",
      icon: (
        <AuthKeyIcon
          className={`${activeTabAPI2 === "APIKEY" ? "s-icon-pink" : ""}`}
        />
      ),
    },
    {
      name: "JWT",
      tabKey: "JWT",
      icon: (
        <JWTIcon
          className={`${activeTabAPI2 === "JWT" ? "s-icon-pink" : ""}`}
        />
      ),
    },
    {
      name: "OAuth",
      tabKey: "OAUTH",
      icon: (
        <GlobalIcon
          className={`${activeTabAPI2 === "OAUTH" ? "s-icon-pink" : ""}`}
        />
      ),
    },
    {
      name: "Basic",
      tabKey: "BASIC",
      icon: (
        <LockIcon
          className={`${activeTabAPI2 === "BASIC" ? "s-icon-pink" : ""}`}
        />
      ),
    },
  ];

  const handleTabClick = async (e, tabKey, apis) => {
    setAuthSuccess(null);
    setIsEditMode((prev) => ({
      ...prev,
      [apis === "api1" ? "editApi1" : "editApi2"]: false,
    }));
    const authMethod = tabKey;
    setValidationIssues((prev) => ({ ...prev, [apis]: null }));

    if (apis === "api1") {
      try {
        if (
          authMethod !== sourceAuthentication?.authType ||
          !authMethodKey?.api1
        ) {
          const sourceAuthMethod = await postGenericCRUDWithID(
            "API_Authentication",
            sourceAuthentication?.id,
            {
              authType: authMethod,
            }
          );
          setSourceAuthentication(sourceAuthMethod?.data);
        }
      } catch (error) {
        console.error(error);
      }
      setAuthMethodKey((prev) => ({ ...prev, api1: true }));
      setActiveTabAPI1(tabKey);
    } else if (apis === "api2") {
      try {
        if (
          authMethod !== destinationAuthentication?.authType ||
          !authMethodKey?.api2
        ) {
          const destinationAuthMethod = await postGenericCRUDWithID(
            "API_Authentication",
            destinationAuthentication?.id,
            {
              authType: authMethod,
            }
          );
          setDestinationAuthentication(destinationAuthMethod?.data);
        }
      } catch (error) {
        console.error(error);
      }
      setActiveTabAPI2(tabKey);
      setAuthMethodKey((prev) => ({ ...prev, api2: true }));
    }
  };

  const [value, setValue] = useState(null);
  const options = [
    { label: "Item 1", id: 1 },
    { label: "Item 2", id: 2 },
    { label: "Item 3", id: 3 },
  ];

  const MuiInputBaseStyles = {
    padding: "2px 11px !important",
  };

  const handleAuthClick = async (apiKey) => {
    const authData =
      apiKey === "api1" ? sourceAuthentication : destinationAuthentication;
    try {
      setIsLoading((prev) => ({ ...prev, [apiKey]: true }));
      setValidationIssues((prev) => ({ ...prev, [apiKey]: null }));
      const accepted = await postGenericCRUDWithID(
        "API_Authentication",
        authData?.id,
        {
          isUserAccepted: true,
          shouldBeSentAsBasic: isBasicChecked[apiKey],
        }
      );
      // setIsUserAcceptedClicked(true);
      setAuthSuccess({
        errorcode: accepted?.errorcode,
        message: accepted?.message,
      });

      apiKey === "api1"
        ? setSourceAuthentication(accepted.data)
        : setDestinationAuthentication(accepted.data);

      if (accepted?.validation_issues) {
        setIsEditMode((prev) => ({
          ...prev,
          [apiKey === "api1" ? "editApi1" : "editApi2"]: false,
        }));
        setValidationIssues((prev) => ({
          ...prev,
          [apiKey]: accepted?.validation_issues,
        }));
      } else {
        setIsEditMode((prev) => ({
          ...prev,
          [apiKey === "api1" ? "editApi1" : "editApi2"]: true,
        }));

        const showApiToast = (authType) => {
          if (
            authType === "JWT" ||
            authType === "APIKEY" ||
            authType === "BASIC"
          ) {
            showToast(`Auth added for this API`, "dark");
          } else if (authType === "OAUTH") {
            showToast(`API validated`, "success");
          }
        };
        showApiToast(
          apiKey === "api1"
            ? sourceAuthentication?.authType
            : destinationAuthentication?.authType,
          apiKey === "api1" ? "source" : "destination"
        );
      }

      setIsLoading((prev) => ({ ...prev, [apiKey]: false }));
    } catch (error) {
      console.error(error);
      setIsLoading((prev) => ({ ...prev, [apiKey]: false }));
      showToast("Authentication failed", "error");
    }
  };

  const handleBasicAuthCheck = (event, apiKey) => {
    setIsBasicChecked((prev) => ({ ...prev, [apiKey]: event.target.checked }));
  };

  const handleCloseEditMode = (apiKey) => {
    setIsEditMode((prev) => ({ ...prev, [apiKey]: false }));
    setActiveTabAPI1("");
    setActiveTabAPI2("");
  };

  const handleCloseAuthMethod = (apiKey) => {
    setIsEditMode((prev) => ({ ...prev, [apiKey]: true }));
    setActiveTabAPI1("");
    setActiveTabAPI2("");
  };

  const authButtonClass =
    "z-10 h-10 flex items-center px-4 py-3 rounded-[60px] text-[16px] leading-11 text-grey-17 font-medium ";

  return (
    <div className="h-full w-full p-6 flex flex-col gap-6 bg-transparent relative overflow-hidden">
      <GridIcon className="fixed top-0 left-0" />
      <div className="absolute inset-0 overflow-auto p-6">
        {!isEditMode?.editApi1 && authMethodKey?.api1 && activeTabAPI1 ? (
          <div className="flex flex-row mt-36 ml-48 gap-8 ">
            <div className="flex items-start">
              <Button
                variant="outline"
                onClick={() => handleCloseEditMode("editApi1")}
                className="bg-specc-neutral2 border-none rounded-full hover:bg-specc-neutral3 hover:border-specc-neutral4"
              >
                <BackIcon className="text-white hover:text-specc-neutral4 mr-2" />
                <span className="text-white font-medium">Close</span>
              </Button>
            </div>
            <div>
              {activeTabAPI1 === "APIKEY" && (
                <APIKeyForm
                  handleAuthClick={() => handleAuthClick("api1")}
                  authData={sourceAuthentication}
                  value={value}
                  setValue={setValue}
                  options={options}
                  MuiInputBaseStyles={MuiInputBaseStyles}
                  isLoading={isLoading?.api1}
                />
              )}

              {activeTabAPI1 === "JWT" && (
                <JWTForm
                  handleAuthClick={() => handleAuthClick("api1")}
                  authData={sourceAuthentication}
                  value={value}
                  setValue={setValue}
                  options={options}
                  MuiInputBaseStyles={MuiInputBaseStyles}
                  isLoading={isLoading?.api1}
                />
              )}
              {activeTabAPI1 === "BASIC" && (
                <BasicForm
                  handleAuthClick={() => handleAuthClick("api1")}
                  authData={sourceAuthentication}
                  value={value}
                  setValue={setValue}
                  options={options}
                  MuiInputBaseStyles={MuiInputBaseStyles}
                  isLoading={isLoading?.api1}
                />
              )}
              {activeTabAPI1 === "OAUTH" && (
                <OAuthForm
                  handleAuthClick={() => handleAuthClick("api1")}
                  authData={sourceAuthentication}
                  setAuthData={setSourceAuthentication}
                  handleBasicAuthCheck={(e) => handleBasicAuthCheck(e, "api1")}
                  isLoading={isLoading?.api1}
                  authSuccess={authSuccess}
                  validationIssues={validationIssues?.api1}
                />
              )}
            </div>
          </div>
        ) : !isEditMode?.editApi2 && authMethodKey?.api2 && activeTabAPI2 ? (
          <div className="flex flex-row mt-36 ml-48 gap-8 ">
            <div className="flex items-start">
              <Button
                variant="outline"
                onClick={() => handleCloseEditMode("editApi2")}
                className="bg-specc-neutral2 border-none rounded-full hover:bg-specc-neutral3 hover:border-specc-neutral4"
              >
                <BackIcon className="text-white hover:text-specc-neutral4 mr-2" />
                <span className="text-white font-medium">Close</span>
              </Button>
            </div>
            <div>
              {activeTabAPI2 === "APIKEY" && (
                <APIKeyForm
                  handleAuthClick={() => handleAuthClick("api2")}
                  authData={destinationAuthentication}
                  value={value}
                  setValue={setValue}
                  options={options}
                  MuiInputBaseStyles={MuiInputBaseStyles}
                  isLoading={isLoading?.api2}
                />
              )}
              {activeTabAPI2 === "JWT" && (
                <JWTForm
                  handleAuthClick={() => handleAuthClick("api2")}
                  authData={destinationAuthentication}
                  value={value}
                  options={options}
                  setValue={setValue}
                  MuiInputBaseStyles={MuiInputBaseStyles}
                  isLoading={isLoading?.api2}
                />
              )}
              {activeTabAPI2 === "BASIC" && (
                <BasicForm
                  handleAuthClick={() => handleAuthClick("api2")}
                  authData={destinationAuthentication}
                  value={value}
                  setValue={setValue}
                  options={options}
                  MuiInputBaseStyles={MuiInputBaseStyles}
                  isLoading={isLoading?.api2}
                />
              )}
              {activeTabAPI2 === "OAUTH" && (
                <OAuthForm
                  handleAuthClick={() => handleAuthClick("api2")}
                  authData={destinationAuthentication}
                  setAuthData={setDestinationAuthentication}
                  handleBasicAuthCheck={(e) => handleBasicAuthCheck(e, "api2")}
                  isLoading={isLoading?.api2}
                  authSuccess={authSuccess}
                  validationIssues={validationIssues?.api2}
                />
              )}
            </div>
          </div>
        ) : !isEditMode?.editApi1 && authMethodKey?.api1 ? (
          <div className="flex flex-row w-[40rem] mt-36 ml-48 gap-6 justify-center">
            <div className="flex items-start">
              <Button
                variant="outline"
                onClick={() => handleCloseAuthMethod("editApi1")}
                className="bg-specc-neutral2 border-none rounded-full hover:bg-specc-neutral3 hover:border-specc-neutral4"
              >
                <BackIcon className="text-white hover:text-specc-neutral4 mr-2" />
                <span className="text-white font-medium">Close</span>
              </Button>
            </div>
            <div className="w-4/5 flex flex-col gap-6">
              <h3 className="text-specc-neutral3">AUTHENTICATION</h3>
              <div className="flex flex-col gap-2">
                <span className="text-[18px]">
                  Choose a method of Authentication
                </span>
                <span className="text-[12px] text-specc-neutral3">
                  You need to authenticate your API before you can build from
                  response
                </span>
              </div>
              <div className="flex flex-row gap-4">
                {apiTabs1.map(({ name, icon: Icon, tabKey }) => (
                  <Button
                    key={name}
                    className={`${authButtonClass} bg-specc-cardbtn border border-specc-cardbtnborder rounded-md hover:bg-specc-neutral3 hover:border-specc-neutral4`}
                    disabled={sourceAPI === null}
                    disableClassName={`${authButtonClass} bg-transparent border border-grey-13 opacity-50 `}
                    onClick={(e) => handleTabClick(e, tabKey, "api1")}
                  >
                    <div className="flex gap-[10px] items-center">
                      <span className="hover:text-white font-medium">
                        {Icon}
                      </span>
                      <span className="text-white font-medium">{name}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : !isEditMode?.editApi2 && authMethodKey?.api2 ? (
          <div className="flex flex-row w-[40rem] mt-36 ml-48 gap-6 justify-center">
            <div className="flex items-start">
              <Button
                variant="outline"
                onClick={() => handleCloseAuthMethod("editApi2")}
                className="bg-specc-neutral2 border-none rounded-full hover:bg-specc-neutral3 hover:border-specc-neutral4"
              >
                <BackIcon className="text-white hover:text-specc-neutral4 mr-2" />
                <span className="text-white font-medium">Close</span>
              </Button>
            </div>
            <div className="w-4/5 flex flex-col gap-6">
              <h3 className="text-specc-neutral3">AUTHENTICATION</h3>
              <div className="flex flex-col gap-2">
                <span className="text-[18px]">
                  Choose a method of Authentication
                </span>
                <span className="text-[12px] text-specc-neutral3">
                  You need to authenticate your API before you can build from
                  response
                </span>
              </div>
              <div className="flex flex-row gap-4">
                {apiTabs2.map(({ name, icon: Icon, tabKey }) => (
                  <Button
                    key={name}
                    className={`${authButtonClass} bg-specc-cardbtn border border-specc-cardbtnborder rounded-md hover:bg-specc-neutral3 hover:border-specc-neutral4`}
                    disabled={sourceAPI === null}
                    disableClassName={`${authButtonClass} bg-transparent border border-grey-13 opacity-50 `}
                    onClick={(e) => handleTabClick(e, tabKey, "api1")}
                  >
                    <div className="flex gap-[10px] items-center">
                      <span className="hover:text-white font-medium">
                        {Icon}
                      </span>
                      <span className="text-white font-medium">{name}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-[26px]">
            <Toast />
            <SBreadcrumbs speccID={null} projectID={projectID} />

            <div className="flex items-center gap-36">
              <div className="flex flex-col flex-1 gap-2">
                <span className="font-medium text-[28px] leading-larger text-custom-ghostWhite">
                  Authenticate APIs
                </span>
                <span className="font-normal text-base text-grey-17">
                  With your APIs selected, authenticate them to enable secure
                  data flow and start building your integration.
                </span>
              </div>
              <div>
                <Button
                  variant={"primary"}
                  onClick={() => navigate(`/project/${projectID}/integrations`)}
                >
                  Build Specc
                </Button>
              </div>
            </div>

            {/* <div className="flex gap-4 relative"> */}
            <div className="relative w-full flex flex-row gap-4">
              <div className="flex flex-col w-full h-max">
                <div
                  id="API1"
                  className={`cursor-pointer w-full py-[26px] px-6 rounded-lg ${authMethodKey?.api1 ? " bg-project-card-gradient backdrop-blur border border-grey-12" : "bg-grey-15 border border-transparent"}`}
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex justify-between gap-4 items-center text-custom-ghostWhite text-lg leading-11 font-medium">
                      <div className="flex gap-4 items-center">
                        API 1
                        <Button className="bg-secondary-pink-light p-2 rounded text-secondary-pink-light-1 text-lg font-semibold leading-11 tracking-tight">
                          {sourceAPICustomName || "No name"}
                        </Button>
                      </div>
                      {isEditMode?.editApi1 && authMethodKey?.api1 && (
                        <Button
                          onClick={() => {
                            setAuthSuccess(null);
                            setIsEditMode((prev) => ({
                              ...prev,
                              editApi1: false,
                            }));
                          }}
                          className="flex items-center gap-1.5 text-base font-normal font-['Inter'] text-grey-16 leading-normal"
                        >
                          Edit
                          <EditIcon />
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      {isEditMode?.editApi1 && authMethodKey?.api1 && (
                        <AuthAPISuccessRenderer
                          authData={destinationAuthentication}
                          activeTab={activeTabAPI2}
                          apiTabs={apiTabs2}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-full h-max">
                <div
                  id="API2"
                  className={`cursor-pointer w-full py-[26px] px-6 rounded-lg ${authMethodKey?.api2 ? " bg-project-card-gradient backdrop-blur border border-grey-12" : "bg-grey-15 border border-transparent"}`}
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex justify-between gap-4 items-center text-custom-ghostWhite text-lg leading-11 font-medium">
                      <div
                        className={`flex gap-4 items-center ${destinationAPI === null ? "opacity-50" : ""} `}
                      >
                        API 2
                        <Button className="bg-secondary-pink-light p-2 rounded text-secondary-pink-light-1 text-lg font-semibold leading-11 tracking-tight">
                          {destinationAPICustomName || "No name"}
                        </Button>
                      </div>
                      {isEditMode?.editApi2 && authMethodKey?.api2 && (
                        <Button
                          onClick={() => {
                            setAuthSuccess(null);
                            setIsEditMode((prev) => ({
                              ...prev,
                              editApi2: false,
                            }));
                          }}
                          className="flex items-center gap-1.5 text-base font-normal font-['Inter'] text-grey-16 leading-normal"
                        >
                          Edit
                          <EditIcon />
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      {isEditMode?.editApi2 && authMethodKey?.api2 && (
                        <AuthAPISuccessRenderer
                          authData={destinationAuthentication}
                          activeTab={activeTabAPI2}
                          apiTabs={apiTabs2}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Button
                aria-describedby={id}
                className={`w-[60px] h-[60px] rounded-full flex items-center justify-center  absolute top-[calc(30px+40px)] left-1/2 -translate-y-1/2 -translate-x-1/2 bg-grey-15 border-[6px] border-custom-blackPearl`}
              >
                <div
                  className={`${open ? " bg-grey-13 rounded-full flex h-full w-full items-center justify-center" : ""} `}
                >
                  <RepeatIcon className={`icon-white`} />
                </div>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApiAuthentication;
