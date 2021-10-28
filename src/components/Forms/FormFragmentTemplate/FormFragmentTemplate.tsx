import { Controller, Control } from 'react-hook-form';
import { TextField, FormControlLabel, Checkbox, createStyles, makeStyles } from '@material-ui/core';
import { IField } from '../../../interfaces';
import './FormFragmentTemplate.scss'

/** 
 * By adding these styles we need to overwrite Material UI native styling, which removes underline 
 * and adds borders around textFields to match the requirement
 * */
const useStyles = makeStyles(() =>
  createStyles({
    textField: {
      "& .MuiFilledInput-underline:before": {
        borderBottom: 0
      },
      "& .MuiInputBase-input": {
        border: "1px solid #B0B9C8",
      },
      "& .MuiFilledInput-root": {
        background: "white", 
        paddingBottom: "8px",
      }
    },
    checkbox: {
      '& .MuiIconButton-root': {
        padding: 0,
        marginLeft: "9px",
        color: "green_select",
      },
      '& .PrivateSwitchBase-root-3': {
        padding: 0,
      },
      
    },
  }),
);

/**
 * This component can be used to create a fragment for a form for react-hook-form that
 * takes an array objects matching the IField interface. It needs to be given a control
 * from the useForm hook. It should be able to be expanded later to use form fields other than
 * TextField. These fragments can be combined into larger forms. Each of these fragments goes 
 * with an array of IField objects. This component should probably later be extended to support
 * radio groups.
 * @param param0
 * @returns
 */

export const FormFragmentTemplate = ({
  fields,
  control,
}: {
  fields: IField[];
  control: Control<any>;
}) => {
  const classes = useStyles();
  return (
    <div>
      {fields.map(({ name, text, required, type, labelComp, pattern, helperText }, idx) => (
        <Controller
          key={idx}
          control={control}
          name={name as `${string}`}
          render={({ field }) => (
            <div className="flex justify-center">
              {type !== 'checkbox' ? (
                <TextField
                  {...field}
                  id={`${name}`}
                  label={text}
                  required={required}
                  className={`w-full mt-1_5`}
                  classes={{root: classes.textField}}
                  variant="filled"
                  type={type || 'text'}
                  InputLabelProps={{ shrink: true }} 
                  inputProps={pattern ? ({ pattern: pattern}) : undefined}
                  helperText={helperText}
                />
              ) : (
                <FormControlLabel
                  {...field}
                  className={`w-full mt-2_5 text-xxs`}
                  classes={{root: classes.checkbox}}
                  labelPlacement="end"
                  control={<Checkbox required={required}/>}
                  label={<div className="text-xs font-sofia pl-1">{labelComp || text}</div>}
                />
              )}
            </div>
          )}
        />
      ))}
    </div>
  );
};
