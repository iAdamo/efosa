import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { merge } from 'lodash';


const ToggleButtonGroupCustom = ({
  name,
  alignment,
  handleChange,
  options = [],
  groupStyles = {},
  buttonStyles = {},
  ...restProps
}) => {
  const defaultGroupStyles = {
    padding: '2px',
    gap: '4px',
    background: '#161616',
    width: 'max-content',
    borderRadius: '4px',
    boxShadow: '0px 4px 20px 3px #14161914',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  };

  const defaultButtonStyles = {
    color: "#A8A9ABCC",
    padding: "10px",
    borderRadius: "2px !important",
    fontSize: "12px",
    fontWeight: 400,
    border: "1px solid transparent !important",
    alignItems: "center",
    display: "flex",
    lineHeight: "12px",
    height: "100%",
    textTransform: "none",
    fontFamily: "Inter",
    "&.Mui-selected": {
      boxShadow: "0px 4px 4px 0px #14161914",
      background: "transparent",
      border: "1px solid #848484 !important",
      color: "#F8F9FA",
    },
  };

  const handleInternalChange = (event, newAlignment) => {
    if (handleChange) {
      handleChange(event, newAlignment, name);
    }
  };

  const mergeGroupStyles = merge({}, defaultGroupStyles, groupStyles);
  const mergeButtonStyles = merge({}, defaultButtonStyles, buttonStyles);

  return (
    <ToggleButtonGroup
      name={name}
      color="primary"
      value={alignment}
      exclusive
      onChange={handleInternalChange}
      aria-label={name}
      sx={mergeGroupStyles}
      {...restProps}
    >
      {options.map((option) => (
        <ToggleButton
          key={option.value}
          value={option.value}
          sx={mergeButtonStyles} // Combine default and custom styles for the buttons
        >
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default ToggleButtonGroupCustom;

