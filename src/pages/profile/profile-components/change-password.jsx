import SForm from "@/components/SForm";
import SInput from "@/components/SInput";
import validatePassword from "@/utils/validatePassword";
import CheckCircle from "@assets/icons/checkCircle.svg?react";
import Elipse from "@assets/icons/elipse.svg?react";
import EyeCross from "@assets/icons/eye-cross.svg?react";
import Eye from "@assets/icons/eye.svg?react";
import SButton from "@components/SButton";
import { useState } from "react";

export default function ChangePassword({ backCallback, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordDetails, setPasswordDetails] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordValidations, setPasswordValidations] = useState({
    atLeastOneLetter: false,
    numberOrSpecialChar: false,
  });
  const [isFocused, setIsFocused] = useState(false);

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPasswordDetails({ ...passwordDetails, newPassword: value });
    setPasswordValidations(validatePassword(value));
  };

  return (
    <SForm onSubmit={() => {}}>
      <div className="rounded-lg bg-gradient-to-t from-[#060606] to-[#1C1C1C] details-input-container !w-[477px]">
        <div className="flex">
          <div className="p-5 pb-0 flex w-full">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px]">
                Old password
              </label>
              <SInput
                name="firstName"
                type={showPassword ? "text" : "password"}
                required
                placeholder=""
                wrapperClassName="!bg-transparent border border-specc-TW4 !rounded-lg focus-within:border-2 focus-within:border-specc-neutral4"
                secureTextEntry={true}
                value={passwordDetails.oldPassword}
                onChange={(e) =>
                  setPasswordDetails({
                    ...passwordDetails,
                    oldPassword: e.target.value,
                  })
                }
                icon={
                  showPassword ? (
                    <EyeCross
                      onClick={() => setShowPassword(!showPassword)}
                      alt="viewPass"
                      className="s-icon-grey-5"
                    />
                  ) : (
                    <Eye
                      onClick={() => setShowPassword(!showPassword)}
                      alt="viewPass"
                      className="s-icon-grey-5"
                    />
                  )
                }
              />
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="p-5 pb-0 flex w-full">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px]">
                New password
              </label>
              <SInput
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                required
                value={passwordDetails.newPassword}
                wrapperClassName="!bg-transparent border border-specc-TW4 !rounded-lg focus-within:border-2 focus-within:border-specc-neutral4"
                onChange={handlePasswordChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder=""
                icon={
                  showNewPassword ? (
                    <EyeCross
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      alt="viewPass"
                      className="s-icon-grey-5"
                    />
                  ) : (
                    <Eye
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      alt="viewPass"
                      className="s-icon-grey-5"
                    />
                  )
                }
              />
              {isFocused && (
                <div className="text-[14px] text-white gap-2 flex flex-col mt-2">
                  <div className="font-semibold">Your password must contain at least</div>
                  <div className="flex items-center gap-2">
                    {passwordValidations.atLeastOneLetter ? (
                      <CheckCircle className="text-[#E6719C]" />
                    ) : (
                      <Elipse className="text-transparent" />
                    )}
                    one letter
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordValidations.numberOrSpecialChar ? (
                      <CheckCircle className="text-[#E6719C]" />
                    ) : (
                      <Elipse className="text-transparent" />
                    )}
                    1 number or special character (example: # ? ! &)
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="p-5 pb-0 flex w-full">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-zinc-400 text-xs font-normal font-['Inter'] leading-[14px]">
                Confirm password
              </label>
              <SInput
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={passwordDetails.confirmPassword}
                wrapperClassName="!bg-transparent border border-specc-TW4 !rounded-lg focus-within:border-2 focus-within:border-specc-neutral4"
                onChange={(e) =>
                  setPasswordDetails({
                    ...passwordDetails,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder=""
                icon={
                  showConfirmPassword ? (
                    <EyeCross
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      alt="viewPass"
                      className="s-icon-grey-5"
                    />
                  ) : (
                    <Eye
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      alt="viewPass"
                      className="s-icon-grey-5"
                    />
                  )
                }
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between p-3">
          <div className="flex ml-auto gap-5">
            <SButton
              className={"min-w-[110px] !bg-transparent !h-10"}
              onClick={() => {
                setPasswordDetails({
                  oldPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
              }}
            >
              <span className="!text-specc-neutral3 !text-[14px] hover:!text-specc-neutral4">
                Cancel
              </span>
            </SButton>
            <SButton
              className={
                "min-w-[110px] !bg-specc-neutral2 hover:!bg-white group w-40 !h-10"
              }
              type="submit"
            >
              <span className="!text-specc-neutral3 !text-[14px] group-hover:!text-specc-neutral1">
                Set new password
              </span>
            </SButton>
          </div>
        </div>
      </div>
    </SForm>
  );
}
