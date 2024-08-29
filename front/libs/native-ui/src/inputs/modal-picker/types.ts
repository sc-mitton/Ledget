import { View } from "react-native";

type Error = {
  message?: string,
  type?: string
}

export type TContext = {
  setShowModalOverlay: (value: boolean) => void;
}

export type PickerOption = {
  [key: string]: any;
} | string;

type BaseModalPickerProps<O extends PickerOption, TMultiple extends boolean> = {
  multiple?: TMultiple;
  options?: O[];
  placeholder?: string;
  labelKey?: O extends { [key: string]: any } ? keyof O : never;
  valueKey?: O extends { [key: string]: any } ? keyof O : never;
  error?: Error;
  label?: string;
  searchable?: boolean;
  header?: string
  renderOption?: (option: O, index: number, selected: boolean) => React.ReactNode;
  renderSelected?: (option: O, index: number) => React.ReactNode;
}

export type ModalPickerProps<O extends PickerOption, TMultiple extends boolean> =
  TMultiple extends true
  ? { onChange?: (value: any[]) => void } & BaseModalPickerProps<O, TMultiple>
  : { onChange?: (value: any) => void } & BaseModalPickerProps<O, TMultiple>;
