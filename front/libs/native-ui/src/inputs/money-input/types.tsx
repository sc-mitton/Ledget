import { TextInputProps } from "react-native";

// Types
type Error = {
  message?: string,
  type?: string
}

export type TInput = 'date' | 'range';

type BaseMoneyInputProps<T extends TInput> = {
  name?: string
  label?: string
  error?: Error
  accuracy?: 0 | 2
} & Omit<TextInputProps, 'value' | 'defaultValue' | 'onChange'>

export type MoneyInputProps<T extends TInput> =
  T extends 'range'
  ? {
    inputType: T
    defaultValue?: [number, number]
    disabled?: [[number | undefined, number | undefined], [number | undefined, number | undefined]]
    onChange?: (value?: [number | undefined, number | undefined]) => void
  } & BaseMoneyInputProps<T>
  : {
    inputType: T
    defaultValue?: number
    onChange?: (value?: number) => void
    disabled?: [number | undefined, number | undefined]
  } & BaseMoneyInputProps<T>
