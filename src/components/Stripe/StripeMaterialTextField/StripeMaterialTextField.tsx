import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { StripeInput } from '../../';
import { StripeElementComp } from '../../../interfaces';

interface IStripeTextFieldProps {
  stripeElement: StripeElementComp;
  InputLabelProps?: any;
  inputProps?: any;
  error?: boolean;
  helperText?: string;
  label?: string;
  onChange: (e: any) => void;
}



/**
 * This component returns the material ui component that has the stripe component injected
 * into it.
 * @param param0
 * @returns
 */
export const StripeMaterialTextField = ({
  InputLabelProps,
  stripeElement,
  inputProps,
  ...other
}: IStripeTextFieldProps) => {

  const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiFilledInput-root": {
        background: "white", 
        border: "1px solid #e9ecef",
        paddingBottom: "8px",
      }
    },
    input: {
      height: 5,
    },
    margin: {
      margin: theme.spacing(1),
    },
  }));

  const classes = useStyles();
  return (
  <div className=" cursor-pointer">
    <TextField
      className={`text-content_black w-full ${classes.root}`}
      variant="filled"
      multiline
      InputLabelProps={{shrink: true}}
      required
      fullWidth
      InputProps={{
        inputProps: {
          ...inputProps,
          component: stripeElement,
        },
        // classes: {input: classes.input},
        inputComponent: StripeInput,
        disableUnderline: true
      }}
      {...(other as any)}
    />
  </div>

)};
