import { useState } from 'react';

import { Control } from 'react-hook-form';

import { FormInputButton2, BakedListBox } from '@ledget/ui';

const baseopts = [
  { id: 1, value: 'month', label: 'Monthly', disabled: false, default: true },
  { id: 2, value: 'year', label: 'Yearly', disabled: false, default: false },
  { id: 3, value: 'once', label: 'Once', disabled: true, default: false },
];

interface P {
  hasLabel?: boolean;
  labelPrefix?: string;
  control: Control<any>;
  excludeOnce?: boolean;
  name?: string;
}

const PeriodSelect = (props: P) => {
  const { hasLabel, excludeOnce = false, labelPrefix, control, name } = props;

  return (
    <>
      {hasLabel && <label htmlFor="period">Refreshes</label>}
      <BakedListBox
        placement="left"
        placeholder=" "
        control={control as any}
        name={name}
        as={FormInputButton2}
        options={baseopts.filter((o) =>
          excludeOnce ? o.value !== 'once' : true
        )}
        labelPrefix={labelPrefix}
      />
    </>
  );
};

export default PeriodSelect;
