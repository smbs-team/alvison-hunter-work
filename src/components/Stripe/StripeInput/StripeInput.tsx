import { useImperativeHandle, useRef, Ref } from 'react';
import { StripeElementComp } from '../../../interfaces';

type RefObject = {
  focus: () => void;
} | null;

interface IStripeInputProps {
  component: StripeElementComp;
  inputRef: Ref<RefObject>;
}

export const StripeInput = ({
  component: Component,
  inputRef,
  ...props
}: IStripeInputProps) => {
  const elementRef = useRef<HTMLInputElement>();
  useImperativeHandle(inputRef, () => ({
    focus: () => elementRef?.current?.focus,
  }));
  return (
    <Component
      onReady={(element: any) => (elementRef.current = element)}
      {...props}
    />
  );
};
