import { postGenericCRUDWithID } from "@/axios/apiCalls";
import Button from "@/components/Button";
import SForm from "@/components/SForm";
import SInput from "@/components/SInput";
import { successToast } from "@/components/toasts/toasts";
import { GeneralContext } from "@/contexts/GeneralContext";
import PenIcon from "@assets/icons/pen-icon.svg?react";
import SButton from "@components/SButton";
import { useContext, useEffect, useRef, useState } from "react";
import ChangePassword from "./change-password";
import { alphabets } from "./profile-menu-items";

export default function PersonalDetails({ ...props }) {
  const { firstName, lastName, userID } = useContext(GeneralContext);
  const [file, setFile] = useState(null);
  const [alphabetId, setAlphabetId] = useState(0);
  const inputFile = useRef(null);

  const [editName, setEditName] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstName: firstName,
    lastName: lastName,
  });

  useEffect(() => {
    setAlphabetId(
      alphabets.find((item) => {
        return item.name === firstName[0];
      }).id
    );
  }, [firstName, alphabets]);

  const saveprofile = async (e) => {
    await postGenericCRUDWithID("users", userID, userDetails).then(
      (response) => {
        successToast("Name is updated");
      }
    );
  };

  const handleFileChange = (event) => {
    const file = URL.createObjectURL(event.target.files[0]);

    if (file) {
      setFile(file);
      // Handle the file upload here
    }
  };

  const handleEditName = () => {
    setEditName(!editName);
  };

  const handleCancel = () => {
    setUserDetails({ firstName: firstName });
    setEditName(!editName);
  };

  return (
    <div className="flex flex-col gap-4">
      <SForm
        onSubmit={(e) => {
          saveprofile(e);
        }}
      >
        <input
          type="file"
          ref={inputFile}
          style={{ display: "none" }}
          onChange={handleFileChange}
          disabled
        />
        <div className=" rounded-[5px] mx-auto details-input-container !w-[36rem] ">
          <div className="flex flex-col gap-4 mb-6">
            <div class="text-white text-[22px] font-medium font-sans leading-none tracking-tight">
              My Profile
            </div>
            <div className="text-[14px] text-[#A8A9AB]">
              Manage your profile details and keep your account secure.
            </div>
          </div>

          <div
            className="relative bg-cover bg-no-repeat rounded-r-xl"
            style={{
              backgroundImage: "url('/src/assets/images/profile-bg.png')",
            }}
          >
            <div className="flex flex-row p-8">
              {editName ? (
                <div className="gap-4 flex flex-col w-full">
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-zinc-400 text-[14px] font-normal font-['Inter']">
                      Full Name
                    </label>
                    <SInput
                      name="Name"
                      type="text"
                      required
                      wrapperClassName="!bg-transparent border border-specc-neutral4 !rounded-lg"
                      placeholder="John Doe"
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          firstName: e.target.value,
                        })
                      }
                      value={userDetails.firstName}
                    />
                  </div>

                  <div className="flex ml-auto justify-between items-center">
                    <div className="flex  gap-5">
                      <SButton
                        // loading={loading}
                        className={"min-w-[110px] !bg-transparent !h-10"}
                        onClick={handleCancel}
                      >
                        <span className="!text-specc-neutral3 !text-[14px] hover:!text-specc-neutral4">
                          Cancel
                        </span>
                      </SButton>
                      <SButton
                        type="submit"
                        className={
                          "min-w-[110px] !bg-specc-neutral2 hover:!bg-white group w-40 !h-10"
                        }
                        onClick={handleEditName}
                        // loading={loading}
                      >
                        <span className="!text-specc-neutral3 !text-[14px] group-hover:!text-specc-neutral1">
                          Change name
                        </span>
                      </SButton>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col min-w-1/5 max-w-2/5 gap-2 justify-center">
                    <span className="text-specc-neutral3 text-[14px]">
                      Your name
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] text-specc-neutral4">
                        {userDetails.firstName}
                      </span>
                      <Button
                        onClick={handleEditName}
                        className="flex ml-2 gap-1.5 group"
                      >
                        <PenIcon className="text-grey-16 group-hover:text-grey-18" />
                      </Button>
                    </div>
                  </div>
                  <div className="border-r-[1px] border-grey-2 mx-4" />
                  {/* Vertical line */}
                  <div className="flex flex-col w-3/5 gap-2 justify-center">
                    <span className="text-black/60 text-[12px]">
                      Email
                    </span>
                    <span className="text-[14px] text-specc-neutral3">
                      Johndoe@specc.com
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          {/**<div className="p-5 pb-0 flex flex-col">
          <div className="flex gap-5 mb-4">
            <div class="text-white text-xs font-normal font-['Inter'] leading-[11px] tracking-tight">
              Profile avatar
            </div>
            <div>
              <SMenuButton
                label={<MoreHorizontal alt="more" />}
                className="flex flex-col gap-[8px]"
              >
                <SMenuItem
                  onAction={() => inputFile.current.click()}
                  className="cursor-pointer"
                >
                  Upload image
                </SMenuItem>

                <SMenuItem className="cursor-pointer">Delete image</SMenuItem>
              </SMenuButton>
            </div>
          </div>
          <div
            className={`h-[60px] w-[60px] rounded-full flex justify-center items-center ${
              alphabetId < 5
                ? "bg-secondary-mint-green"
                : alphabetId < 10
                  ? "bg-main-purple-1"
                  : alphabetId < 15
                    ? "bg-main-peach-1"
                    : alphabetId < 20
                      ? "bg-secondary-blue-light"
                      : "bg-main-pink-1"
            }`}
          >
            {file === null ? (
              <div class="text-white text-[18px] font-semibold font-['Inter'] leading-[14px] tracking-tight">
                {firstName[0]}
              </div>
            ) : (
              <img src={file} alt="user" />
            )}
          </div>
        </div>*/}
        </div>
      </SForm>
      <ChangePassword />
    </div>
  );
}
