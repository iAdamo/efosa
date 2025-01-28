import { StepConnector, stepConnectorClasses, styled } from "@mui/material";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: -11,
    left: 5,
    height: 10,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#454C54",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      zIndex: 10,
      backgroundColor: "#85F996",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    width: 2,
    height: 22,
    minHeight: 3,
    border: 0,
    backgroundColor: "#454C54",
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

export default ColorlibConnector;
