import type { Dayjs } from 'dayjs'

// Types
export type TPicker = 'date' | 'range';

type TSelectedValue<T extends TPicker> =
  T extends 'range'
  ? [Dayjs | undefined, Dayjs | undefined]
  : Dayjs

type BaseDatePickerProps = {
  name?: string
  period: 'day' | 'month' | 'year'
  format?: 'MM/DD/YYYY' | 'M/D/YYYY' | 'MM/DD/YY' | 'DD/MM/YYYY' | 'DD/MM/YY'
  closeOnSelect?: boolean
  disabled?: [Dayjs | undefined, Dayjs | undefined][]
  hidden?: [Dayjs | undefined, Dayjs | undefined][]
  disabledStyle?: 'muted' | 'highlighted'
  autoFocus?: boolean
  placement?: 'left' | 'right' | 'middle'
  verticlePlacement?: 'top' | 'bottom'
} & ({
  hideInputElement: true,
  dropdownVisible: boolean,
  setDropdownVisible: React.Dispatch<React.SetStateAction<boolean>>,
} | {
  hideInputElement: false,
  dropdownVisible?: never
  setDropdownVisible?: never,
})

export type DatePickerProps<T extends TPicker> =
  T extends 'range'
  ? {
    placeholder?: [string, string]
    pickerType: T
    defaultValue?: [Dayjs, Dayjs]
    onChange?: (value?: [Dayjs, Dayjs]) => void
  } & BaseDatePickerProps
  : {
    placeholder?: string
    pickerType: T
    defaultValue?: Dayjs
    onChange?: (value?: Dayjs) => void
  } & BaseDatePickerProps

type P = 'defaultValue' | 'disabled' | 'pickerType' | 'period' | 'hidden' | 'disabledStyle'
export type UnenrichedDatePickerProps<T extends TPicker> = Omit<DatePickerProps<T>, P>
export type DatePickerContextProps<T extends TPicker> = Pick<DatePickerProps<T>, P>

export type TDatePickerContext<TP extends TPicker> =
  (TP extends 'range'
    ? {
      pickerType: TP
      selectedValue?: TSelectedValue<TP>
      setSelectedValue: React.Dispatch<TSelectedValue<TP> | undefined>
      inputTouchCount: [number, number]
      disabled?: [[Dayjs, Dayjs] | undefined, [Dayjs, Dayjs] | undefined]
      setInputTouchCount: React.Dispatch<React.SetStateAction<[number, number] | undefined>>
    }
    : {
      pickerType: TP
      selectedValue?: TSelectedValue<TP>
      setSelectedValue: React.Dispatch<TSelectedValue<TP> | undefined>
      inputTouchCount: number
      disabled?: [Dayjs, Dayjs]
      setInputTouchCount: React.Dispatch<React.SetStateAction<number | undefined>>
    }) & {
      focusedInputIndex?: 0 | 1
      setFocusedInputIndex: React.Dispatch<React.SetStateAction<0 | 1 | undefined>>
    } & DatePickerContextProps<TP>

export type CalendarCellProps = {
  isDisabled?: boolean
  isOverflow?: boolean
  isWindowStart?: boolean
  isWindowEnd?: boolean
  isActive?: boolean
  isSelected?: boolean
  isToday?: boolean
  isActiveWindowStart?: boolean
  isActiveWindowEnd?: boolean
  extraPadded?: boolean
}

export type DaysProps = {
  month: number
  year: number
  activeDay?: Dayjs
  setActiveDay: React.Dispatch<React.SetStateAction<Dayjs | undefined>>
}

export type YearsMonthsProps = {
  windowCenter: Dayjs
  onSelect: (month: Dayjs) => void
}
