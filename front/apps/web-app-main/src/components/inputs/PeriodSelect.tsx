import { FieldError } from 'react-hook-form';

import { FormInputButton2, BakedListBox } from '@ledget/ui';

const baseopts = [
  { id: 1, value: 'month', label: 'Monthly', disabled: false, default: true },
  { id: 2, value: 'year', label: 'Yearly', disabled: false, default: false },
  { id: 3, value: 'once', label: 'Once', disabled: false, default: false },
];

interface P {
  hasLabel?: boolean;
  labelPrefix?: string;
  excludeOnce?: boolean;
  name?: string;
  value?: (typeof baseopts)[number]['value'];
  onChange?: React.Dispatch<
    React.SetStateAction<(typeof baseopts)[number] | undefined>
  >;
  error?: FieldError;
}

const PeriodSelect = (props: P) => {
  const { hasLabel, excludeOnce = false, labelPrefix, name, error } = props;

  return (
    <>
      {hasLabel && <label htmlFor="period">Refreshes</label>}
      <BakedListBox
        placement="auto"
        placeholder=" "
        name={name}
        as={FormInputButton2}
        options={baseopts.filter((o) =>
          excludeOnce ? o.value !== 'once' : true
        )}
        multiple={false}
        defaultValue={props.value}
        onChange={(e) => {
          props.onChange?.(e);
        }}
        labelPrefix={labelPrefix}
        error={error}
      />
    </>
  );
};

export default PeriodSelect;
