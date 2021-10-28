import { useState } from 'react';
import { Store } from '../interfaces';
import { flattenStore } from '../utils';
import { useSelector } from 'react-redux';
import { useActions } from '../hooks';
import { InputAdornment, makeStyles, TextField } from '@material-ui/core';
import '../styles/promo.scss';
import { GiftIcon } from '../assets/icons';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import * as rawActions from '../store/actions';

interface PromoProps {
  subTotal: number;
}

export const Promo = ({ subTotal }: PromoProps) => {

  const { user } = useSelector((store: Store) => flattenStore(store));
  const { verifyPromo, clearPromo } = useActions(rawActions);
  const [codeVal, setTextVal] = useState('');
  const [labelVal, setLabelVal] = useState('Enter Promo Code');
  const [msg, setMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (codeVal) {
      verifyPromo(
        user?.id!,
        codeVal,
        subTotal,
        (success: boolean, msg: string) => {
          setMsg(msg);
          setSuccess(success);
        }
      );
    }
    return () => clearPromo();
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiFilledInput-root": {
        background: "white", 
        border: "1px solid #B0B9C8",
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
    <div className="">
      <div className="horiz-center">
        <div className={`w-full`}>
        <TextField
          className={`text-content_black w-full ${classes.root}`}
          error={!success && !!msg}
          label={labelVal}
          onChange={(e) => {
            const { value } = e.target;
            setTextVal(value);
            setLabelVal(' ');
          }}
          margin="dense"
          helperText={msg}
          variant="filled"
          InputLabelProps={{shrink: false, style: {
            marginLeft: '35px', 
          }}}
          InputProps={{
            disableUnderline: true, 
            classes: {input: classes.input},
            startAdornment: (
              <InputAdornment position="start">
                <GiftIcon className=" pb-1"/>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <ArrowForwardIcon className="pt-1" onClick={handleSubmit} />
              </InputAdornment>
            )
          }}
        /> 
        </div>
      </div>
    </div>
  );
};
