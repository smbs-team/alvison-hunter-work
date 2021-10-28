import { Button } from '@material-ui/core';
import { ReactNode, FC } from "react";
import { useForm, Control } from 'react-hook-form';
import './FormViewTemplate.scss';
interface FCExtension {
  control: Control<any>;
}

interface FormViewTemplateProps {
  submitFunc: (form: any) => void;
  title?: string;
  subTitle?: ReactNode;
  formFragments: FC<FCExtension>[];
  buttonText: string;
  footerLink?: ReactNode;
  defaultValues: { [key: string]: any };
  noPaddingTop?: boolean;
}

/**
 * A component for the login view.
 */
/**
 * This component can take a number of the form templates and combine them into something more usable.
 * It can take a function that is called when the form is submitted and a number of other content items
 * that can be passed into it.
 * @param param0 
 * @returns 
 */
export const FormViewTemplate = ({
  submitFunc,
  title,
  subTitle,
  formFragments,
  buttonText,
  footerLink,
  defaultValues,
  noPaddingTop,
}: FormViewTemplateProps) => {
  const formControls = useForm({
    defaultValues,
  });
  const { handleSubmit, control } = formControls;
  return (
    <div className={`${!noPaddingTop && 'pt-8 pb-8'} sign-in-form`}>
      <div className="pt-8">
        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit(submitFunc)}
            className="formWidth mt-1"
          >
            <div>
              {title && <div className="font-bold text-base text-4xl font-sofia">{title}</div>}
            </div>
            <div>
              {subTitle && <div className="font-bold text-base text-l mt-1 font-sofia">{subTitle}</div>}
            </div>
            <div className="mt-1_5">
            {formFragments.map((Fragment, idx) => (
              <Fragment key={idx} control={control} />
            ))}
            </div>
            <div className="flex justify-center mt-1_5">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="w-full p-1_5 font-sofia"
                size="large"
              >
                {buttonText}
              </Button>
            </div>
            <div className="text-base mt-2_5">
              <div className="text-s flex justify-center font-sofia">{footerLink && footerLink}</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
