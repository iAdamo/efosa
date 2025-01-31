import Button from "@/components/Button";
import EditIcon from "@assets/icons/Edit.svg?react";
import CopyIcon from "@assets/icons/copy-icon-2.svg?react";
import TrashIcon from "@assets/icons/vector.svg?react";
import { deleteMyApi } from "@axios/apiCalls.js";
import { errorToast, successToast } from "@components/toasts/toasts.jsx";
import { GeneralContext } from "@contexts/GeneralContext.jsx";
import DeleteAuthModal from "@pages/my-apis/partial/DeleteAuthModal.jsx";
import { AuthTypeCard } from "@pages/my-auths/partial/auth-type/AuthTypeCard.jsx";
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
    type= "",
    authenticationType = "",
    description = "Short description about the API, its functions etc etc etc etc this can be a longer description depending on the type of API, if longer than 3 lines, hide under a read more",
    logo_url = "",
  } = API || {};
  const formattedTime = moment(updated_at).format("DD-MM-YYYY");
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
      successToast("Api added to your library");
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
        className={`p-2 m-2 rounded-lg cursor-pointer w-72 ${isAdded ? "bg-specc-TW4 border border-specc-TW8 !cursor-not-allowed" : "border border-specc-TW8 hover:bg-specc-TW4 hover:border-specc-TW8"}`}
      >
        <Link
          to={!isPublic && `/my-apis/${card.id}`}
          className="flex flex-row"
        >
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
                    {customName ?? ""}
                  </span>
                  {/** Authentication Type Icon */}
                  {!isPublic && (
                    <span className="text-grey-11 text-sm font-normal">
                      <AuthTypeCard
                        className="!text-white"
                        authenticationType={authenticationType}
                      />
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-grey-11 text-sm font-normal">
                    {!isPublic ? name : ""}
                  </span>
                </div>
              </div>
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
                  className={`py-2 px-6 bg-specc-cardbtn border border-specc-cardbtnborder rounded-3xl ${isAdded ? "border-0 text-white/2 cursor-not-allowed" : "hover:bg-specc-TW8 hover:border-specc-neutral4"}`}
                  onClick={handleAddToMyApis}
                >
                  {isAdded ? "Added" : "Add"}
                </Button>
              </div>
            ) : (
              <div className="mt-2">
                <Button className="p-2 bg-specc-neutral2 text-white rounded-[4px]">
                  {type || "Rest API"}
                </Button>
              </div>
            )}
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
                <Button onClick={() => {}} className="flex gap-1.5 group">
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
