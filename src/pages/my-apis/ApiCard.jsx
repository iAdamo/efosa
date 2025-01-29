import Button from "@/components/Button";
import EditIcon from "@assets/icons/Edit.svg?react";
import JwtIcon from "@assets/icons/auth-types/JwtIcon.svg?react";
import CopyIcon from "@assets/icons/copy-icon-2.svg?react";
import TrashIcon from "@assets/icons/vector.svg?react";
import { deleteMyApi } from "@axios/apiCalls.js";
import { errorToast, successToast } from "@components/toasts/toasts.jsx";
import { GeneralContext } from "@contexts/GeneralContext.jsx";
import DeleteAuthModal from "@pages/my-apis/partial/DeleteAuthModal.jsx";
import { AuthTypeCard } from "@pages/my-auths/partial/auth-type/AuthTypeCard.jsx";
import { authTypes } from "@pages/my-auths/partial/auth-type/auth-types.jsx";
import moment from "moment";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AvatarCard from "../clients/partial/AvatarCard";

const ApiCard = ({ card, isPublic = false }) => {
  const { myAPIs, setMyAPIs } = useContext(GeneralContext);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { API = {}, updated_at = "" } = card || {};
  const {
    name = "",
    customName = "",
    id = "",
    authenticationType = "",
    description = "Short description about the API, its functions etc etc etc etc this can be a longer description depending on the type of API, if longer than 3 lines, hide under a read more",
    logo_url = "",
  } = API || {};
  const formattedTime = moment(updated_at).format("DD-MM-YYYY");
  const type = authTypes.find((type) => type.value === authenticationType);
  const [isAdded, setIsAdded] = useState(myAPIs.some((api) => api.id === id));

  const navigate = useNavigate();

  const handleDelete = async () => {
    await deleteMyApi(card?.id)
      .then(() => {
        setMyAPIs(myAPIs.filter((api) => api.id !== card.id));
        successToast(`${name} deleted from MyAPIs`);
        setOpenDeleteModal(false);
      })
      .catch(() => {
        errorToast("Delete API failed");
      });
  };

  const handleAddToMyApis = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!myAPIs.some((api) => api.id === card.id)) {
      setMyAPIs([card, ...myAPIs]);
      successToast(`${name} Api saved`);
      setIsAdded(!isAdded);
    }
  };

  const handleDeleteEvent = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenDeleteModal(true);
  };

  const handleEditEvent = (e) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`${card.id}/edit`);
  };

  return (
    API && (
      <div
        className={`p-2 m-2 rounded-lg cursor-pointer w-[23%] max-w-72 ${isAdded ? "border border-grey-1 !cursor-not-allowed" : "border border-grey-1 hover:bg-grey-0 hover:backdrop-blur"}`}
      >
        <Link to={!isPublic && `/my-apis/${card.id}`} className="flex flex-col">
          <div className="flex justify-between flex-col">
            <div className="flex flex-col gap-2">
              <div
                className={`flex gap-3 w-full ${isPublic ? "items-center" : ""}`}
              >
                <AvatarCard
                  name={name}
                  customName={customName}
                  image={logo_url}
                  classN="!rounded h-8 min-h-8 min-w-8 w-8"
                />
                <div className="flex flex-col justify-bettween w-full">
                  <div className="flex gap-2 flex-row">
                    <span className="max-w-full text-custom-ghostWhite font-normal text-lg">
                      {name ?? ""}
                    </span>
                    <span className="text-grey-11 text-sm font-normal">
                      {!isPublic && (
                        <>
                          <AuthTypeCard
                            className="!text-white"
                            type={
                              authenticationType
                                ? type
                                : {
                                    key: "Empty",
                                    value: null,
                                    icon: (isActive) => (
                                      <JwtIcon isActive={isActive} />
                                    ),
                                  }
                            }
                          />
                        </>
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-grey-11 text-sm font-normal">
                      {!isPublic ? customName : ""}
                    </span>
                  </div>
                </div>
                {!isPublic && (
                  <div className="ml-auto">
                    <div className="flex gap-3 justify-end">
                      <Button
                        onClick={handleEditEvent}
                        className="flex gap-1.5 group"
                      >
                        <EditIcon className="text-grey-16 group-hover:text-grey-18" />
                      </Button>
                      <Button onClick={null} className="flex gap-1.5 group">
                        <CopyIcon className="text-grey-16 group-hover:text-grey-18" />
                      </Button>
                      <Button
                        onClick={handleDeleteEvent}
                        className="flex gap-1.5 group"
                      >
                        <TrashIcon className="text-grey-16 group-hover:text-grey-18" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              {isPublic && (
                <div>
                  <div className="flex flex-col items-start gap-1 overflow-hidden">
                    <div className="flex h-12 max-h-16 items-center">
                      <span
                        className={`${isAdded ? "text-grey-16" : "text-grey-11"} text-sm font-normal`}
                      >
                        {isPublic && description}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {isPublic ? (
                <div className="">
                  <Button
                    className={`py-2 px-6 bg-grey-15 border border-grey-2 rounded-3xl ${isAdded ? "border-0 text-white/2 cursor-not-allowed" : "hover:bg-grey-14 hover:border-grey-18"}`}
                    onClick={handleAddToMyApis}
                  >
                    {isAdded ? "Added" : "Add"}
                  </Button>
                </div>
              ) : (
                <div className="">
                  <Button className="p-2 bg-grey-15 rounded-lg">RestFul</Button>
                </div>
              )}
            </div>
          </div>
        </Link>
        {openDeleteModal && (
          <DeleteAuthModal
            open={openDeleteModal}
            setOpen={setOpenDeleteModal}
            handler={handleDelete}
            apiInfo={card}
          />
        )}
      </div>
    )
  );
};

export default ApiCard;
