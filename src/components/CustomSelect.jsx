import { Add, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { ListItem, ListItemText } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";

export const CustomSelect = ({
  options,
  value,
  onChange,
  addable,
  noOptionsText,
  placeholder,
  withAutoComplete = true,
  inputStyles = "",
  label,
  labelStyles,
  muiInputBaseStyles,
  textFieldStyles,
  muiOutlinedInput,
  optionsTypography,
  itemSelectedBgcolor,
  itemsWrapper,
  listboxStyles,
  listItemStyles,
  ...props
}) => {
  const [openSelect, setOpenSelect] = useState(false);
  return (
    <>
      {label &&
        <p className={labelStyles}>
          {label}
        </p>}
      <Autocomplete
        {...props}
        options={options}
        value={value}
        sx={{
          width: "100%",
        }}
        onOpen={() => {
          setOpenSelect(true);
        }}
        onClose={() => {
          setOpenSelect(false);
        }}
        open={openSelect}
        getOptionLabel={(item) => item?.label}
        getOptionKey={(item) => item?.id}
        onChange={(event, newValue) => {
          onChange(newValue);
        }}
        clearIcon={null}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            sx={{
              "& .MuiOutlinedInput-root": {
                ...muiOutlinedInput,
              },
              "& .MuiInputBase-input": {
                ...muiInputBaseStyles,
              },
              "& .MuiInputBase-input::placeholder": {
                color: "white !important",
                opacity: 1
              },
              ...textFieldStyles
            }}
            onKeyDown={(e) => {
              !withAutoComplete && e.preventDefault();
            }}
            onMouseDown={(e) => {
              if (openSelect) setOpenSelect(false)
            }}
            slotProps={{
              input: {
                ...params.InputProps,
                sx: !withAutoComplete
                  ? {
                    caretColor: "transparent",
                    cursor: "pointer",
                    background: "#1E2125",
                    paddingRight: '9px !important',
                    border: '1px solid #C1BFC433',
                    color: 'white',
                    "fieldset": {
                      border: "none"
                    },
                    ".MuiSvgIcon-root": {
                      color: "#A8A9AB",
                    },
                    ...inputStyles

                  }
                  : {
                    background: "#1E2125",
                    paddingRight: '9px !important',
                    border: '1px solid #C1BFC433',
                    color: 'white',
                    "fieldset": {
                      border: "none"
                    },
                    ".MuiSvgIcon-root": {
                      color: "#A8A9AB",
                    },
                    ...inputStyles
                  },
                endAdornment: (
                  <React.Fragment>
                    {!openSelect ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
                  </React.Fragment>
                ),
              },
            }}
          />
        )}
        noOptionsText={noOptionsText}
        renderOption={(props, item) => (
          <ListItem
            {...props}
            secondaryAction={addable ? <Add sx={{ opacity: 0 }} /> : null}
            sx={{
              borderRadius: "10px",
              margin: 0,
              ...(item.id === value?.id ? { background: `${itemSelectedBgcolor ? itemSelectedBgcolor : "#343A40"} !important` } : { background: "transparent !important" }),
              "& .MuiTypography-root": {
                ...optionsTypography,
                padding: '0 !important',
              },
              "&:hover": {
                background: "#343A40 !important",
                color: "#F8F9FA",
                ".MuiListItemSecondaryAction-root svg": {
                  opacity: "1",
                },
              },
              ...listItemStyles,
            }}
            onClick={(e) => {
              props?.onClick?.(e);
            }}
          >
            <ListItemText
              primary={item.label}
              sx={{ paddingRight: addable ? "24px" : 0 }}
            />
          </ListItem>
        )}
        slotProps={{
          paper: {
            sx: {
              // padding:`${options?.length > 0 ? '16px' : 0}`,
              mt: "13px",
              borderRadius: "10px",
              overflow: "hidden",
              color: "white",
              background: "#1E2125",
              border: '1px solid #424A52',
              opacity: 1,
              ...itemsWrapper,
              "> div": {
                padding: 0,
              },
            },
          },
          popper: {
            sx: { zIndex: 14000 }
          },
          listbox: {
            sx: {
              padding: "16px",
              background:
                "linear-gradient(24.38deg, #343A40 0.87%, rgba(52, 58, 64, 0) 120.34%)",
              ...listboxStyles
            },
          },
        }}
      />
    </>
  );
};