import {
  deleteGenericCRUDWithID,
  postGenericCRUD,
  postGenericCRUDWithID,
} from "@/axios/apiCalls";
import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import ToggleButtonGroupCustom from "@/components/CustomToggleButtonGroup";
import DeleteIcon from "@assets/icons/new-delete.svg?react";
import PlusSquareIcon from "@assets/icons/plus-square.svg?react";
import { Checkbox } from "@mui/material";
import { useState } from "react";

function AddAnotherField({
  authData,
  setAuthData,
  handleToggleChange,
  handleBasicAuthCheck,
}) {
  const [editingRows, setEditingRows] = useState({});
  const [fieldNames, setFieldNames] = useState(() =>
    (authData?.oauth?.customRows || []).reduce((acc, row) => {
      acc[row.id] = row.fieldName;
      return acc;
    }, {})
  );
  const [editableValues, setEditableValues] = useState({});

  const addField = async () => {
    const newCustomRow = await postGenericCRUD("Authentication_OAuth_Custom", {
      authenticationOAuthID: authData?.oauth?.id,
    });
    setAuthData({
      ...authData,
      oauth: {
        ...authData.oauth,
        customRows: [...authData?.oauth?.customRows, newCustomRow?.data[0]],
      },
    });
  };

  const handleEditToggle = (rowId, isEditing) => {
    setEditingRows((prev) => ({ ...prev, [rowId]: isEditing }));
  };

  const handleFieldNameChange = (rowId, value) => {
    setFieldNames((prev) => ({ ...prev, [rowId]: value }));
  };

  const handleFieldValueChange = (id, value) => {
    setEditableValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleSave = async (rowId, index) => {
    await postGenericCRUDWithID("Authentication_OAuth_Custom", rowId, {
      fieldName: fieldNames[rowId],
    });

    setAuthData((prev) => {
      const newCustomRows = [...prev.oauth.customRows];
      newCustomRows[index] = {
        ...newCustomRows[index],
        fieldName: fieldNames[rowId],
      };
      return {
        ...prev,
        oauth: {
          ...prev.oauth,
          customRows: newCustomRows,
        },
      };
    });

    handleEditToggle(rowId, false);
  };

  return (
    <div className="flex flex-col gap-6">
      {authData?.oauth?.customRows?.map((customRow, index) => (
        <div key={customRow?.id}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-grey-17 font-medium text-base">
              {editingRows[customRow.id]
                ? "EDIT LABEL"
                : customRow?.fieldName || "NEW ROW"}
            </span>

            {editingRows[customRow.id] ? (
              <div className="flex gap-[7px]">
                <Button
                  onClick={() => handleSave(customRow.id, index)}
                  className="p-0"
                >
                  <span className="text-grey-17 hover:text-custom-ghostWhite underline underline-offset-4 leading-[14px]">
                    Save
                  </span>
                </Button>
                <Button
                  className="p-0 text-grey-17 hover:text-custom-ghostWhite"
                  onClick={() => handleEditToggle(customRow.id, false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-[13px]">
                <Button
                  onClick={() => handleEditToggle(customRow.id, true)}
                  className="p-0 text-grey-17 hover:text-custom-ghostWhite underline underline-offset-4 leading-[14px]"
                >
                  Edit label
                </Button>

                <Button
                  className="p-0"
                  onClick={async () => {
                    try {
                      await deleteGenericCRUDWithID(
                        "Authentication_OAuth_Custom",
                        customRow?.id
                      );

                      setAuthData((prevAuthData) => {
                        const updatedRows =
                          prevAuthData.oauth.customRows.filter(
                            (row) => row.id !== customRow.id
                          );
                        return {
                          ...prevAuthData,
                          oauth: {
                            ...prevAuthData.oauth,
                            customRows: updatedRows,
                          },
                        };
                      });
                    } catch (error) {
                      console.error("Error deleting custom row:", error);
                    }
                  }}
                >
                  <DeleteIcon className="icon-grey-17" />
                </Button>
              </div>
            )}
          </div>
          {editingRows[customRow.id] ? (
            <CustomInput
              variant="primary"
              placeholder="Input text..."
              onChange={(e) =>
                handleFieldNameChange(customRow.id, e.target.value)
              }
              defaultValue={fieldNames[customRow.id]}
            />
          ) : (
            <CustomInput
              key={`${customRow?.id}-custom`}
              variant="primary"
              placeholder="Input text..."
              value={editableValues[customRow.id] || customRow?.fieldValue}
              onChange={(e) =>
                handleFieldValueChange(customRow.id, e.target.value)
              }
              suffix={
                <ToggleButtonGroupCustom
                  name={`customField-${customRow.id}`}
                  alignment={
                    authData?.oauth?.customRows[
                      index
                    ]?.bodyOrHeader?.toLowerCase() ||
                    alignment?.[`customField-${customRow?.id}`]
                  }
                  handleChange={(event, newAlignment) =>
                    handleToggleChange(
                      event,
                      newAlignment,
                      `customField-${customRow?.id}`,
                      customRow?.id,
                      index
                    )
                  }
                  options={[
                    { id: 1, value: "body", label: "Body" },
                    { id: 2, value: "header", label: "Header" },
                  ]}
                  buttonStyles={{ height: "32px" }}
                />
              }
              onBlur={async (e) => {
                await postGenericCRUDWithID(
                  "Authentication_OAuth_Custom",
                  customRow?.id,
                  {
                    fieldValue: e.target.value,
                  }
                );
              }}
            />
          )}
        </div>
      ))}
      {/**
      {authData.oauth.clientIDPlacement === "HEADER" &&
        authData.oauth.secretPlacement === "HEADER" && (
          <div>
            <Checkbox
              inputProps={{ "aria-label": "controlled" }}
              onChange={handleBasicAuthCheck}
              sx={{
                color: "#E9C2F0",
                borderRadius: "4px",
                "&.Mui-checked": {
                  color: "#E9C2F0",
                },
              }}
            />
            Do you want to send as basic Authentication?
          </div>
        )}*/}
      <div>
        <Button
          onClick={async () => {
            await addField();
          }}
          className="flex gap-2 items-center text-sp-neutral-4 underline underline-offset-4 leading-26"
        >
          <PlusSquareIcon className="text-sp-neutral-3" />
          Add input
        </Button>
      </div>
    </div>
  );
}

export default AddAnotherField;
