import dayjs from 'dayjs';

// Types
type Error = {
  message?: string;
  type?: string;
};

export type TPicker = 'date' | 'range';

type BaseDatePickerProps = {
  name?: string;
  mode: 'datetime' | 'date' | 'time';
  format?: 'MM/DD/YYYY' | 'M/D/YYYY' | 'MM/DD/YY' | 'DD/MM/YYYY' | 'DD/MM/YY';
  theme?: 'light' | 'dark';
  label?: string;
  error?: Error;
  icon?: boolean;
};

export type DatePickerProps<T extends TPicker> = T extends 'range'
  ? {
      placeholder?: [string, string];
      pickerType: T;
      title?: [string, string];
      defaultValue?: [dayjs.Dayjs | undefined, dayjs.Dayjs | undefined];
      disabled?: [
        [dayjs.Dayjs | undefined, dayjs.Dayjs | undefined],
        [dayjs.Dayjs | undefined, dayjs.Dayjs | undefined]
      ];
      onChange?: (value?: [dayjs.Dayjs, dayjs.Dayjs]) => void;
    } & BaseDatePickerProps
  : {
      placeholder?: string;
      pickerType: T;
      title?: string;
      defaultValue?: dayjs.Dayjs;
      onChange?: (value?: dayjs.Dayjs) => void;
      disabled?: [dayjs.Dayjs | undefined, dayjs.Dayjs | undefined];
    } & BaseDatePickerProps;
