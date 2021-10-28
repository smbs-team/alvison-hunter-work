import '../styles/checkbox-or-radio.scss';

/**
 *
 * This is a reusable component with our custom checkboxes and radio inputs.
 * In the future, these need to be sized to dynamically resize
 */
export const CheckboxOrRadio = ({
  onChangeFunc,
  checked,
  label,
  LabelComp,
  type,
  val,
  disabled,
}: {
  onChangeFunc: (val: any) => void;
  checked: boolean;
  label?: string;
  LabelComp?: any;
  type: string;
  val?: any;
  disabled?: boolean;
}) => {
  return (
    <label className={`${type}-holder ${disabled ? 'disabled' : ''}`}>
      <input
        type={type}
        checked={checked}
        disabled={disabled}
        onChange={(e) => {
          onChangeFunc(type === 'checkbox' ? e.target.checked : val);
        }}
      />
      <span className={`checkmark ${checked ? 'checked' : ''}`} />
      <div className="label-text">
        {LabelComp ? <LabelComp /> : label ? label : ''}
      </div>
    </label>
  );
};
