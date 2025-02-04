import { TextInputProps } from 'react-native';

// Types
type Error = {
  message?: string;
  type?: string;
};

export type TInput = 'single' | 'range';

type BaseMoneyInputProps = {
  name?: string;
  label?: string;
  error?: Error;
  accuracy?: 0 | 2;
} & Omit<TextInputProps, 'value' | 'defaultValue' | 'onChange'>;

export type MoneyInputProps<T extends TInput> = T extends 'range'
  ? {
      inputType?: T;
      defaultValue?: [number, number];
      limits?: [[number | null, number | null], [number | null, number | null]];
      onChange?: (value?: [number | null, number | null]) => void;
    } & BaseMoneyInputProps
  : {
      inputType?: T;
      defaultValue?: number;
      onChange?: (value?: number) => void;
      limits?: [number | null, number | null];
    } & BaseMoneyInputProps;
