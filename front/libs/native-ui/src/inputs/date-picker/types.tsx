import dayjs from "dayjs";

// Types
type Error = {
  message?: string,
  type?: string
}

export type TPicker = 'date' | 'range';

type BaseDatePickerProps<T extends TPicker> = {
  name?: string
  mode: 'datetime' | 'date' | 'time'
  format?: 'MM/DD/YYYY' | 'M/D/YYYY' | 'MM/DD/YY' | 'DD/MM/YYYY' | 'DD/MM/YY'
  hidden?: [dayjs.Dayjs | undefined, dayjs.Dayjs | undefined][]
  theme?: 'light' | 'dark'
  label?: string
  error?: Error
}

export type DatePickerProps<T extends TPicker> =
  T extends 'range'
  ? {
    placeholder?: [string, string]
    pickerType: T
    defaultValue?: [dayjs.Dayjs | undefined, dayjs.Dayjs | undefined]
    disabled?: [[dayjs.Dayjs | undefined, dayjs.Dayjs | undefined], [dayjs.Dayjs | undefined, dayjs.Dayjs | undefined]]
    onChange?: (value?: [dayjs.Dayjs, dayjs.Dayjs]) => void
  } & BaseDatePickerProps<T>
  : {
    placeholder?: string
    pickerType: T
    defaultValue?: dayjs.Dayjs
    onChange?: (value?: dayjs.Dayjs) => void
    disabled?: [dayjs.Dayjs | undefined, dayjs.Dayjs | undefined]
  } & BaseDatePickerProps<T>
