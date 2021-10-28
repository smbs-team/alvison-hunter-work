import { CloseIcon } from "../../../assets/icons";
import { Typography, IconButton } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { ReactElement } from "react";

interface DialogTitleProps {
  children: React.ReactNode;
  onClose: () => void;
  leftButton?: ReactElement | boolean;
}

const CustomDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, leftButton, ...other } = props;
  return (
    <MuiDialogTitle
      disableTypography
      className="m-0 px-2 h-14 relative flex items-center justify-between"
      {...other}
    >
      {leftButton}
      <div className="flex-1" />
      <Typography
        variant="h5"
        className="absolute left-1/2 transform -translate-x-1/2"
      >
        {children}
      </Typography>
      {onClose ? (
        <IconButton aria-label="close" className="text-black" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

export default CustomDialogTitle;
